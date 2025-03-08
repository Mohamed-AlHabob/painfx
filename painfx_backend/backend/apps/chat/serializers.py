from rest_framework import serializers
from apps.chat.models import Connection, Message , MessageAttachment
from apps.authentication.models import User
from apps.authentication.serializers import UserSerializer

class SearchSerializer(UserSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'is_online',
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
        friend = obj.receiver if self.context['user'] == obj.sender else obj.sender
        return UserSerializer(friend).data

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

class MessageAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageAttachment
        fields = ['id', 'file', 'file_type']
        read_only_fields = ['id']

class MessageSerializer(serializers.ModelSerializer):
    is_me = serializers.SerializerMethodField()
    user = UserSerializer()
    attachments = MessageAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Message
        fields = [
            'id',
            'is_me',
            'text',
            'read_at',
            'user',
            'created_at',
            'attachments'
        ]
        read_only_fields = ['id', 'created_at']

    def validate(self, data):
        if not data.get('text') and not data.get('attachments'):
            raise serializers.ValidationError("Either text or attachments must be provided.")
        return data
    
    def get_is_me(self, obj):
        return self.context.get('user') == obj.user