import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_anonymous:
            await self.close()
        else:
            self.user_id = str(user.id)
            await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json['type']
        if message_type == 'search':
            await self.receive_search(text_data_json)
        elif message_type == 'request_accept':
            await self.receive_request_accept(text_data_json)
        elif message_type == 'request_connect':
            await self.receive_request_connect(text_data_json)
        elif message_type == 'message':
            await self.receive_message(text_data_json)
        elif message_type == 'message_type':
            await self.receive_message_type(text_data_json)


    async def receive_search(self, data):
        search_term = data.get('search')
        users = User.objects.filter(username__icontains=search_term) \
            .exclude(id=self.scope['user'].id).annotate()
        user_list = [{'id': str(user.id), 'username': user.username} for user in users]
        await self.send(text_data=json.dumps({'type': 'search_results', 'users': user_list}))

    async def receive_request_accept(self, data):
        request = await self.get_request(sender__id=data.get('user_id'), receiver__id=self.user_id, status='pending')
        request.status = 'accepted'
        request.save()
        await self.send_group(self.user_id, 'request_accepted', {'user_id': data.get('user_id')})
        await self.send_group(data.get('user_id'), 'request_accepted', {'user_id': self.user_id})

    async def receive_request_connect(self, data):
        receiver = User.objects.get(id=data.get('user_id'))
        request, created = await self.create_request(sender_id=self.user_id, receiver_id=receiver.id)
        if created:
            await self.send_group(receiver.id, 'request_received', {'user_id': self.user_id})

    async def receive_message(self, data):
        recipient_id = data.get('user_id')
        message = data.get('message')
        await self.send_group(recipient_id, 'message', {'user_id': self.user_id, 'message': message})

    async def receive_message_type(self, data):
        recipient_id = data.get('user_id')
        await self.send_group(str(recipient_id), 'message.type', {'user_id': str(self.scope['user'].id)})

    async def send_group(self, group_name, message_type, data):
        await self.channel_layer.send(
            'chat_group_' + group_name,
            {
                'type': message_type,
                'data': data
            }
        )

    async def get_request(self, **kwargs):
        from apps.chat.models import ChatRequest
        try:
            return await async_to_sync(ChatRequest.objects.get)(**kwargs)
        except ChatRequest.DoesNotExist:
            return None

    async def create_request(self, sender_id, receiver_id):
        from apps.chat.models import ChatRequest
        from django.db import transaction
        try:
            with transaction.atomic():
                request = await async_to_sync(ChatRequest.objects.create)(sender_id=sender_id, receiver_id=receiver_id, status='pending')
                return request, True
        except Exception as e:
            return None, False

    async def request_received(self, event):
        await self.send(text_data=json.dumps({'type': 'request_received', 'user_id': event['data']['user_id']}))

    async def request_accepted(self, event):
        await self.send(text_data=json.dumps({'type': 'request_accepted', 'user_id': event['data']['user_id']}))

    async def message(self, event):
        await self.send(text_data=json.dumps({'type': 'message', 'user_id': event['data']['user_id'], 'message': event['data']['message']}))

    async def message_type(self, event):
        await self.send(text_data=json.dumps({'type': 'message_type', 'user_id': event['data']['user_id']}))

    async def search_results(self, event):
        await self.send(text_data=json.dumps({'type': 'search_results', 'users': event['data']['users']}))

