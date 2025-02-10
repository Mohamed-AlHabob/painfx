import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.db.models import Q
from apps.chat.models import Connection, Message
from apps.authentication.models import User
from apps.chat.serializers import ConnectionSerializer, MessageSerializer

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if self.user.is_anonymous:
            await self.send(text_data=json.dumps({
                'error': 'Authentication required'
            }))
            await self.close()
        else:
            await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            source = text_data_json.get('source')

            if not source:
                await self.send(text_data=json.dumps({
                    'error': 'Missing "source" in message'
                }))
                return

            handlers = {
                'search': self.handle_search,
                'request.accept': self.handle_request_accept,
                'request.connect': self.handle_request_connect,
                'message.send': self.handle_message_send,
                'message.type': self.handle_message_type,
                'request.list': self.handle_request_list,
                'friend.list': self.handle_friend_list,
                'message.list': self.handle_message_list,
            }

            handler = handlers.get(source)
            if handler:
                await handler(text_data_json)
            else:
                await self.send(text_data=json.dumps({
                    'error': f'Unhandled message source: {source}'
                }))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'error': 'Invalid JSON format'
            }))

    @staticmethod
    @database_sync_to_async
    def get_connections(user):
        return list(Connection.objects.filter(Q(sender=user) | Q(receiver=user)))

    @sync_to_async
    def get_messages(self, connection_id, page=0):
        connection = Connection.objects.get(id=connection_id)
        messages = Message.objects.filter(connection=connection).order_by('-created_at')
        page_size = 15
        start = page * page_size
        end = start + page_size
        return messages[start:end], messages.count() > end

    async def handle_search(self, data):
        query = data.get('query', '')
        users = await sync_to_async(list)(User.objects.filter(username__icontains=query).exclude(id=self.user.id))
        serialized_users = [{'id': user.id, 'username': user.username} for user in users]
        await self.send(text_data=json.dumps({
            'source': 'search',
            'data': serialized_users
        }))

    async def handle_request_accept(self, data):
        sender_id = data.get('userId')

        if not sender_id:
            await self.send(text_data=json.dumps({
                'error': 'Missing "userId" in data'
            }))
            return

        try:
            connection = await sync_to_async(Connection.objects.get)(sender__id=sender_id, receiver=self.user)
            connection.accepted = True
            await sync_to_async(connection.save)()
            serializer = ConnectionSerializer(connection)
            await self.send(text_data=json.dumps({
                'source': 'request.accept',
                'data': serializer.data
            }))
        except Connection.DoesNotExist:
            await self.send(text_data=json.dumps({
                'error': f'Connection with sender id {sender_id} does not exist'
            }))

    async def handle_request_connect(self, data):
        receiver_id = data.get('userId')

        if not receiver_id:
            await self.send(text_data=json.dumps({
                'error': 'Missing "userId" in data'
            }))
            return

        try:
            receiver = await sync_to_async(User.objects.get)(id=receiver_id)
            connection, created = await sync_to_async(Connection.objects.get_or_create)(
                sender=self.user,
                receiver=receiver
            )
            serializer = ConnectionSerializer(connection)
            await self.send(text_data=json.dumps({
                'source': 'request.connect',
                'data': serializer.data
            }))
        except User.DoesNotExist:
            await self.send(text_data=json.dumps({
                'error': f'User with id {receiver_id} does not exist'
            }))

    async def handle_message_send(self, data):
        connection_id = data.get('connectionId')
        message_text = data.get('message')

        if not connection_id or not message_text:
            await self.send(text_data=json.dumps({
                'error': 'Missing "connectionId" or "message" in data'
            }))
            return

        try:
            connection = await sync_to_async(Connection.objects.get)(id=connection_id)
            message = await sync_to_async(Message.objects.create)(
                connection=connection,
                sender=self.user,
                text=message_text
            )
            serializer = MessageSerializer(message)
            await self.send(text_data=json.dumps({
                'source': 'message.send',
                'data': {
                    'message': serializer.data,
                    'friend': {
                        'id': connection.receiver.id if connection.sender == self.user else connection.sender.id,
                        'username': connection.receiver.username if connection.sender == self.user else connection.sender.username
                    }
                }
            }))
        except Connection.DoesNotExist:
            await self.send(text_data=json.dumps({
                'error': f'Connection with id {connection_id} does not exist'
            }))

    async def handle_message_type(self, data):
        user_id = data.get('userId')

        if not user_id:
            await self.send(text_data=json.dumps({
                'error': 'Missing "userId" in data'
            }))
            return

        await self.send(text_data=json.dumps({
            'source': 'message.type',
            'data': {'userId': user_id}
        }))

    async def handle_request_list(self, data):
        connections = await self.get_connections(self.user)
        serializer = ConnectionSerializer(connections, many=True)
        await self.send(text_data=json.dumps({
            'source': 'request.list',
            'data': serializer.data
        }))

    async def handle_friend_list(self, data):
        connections = await self.get_connections(self.user)
        serializer = ConnectionSerializer(connections, many=True)
        await self.send(text_data=json.dumps({
            'source': 'friend.list',
            'data': serializer.data
        }))

    async def handle_message_list(self, data):
        connection_id = data.get('connectionId')
        page = data.get('page', 0)

        if not connection_id:
            await self.send(text_data=json.dumps({
                'error': 'Missing "connectionId" in data'
            }))
            return

        try:
            page = int(page)  # Ensure page is an integer
            if page < 0:
                page = 0
        except (TypeError, ValueError):
            page = 0

        try:
            messages, has_more = await self.get_messages(connection_id, page)
            serializer = MessageSerializer(messages, many=True)
            connection = await sync_to_async(Connection.objects.get)(id=connection_id)
            friend = connection.receiver if connection.sender == self.user else connection.sender
            await self.send(text_data=json.dumps({
                'source': 'message.list',
                'data': {
                    'messages': serializer.data,
                    'next': page + 1 if has_more else None,
                    'friend': {
                        'id': friend.id,
                        'username': friend.username
                    }
                }
            }))
        except Connection.DoesNotExist:
            await self.send(text_data=json.dumps({
                'error': f'Connection with id {connection_id} does not exist'
            }))