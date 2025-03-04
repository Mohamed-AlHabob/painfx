import base64
import logging
from django.db.models import Q, OuterRef, Exists
from django.core.files.base import ContentFile
from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.chat.models import Connection, Message, MessageAttachment
from apps.chat.serializers import (
    FriendSerializer,
    MessageSerializer,
    RequestSerializer,
    SearchSerializer
)
from apps.authentication.models import User
from apps.authentication.serializers import UserSerializer

logger = logging.getLogger(__name__)


class FriendListView(generics.ListAPIView):
    """
    Returns a list of accepted connections (friends) for the authenticated user,
    annotated with the latest message information.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = FriendSerializer

    def get_queryset(self):
        user = self.request.user
        # Annotate connections with the latest message data for sorting.
        from django.db.models.functions import Coalesce
        latest_message = Message.objects.filter(
            connection=OuterRef('id')
        ).order_by('-created_at')[:1]
        return Connection.objects.filter(
            Q(sender=user) | Q(receiver=user),
            status=Connection.STATUS_ACCEPTED
        ).annotate(
            latest_text=latest_message.values('text'),
            latest_created=latest_message.values('created_at')
        ).order_by(Coalesce('latest_created', 'updated_at').desc())


class MessageListView(generics.ListAPIView):
    """
    Retrieves paginated messages for a given connection (chat conversation).
    The connection ID is provided as a URL parameter.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        connection_id = self.kwargs.get("connection_id")
        try:
            connection = Connection.objects.get(id=connection_id)
        except Connection.DoesNotExist:
            return Message.objects.none()
        return Message.objects.filter(connection=connection).order_by('-created_at')


class MessageSendView(views.APIView):
    """
    Allows an authenticated user to send a message within a connection.
    The endpoint supports an optional list of attachments encoded in base64.
    
    Expected JSON payload:
    {
        "connectionId": "123",
        "message": "Hello!",
        "attachments": [
            {
                "base64": "....",
                "filename": "image.png",
                "file_type": "image/png"
            },
            ...
        ]
    }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        connection_id = request.data.get("connectionId")
        message_text = request.data.get("message", "")
        attachments = request.data.get("attachments", [])
        
        try:
            connection = Connection.objects.get(id=connection_id)
        except Connection.DoesNotExist:
            return Response({"error": "Connection not found"}, status=status.HTTP_404_NOT_FOUND)
        
        message = Message.objects.create(connection=connection, user=user, text=message_text)
        
        for attachment in attachments:
            base64_data = attachment.get('base64')
            filename = attachment.get('filename')
            file_type = attachment.get('file_type', '')
            if base64_data and filename:
                try:
                    file_data = base64.b64decode(base64_data)
                    django_file = ContentFile(file_data, name=filename)
                    MessageAttachment.objects.create(message=message, file=django_file, file_type=file_type)
                except Exception as e:
                    logger.exception("Attachment processing failed: %s", e)
                    return Response(
                        {"error": f"Attachment processing failed: {str(e)}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
        
        serializer = MessageSerializer(message, context={"user": user})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RequestListView(generics.ListAPIView):
    """
    Lists all pending friend (connection) requests for the authenticated user.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = RequestSerializer

    def get_queryset(self):
        user = self.request.user
        return Connection.objects.filter(receiver=user, status=Connection.STATUS_PENDING)


class RequestActionView(views.APIView):
    """
    Allows the authenticated user to accept or reject a pending friend request.
    The action is specified in the URL (e.g., /api/requests/<action>/ where action is 'accept' or 'reject').
    
    Expected JSON payload:
    {
        "userId": "sender_user_id"
    }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, action, *args, **kwargs):
        user = request.user
        sender_id = request.data.get("userId")
        
        try:
            connection = Connection.objects.get(
                sender__id=sender_id,
                receiver=user,
                status=Connection.STATUS_PENDING
            )
        except Connection.DoesNotExist:
            return Response({"error": "Connection not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if action == "accept":
            connection.status = Connection.STATUS_ACCEPTED
        elif action == "reject":
            connection.status = Connection.STATUS_REJECTED
        else:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
        
        connection.save()
        serializer = RequestSerializer(connection)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SearchUserView(generics.ListAPIView):
    """
    Provides a search endpoint for finding users to connect with.
    Query parameters:
      - query: string to search for in username, first name, or last name.
    The response includes connection-related annotations like pending or connected status.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SearchSerializer

    def get_queryset(self):
        query = self.request.query_params.get("query", "")
        user = self.request.user
        return User.objects.filter(
            Q(username__istartswith=query) |
            Q(first_name__istartswith=query) |
            Q(last_name__istartswith=query)
        ).exclude(id=user.id).annotate(
            pending_them=Exists(
                Connection.objects.filter(
                    sender=user,
                    receiver=OuterRef('id'),
                    status=Connection.STATUS_PENDING
                )
            ),
            pending_me=Exists(
                Connection.objects.filter(
                    sender=OuterRef('id'),
                    receiver=user,
                    status=Connection.STATUS_PENDING
                )
            ),
            connected=Exists(
                Connection.objects.filter(
                    Q(sender=user, receiver=OuterRef('id')) |
                    Q(receiver=user, sender=OuterRef('id')),
                    status=Connection.STATUS_ACCEPTED
                )
            )
        )
