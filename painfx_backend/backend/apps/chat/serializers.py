from rest_framework import serializers
from apps.chat.models import Connection, Message
from apps.authentication.models import User
from apps.authentication.serializers import UserSerializer

class SearchSerializer(UserSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'status'
        ]
    
    def get_status(self, obj):
        if obj.pending_them:
            return 'pending-them'
        elif obj.pending_me:
            return 'pending-me'
        elif obj.connected:
            return 'connected'
        return 'no-connection'


class RequestSerializer(serializers.ModelSerializer):
	sender = UserSerializer()
	receiver = UserSerializer()

	class Meta:
		model = Connection
		fields = [
			'id',
			'sender',
			'receiver',
			'created_at'
		]


class FriendSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()
    preview = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()

    class Meta:
        model = Connection
        fields = [
            'id',
            'friend',
            'preview',
            'updated_at'
        ]

    def get_friend(self, obj):
        # If I'm the sender
        if self.context['user'] == obj.sender:
            return UserSerializer(obj.receiver).data
        # If I'm the receiver
        elif self.context['user'] == obj.receiver:
            return UserSerializer(obj.sender).data
        else:
            raise ValueError('Error: No user found in friendserializer')

    def get_preview(self, obj):
        default = 'New connection'
        if not hasattr(obj, 'latest_text'):
            return default
        return obj.latest_text or default

    def get_updated_at(self, obj):
        if not hasattr(obj, 'latest_created'):
            date = obj.updated_at
        else:
            date = obj.latest_created or obj.updated_at
        return date.isoformat()





class MessageSerializer(serializers.ModelSerializer):
	is_me = serializers.SerializerMethodField()

	class Meta:
		model = Message
		fields = [
			'id',
			'is_me',
			'text',
			'created_at'
		]

	def get_is_me(self, obj):
		return self.context['user'] == obj.user