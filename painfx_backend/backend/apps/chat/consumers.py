import json
import base64
import logging
from django.db.models import Q, OuterRef, Exists
from django.db.models.functions import Coalesce
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.files.base import ContentFile
from django.core.exceptions import ValidationError
from apps.chat.models import Connection, Message, MessageAttachment
from apps.chat.serializers import (
    FriendSerializer,
    MessageSerializer,
    RequestSerializer,
    SearchSerializer
)
from apps.authentication.serializers import UserSerializer
from apps.authentication.models import User

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        try:
            user = self.scope['user']
            if not user.is_authenticated:
                logger.warning("Unauthenticated user attempted to connect.")
                await self.close()
                return

            await self.mark_user_online(user)
            await self.channel_layer.group_add(str(user.id), self.channel_name)
            await self.accept()
        except Exception as e:
            logger.error(f"Error during WebSocket connection: {e}")
            await self.close()

    async def disconnect(self, close_code):
        user = self.scope['user']
        await self.mark_user_offline(user)
        await self.channel_layer.group_discard(str(user.id), self.channel_name)

    async def receive_json(self, content, **kwargs):
        data_source = content.get('source')
        handlers = {
            'friend.list': self.handle_friend_list,
            'message.list': self.handle_message_list,
            'message.send': self.handle_message_send,
            'message.type': self.handle_message_type,
            'request.accept': self.handle_request_accept,
            'request.reject': self.handle_request_reject,
            'request.connect': self.handle_request_connect,
            'request.list': self.handle_request_list,
            'search': self.handle_search,
            'thumbnail': self.handle_thumbnail,
            'typing': self.handle_typing,
            'webrtc.offer': self.handle_webrtc_offer,
            'webrtc.answer': self.handle_webrtc_answer,
            'webrtc.ice_candidate': self.handle_webrtc_ice_candidate,
        }
        handler = handlers.get(data_source)
        if handler:
            try:
                await handler(content)
            except Exception as e:
                logger.exception("Error handling %s: %s", data_source, e)
                await self.send_json({'source': 'error', 'data': {'message': str(e)}})
        else:
            logger.error("No handler found for source: %s", data_source)

    # --------------------------
    # Friend and Message Handlers
    # --------------------------
    async def handle_friend_list(self, content):
        user = self.scope['user']
        connections = await database_sync_to_async(self.get_friend_list)(user)
        await self.send_json({'source': 'friend.list', 'data': connections})

    def get_friend_list(self, user):
        latest_message = Message.objects.filter(
            connection=OuterRef('id')
        ).order_by('-created_at')[:1]

        connections = Connection.objects.filter(
            Q(sender=user) | Q(receiver=user),
            status=Connection.STATUS_ACCEPTED
        ).annotate(
            latest_text=latest_message.values('text'),
            latest_created=latest_message.values('created_at')
        ).order_by(Coalesce('latest_created', 'updated_at').desc())
        return FriendSerializer(connections, context={'user': user}, many=True).data

    async def handle_message_list(self, content):
        user = self.scope['user']
        connection_id = content.get('connectionId')
        page = content.get('page', 0)
        page_size = 15
        data = await database_sync_to_async(self.get_message_list)(user, connection_id, page, page_size)
        await self.send_json({'source': 'message.list', 'data': data})

    def get_message_list(self, user, connection_id, page, page_size):
        try:
            connection = Connection.objects.get(id=connection_id)
        except Connection.DoesNotExist:
            return {'error': 'Connection not found'}

        messages = Message.objects.filter(connection=connection).order_by('-created_at')[
            page * page_size:(page + 1) * page_size
        ]
        serialized_messages = MessageSerializer(messages, context={'user': user}, many=True).data
        recipient = connection.receiver if connection.sender == user else connection.sender
        serialized_friend = UserSerializer(recipient).data
        messages_count = Message.objects.filter(connection=connection).count()
        next_page = page + 1 if messages_count > (page + 1) * page_size else None
        return {'messages': serialized_messages, 'next': next_page, 'friend': serialized_friend}

    async def handle_message_send(self, content):
        user = self.scope['user']
        connection_id = content.get('connectionId')
        message_text = content.get('message', '')
        attachments = content.get('attachments', [])
        message = await database_sync_to_async(self.create_message_with_attachments)(
            user, connection_id, message_text, attachments
        )
        if message:
            recipient = await database_sync_to_async(self.get_other_participant)(message.connection, user)
            serialized_message = await database_sync_to_async(MessageSerializer)(message, context={'user': user}).data
            serialized_friend = await database_sync_to_async(UserSerializer)(recipient).data
            await self.send_to_group(str(recipient.id), 'message.send', {
                'message': serialized_message,
                'friend': serialized_friend
            })
        else:
            await self.send_json({'source': 'error', 'data': {'message': 'Failed to send message'}})

    def create_message_with_attachments(self, user, connection_id, message_text, attachments_data):
        try:
            connection = Connection.objects.get(id=connection_id)
        except Connection.DoesNotExist:
            logger.error("Connection %s does not exist.", connection_id)
            return None

        message = Message.objects.create(connection=connection, user=user, text=message_text)
        for attachment in attachments_data:
            base64_data = attachment.get('base64')
            filename = attachment.get('filename')
            file_type = attachment.get('file_type', '')
            if base64_data and filename:
                try:
                    file_data = base64.b64decode(base64_data)
                    django_file = ContentFile(file_data, name=filename)
                    MessageAttachment.objects.create(message=message, file=django_file, file_type=file_type)
                except Exception as e:
                    logger.exception("Error processing attachment: %s", e)
        return message

    @database_sync_to_async
    def get_other_participant(self, connection, user):
        return connection.receiver if connection.sender == user else connection.sender

    async def handle_message_type(self, content):
        user = self.scope['user']
        recipient_id = content.get('userId')
        await self.send_to_group(str(recipient_id), 'message.type', {'userId': str(user.id)})

    # --------------------------
    # Request Handlers (Connect, Accept, Reject)
    # --------------------------
    async def handle_request_connect(self, content):
        user = self.scope['user']
        try:
            receiver = await database_sync_to_async(User.objects.get)(id=content.get('userId'))
        except User.DoesNotExist:
            await self.send_json({'source': 'error', 'data': {'message': 'User not found'}})
            return

        connection, _ = await database_sync_to_async(Connection.objects.get_or_create)(
            sender=user,
            receiver=receiver,
            defaults={'status': Connection.STATUS_PENDING}
        )
        serialized = RequestSerializer(connection).data
        for usr in [connection.sender, connection.receiver]:
            await self.send_to_group(str(usr.id), 'request.connect', serialized)

    async def handle_request_accept(self, content):
        try:
            user = self.scope['user']
            sender_id = content.get('userId')
            connection = await database_sync_to_async(self.accept_request)(sender_id, user)
            if connection:
                serialized = RequestSerializer(connection).data
                for usr in [connection.sender, connection.receiver]:
                    await self.send_to_group(str(usr.id), 'request.accept', serialized)
                    serialized_friend = FriendSerializer(connection, context={'user': usr}).data
                    await self.send_to_group(str(usr.id), 'friend.new', serialized_friend)
            else:
                await self.send_json({'source': 'error', 'data': {'message': 'Connection not found or invalid'}})
        except Exception as e:
            logger.exception("Error handling request.accept: %s", e)
            await self.send_json({'source': 'error', 'data': {'message': str(e)}})

    def accept_request(self, sender_id, receiver):
        try:
            connection = Connection.objects.get(
                sender__id=sender_id,
                receiver=receiver,
                status=Connection.STATUS_PENDING
            )
            connection.status = Connection.STATUS_ACCEPTED
            connection.save()
            return connection
        except Connection.DoesNotExist:
            return None

    async def handle_request_reject(self, content):
        try:
            user = self.scope['user']
            sender_id = content.get('userId')
            connection = await database_sync_to_async(self.reject_request)(sender_id, user)
            if connection:
                serialized = RequestSerializer(connection).data
                await self.send_to_group(str(user.id), 'request.reject', serialized)
            else:
                await self.send_json({'source': 'error', 'data': {'message': 'Connection not found or invalid'}})
        except Exception as e:
            logger.exception("Error handling request.reject: %s", e)
            await self.send_json({'source': 'error', 'data': {'message': str(e)}})

    def reject_request(self, sender_id, receiver):
        try:
            connection = Connection.objects.get(
                sender__id=sender_id,
                receiver=receiver,
                status=Connection.STATUS_PENDING
            )
            connection.status = Connection.STATUS_REJECTED
            connection.save()
            return connection
        except Connection.DoesNotExist:
            return None

    async def handle_request_list(self, content):
        user = self.scope['user']
        connections = await database_sync_to_async(self.get_request_list)(user)
        await self.send_json({'source': 'request.list', 'data': connections})

    def get_request_list(self, user):
        requests = Connection.objects.filter(receiver=user, status=Connection.STATUS_PENDING)
        return RequestSerializer(requests, many=True).data

    async def handle_search(self, content):
        user = self.scope['user']
        query = content.get('query')
        results = await database_sync_to_async(self.search_users)(user, query)
        await self.send_json({'source': 'search', 'data': results})

    def search_users(self, user, query):
        users = User.objects.filter(
            Q(username__istartswith=query) |
            Q(first_name__istartswith=query) |
            Q(last_name__istartswith=query)
        ).exclude(id=user.id).annotate(
            pending_them=Exists(
                Connection.objects.filter(sender=user, receiver=OuterRef('id'), status=Connection.STATUS_PENDING)
            ),
            pending_me=Exists(
                Connection.objects.filter(sender=OuterRef('id'), receiver=user, status=Connection.STATUS_PENDING)
            ),
            connected=Exists(
                Connection.objects.filter(
                    Q(sender=user, receiver=OuterRef('id')) |
                    Q(receiver=user, sender=OuterRef('id')),
                    status=Connection.STATUS_ACCEPTED
                )
            )
        )
        return SearchSerializer(users, many=True).data

    async def handle_thumbnail(self, content):
        user = self.scope['user']
        base64_data = content.get('base64')
        filename = content.get('filename')
        if base64_data and filename:
            try:
                image = base64.b64decode(base64_data)
                from django.core.files.base import ContentFile
                await database_sync_to_async(user.thumbnail.save)(filename, ContentFile(image), save=True)
                serialized = UserSerializer(user).data
                await self.send_json({'source': 'thumbnail', 'data': serialized})
            except Exception as e:
                logger.exception("Error saving thumbnail: %s", e)
                await self.send_json({'source': 'error', 'data': {'message': 'Thumbnail upload failed'}})

    # --------------------------
    # Typing Indicator
    # --------------------------
    async def handle_typing(self, content):
        user = self.scope['user']
        connection_id = content.get('connectionId')
        typing = content.get('typing', True)
        try:
            connection = await database_sync_to_async(Connection.objects.get)(
                id=connection_id,
                sender=user
            )
            recipient = await database_sync_to_async(self.get_other_participant)(connection, user)
            await self.send_to_group(str(recipient.id), 'typing', {'userId': user.id, 'typing': typing})
        except Connection.DoesNotExist:
            await self.send_json({'source': 'error', 'data': {'message': 'Invalid connection'}})

    # --------------------------
    # WebRTC Signaling
    # --------------------------
    async def handle_webrtc_offer(self, content):
        user = self.scope['user']
        recipient_id = content.get('recipient_id')
        offer = content.get('offer')

        try:
            recipient = await database_sync_to_async(User.objects.get)(id=recipient_id)
            if not recipient.is_online:
                raise Exception("Recipient is offline.")
            await self.send_to_group(str(recipient_id), 'webrtc.offer', {
                'sender_id': str(user.id),
                'offer': offer
            })
        except User.DoesNotExist:
            await self.send_json({'source': 'error', 'data': {'message': 'Recipient not found'}})
        except Exception as e:
            await self.send_json({'source': 'error', 'data': {'message': str(e)}})

    async def handle_webrtc_answer(self, content):
        user = self.scope['user']
        recipient_id = content.get('recipient_id')
        answer = content.get('answer')

        try:
            recipient = await database_sync_to_async(User.objects.get)(id=recipient_id)
            if not recipient.is_online:
                raise Exception("Recipient is offline.")
            await self.send_to_group(str(recipient_id), 'webrtc.answer', {
                'sender_id': str(user.id),
                'answer': answer
            })
        except User.DoesNotExist:
            await self.send_json({'source': 'error', 'data': {'message': 'Recipient not found'}})
        except Exception as e:
            await self.send_json({'source': 'error', 'data': {'message': str(e)}})

    async def handle_webrtc_ice_candidate(self, content):
        user = self.scope['user']
        recipient_id = content.get('recipient_id')
        ice_candidate = content.get('ice_candidate')

        try:
            recipient = await database_sync_to_async(User.objects.get)(id=recipient_id)
            if not recipient.is_online:
                raise Exception("Recipient is offline.")
            await self.send_to_group(str(recipient_id), 'webrtc.ice_candidate', {
                'sender_id': str(user.id),
                'ice_candidate': ice_candidate
            })
        except User.DoesNotExist:
            await self.send_json({'source': 'error', 'data': {'message': 'Recipient not found'}})
        except Exception as e:
            await self.send_json({'source': 'error', 'data': {'message': str(e)}})

    # --------------------------
    # Helper Functions
    # --------------------------
    async def send_to_group(self, group, source, data):
        await self.channel_layer.group_send(group, {
            'type': 'broadcast_group',
            'source': source,
            'data': data
        })

    async def broadcast_group(self, event):
        await self.send_json({'source': event['source'], 'data': event['data']})

    @database_sync_to_async
    def mark_user_online(self, user):
        user.is_online = True
        user.save()

    @database_sync_to_async
    def mark_user_offline(self, user):
        user.is_online = False
        user.save()