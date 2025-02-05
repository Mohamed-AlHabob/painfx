import base64
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.apps import apps
from django.core.files.base import ContentFile
from django.db.models import Q, Exists, OuterRef
from django.db.models.functions import Coalesce

from apps.authentication.serializers import UserSerializer
from apps.chat.serializers import (
    SearchSerializer,
    RequestSerializer,
    FriendSerializer,
    MessageSerializer
)


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        user = self.scope['user']
        print(user, user.is_authenticated)

        if not user.is_authenticated:
            self.close()
            return

        self.username = user.username

        # Join user to a group
        async_to_sync(self.channel_layer.group_add)(
            self.username, self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.username, self.channel_name
        )

    # -----------------------
    # Handle Incoming Messages
    # -----------------------

    def receive(self, text_data):
        data = json.loads(text_data)
        data_source = data.get('source')

        print('Received:', json.dumps(data, indent=2))

        # Route message to the correct handler
        handlers = {
            'friend.list': self.receive_friend_list,
            'message.list': self.receive_message_list,
            'message.send': self.receive_message_send,
            'message.type': self.receive_message_type,
            'request.accept': self.receive_request_accept,
            'request.connect': self.receive_request_connect,
            'request.list': self.receive_request_list,
            'search': self.receive_search,
            'thumbnail': self.receive_thumbnail
        }

        if data_source in handlers:
            handlers[data_source](data)

    def receive_friend_list(self, data):
        user = self.scope['user']
        Connection = apps.get_model('chat', 'Connection')
        Message = apps.get_model('chat', 'Message')

        latest_message = Message.objects.filter(
            connection=OuterRef('id')
        ).order_by('-created_at')[:1]

        connections = Connection.objects.filter(
            Q(sender=user) | Q(receiver=user),
            accepted=True
        ).annotate(
            latest_text=latest_message.values('text'),
            latest_created=latest_message.values('created_at')
        ).order_by(Coalesce('latest_created', 'updated_at').desc())

        serialized = FriendSerializer(connections, context={'user': user}, many=True)
        self.send_group(user.username, 'friend.list', serialized.data)

    def receive_message_list(self, data):
        user = self.scope['user']
        connection_id = data.get('connectionId')
        page = data.get('page', 0)
        page_size = 15

        Connection = apps.get_model('chat', 'Connection')
        Message = apps.get_model('chat', 'Message')
        User = apps.get_model('authentication', 'User')

        try:
            connection = Connection.objects.get(id=connection_id)
        except Connection.DoesNotExist:
            print('Error: Connection not found')
            return

        messages = Message.objects.filter(
            connection=connection
        ).order_by('-created_at')[page * page_size:(page + 1) * page_size]

        serialized_messages = MessageSerializer(messages, context={'user': user}, many=True)

        recipient = connection.receiver if connection.sender == user else connection.sender
        serialized_friend = UserSerializer(recipient)

        messages_count = Message.objects.filter(connection=connection).count()
        next_page = page + 1 if messages_count > (page + 1) * page_size else None

        data = {
            'messages': serialized_messages.data,
            'next': next_page,
            'friend': serialized_friend.data
        }
        self.send_group(user.username, 'message.list', data)

    def receive_message_send(self, data):
        user = self.scope['user']
        connection_id = data.get('connectionId')
        message_text = data.get('message')

        Connection = apps.get_model('chat', 'Connection')
        Message = apps.get_model('chat', 'Message')

        try:
            connection = Connection.objects.get(id=connection_id)
        except Connection.DoesNotExist:
            print('Error: Connection not found')
            return

        message = Message.objects.create(
            connection=connection,
            user=user,
            text=message_text
        )

        recipient = connection.receiver if connection.sender == user else connection.sender

        for recipient_user in [user, recipient]:
            serialized_message = MessageSerializer(message, context={'user': recipient_user})
            serialized_friend = UserSerializer(recipient if recipient_user == user else user)
            self.send_group(recipient_user.username, 'message.send', {
                'message': serialized_message.data,
                'friend': serialized_friend.data
            })

    def receive_message_type(self, data):
        user = self.scope['user']
        recipient_username = data.get('username')
        self.send_group(recipient_username, 'message.type', {'username': user.username})

    def receive_request_accept(self, data):
        Connection = apps.get_model('chat', 'Connection')

        try:
            connection = Connection.objects.get(
                sender__username=data.get('username'),
                receiver=self.scope['user']
            )
        except Connection.DoesNotExist:
            print('Error: Connection does not exist')
            return

        connection.accepted = True
        connection.save()

        serialized = RequestSerializer(connection)

        for user in [connection.sender, connection.receiver]:
            self.send_group(user.username, 'request.accept', serialized.data)

            serialized_friend = FriendSerializer(connection, context={'user': user})
            self.send_group(user.username, 'friend.new', serialized_friend.data)

    def receive_request_connect(self, data):
        User = apps.get_model('authentication', 'User')
        Connection = apps.get_model('chat', 'Connection')

        try:
            receiver = User.objects.get(username=data.get('username'))
        except User.DoesNotExist:
            print('Error: User not found')
            return

        connection, _ = Connection.objects.get_or_create(
            sender=self.scope['user'],
            receiver=receiver
        )

        serialized = RequestSerializer(connection)

        for user in [connection.sender, connection.receiver]:
            self.send_group(user.username, 'request.connect', serialized.data)

    def receive_request_list(self, data):
        user = self.scope['user']
        Connection = apps.get_model('chat', 'Connection')

        connections = Connection.objects.filter(receiver=user, accepted=False)
        serialized = RequestSerializer(connections, many=True)

        self.send_group(user.username, 'request.list', serialized.data)

    def receive_search(self, data):
        User = apps.get_model('authentication', 'User')
        Connection = apps.get_model('chat', 'Connection')

        query = data.get('query')
        users = User.objects.filter(
            Q(username__istartswith=query) |
            Q(first_name__istartswith=query) |
            Q(last_name__istartswith=query)
        ).exclude(username=self.username).annotate(
            pending_them=Exists(Connection.objects.filter(sender=self.scope['user'], receiver=OuterRef('id'), accepted=False)),
            pending_me=Exists(Connection.objects.filter(sender=OuterRef('id'), receiver=self.scope['user'], accepted=False)),
            connected=Exists(Connection.objects.filter(Q(sender=self.scope['user'], receiver=OuterRef('id')) | Q(receiver=self.scope['user'], sender=OuterRef('id')), accepted=True))
        )

        serialized = SearchSerializer(users, many=True)
        self.send_group(self.username, 'search', serialized.data)

    def receive_thumbnail(self, data):
        user = self.scope['user']
        image = ContentFile(base64.b64decode(data.get('base64')))
        user.thumbnail.save(data.get('filename'), image, save=True)

        serialized = UserSerializer(user)
        self.send_group(self.username, 'thumbnail', serialized.data)

    # -----------------------
    # Helper Functions
    # -----------------------

    def send_group(self, group, source, data):
        async_to_sync(self.channel_layer.group_send)(group, {
            'type': 'broadcast_group',
            'source': source,
            'data': data
        })

    def broadcast_group(self, data):
        self.send(text_data=json.dumps({'source': data['source'], 'data': data['data']}))
