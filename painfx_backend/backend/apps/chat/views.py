from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.core.general import GlPagination

from apps.chat.models import Connection, Message
from apps.chat.serializers import (
    RequestSerializer,
    FriendSerializer,
    MessageSerializer,
    SearchSerializer,
)
from apps.authentication.models import User


# Friend ViewSet: for accepted connections (i.e. friends)
class FriendViewSet(viewsets.ModelViewSet):
    queryset = Connection.objects.none()
    serializer_class = FriendSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    # You can search by the friend's first/last name (whether you are sender or receiver)
    search_fields = ['sender__first_name', 'sender__last_name', 'receiver__first_name', 'receiver__last_name']
    ordering_fields = ['updated_at', 'created_at']
    pagination_class = GlPagination

    def get_queryset(self):
        user = self.request.user
        # Return accepted connections where the user is either sender or receiver
        return Connection.objects.filter(accepted=True).filter(Q(sender=user) | Q(receiver=user))


# Friend Request ViewSet: for pending connection requests
class FriendRequestViewSet(viewsets.ModelViewSet):
    queryset = Connection.objects.none()
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['sender__first_name', 'sender__last_name', 'receiver__first_name', 'receiver__last_name']
    ordering_fields = ['created_at']
    pagination_class = GlPagination

    def get_queryset(self):
        user = self.request.user
        # Return pending (not yet accepted) connections where the user is involved
        return Connection.objects.filter(accepted=False).filter(Q(sender=user) | Q(receiver=user))

    def perform_create(self, serializer):
        # Ensure the sender is always the logged in user when creating a friend request
        serializer.save(sender=self.request.user)


# Message ViewSet: for messages within any connection the user is part of
class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.none()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['text']
    ordering_fields = ['created_at']
    pagination_class = GlPagination

    def get_queryset(self):
        user = self.request.user
        # Get messages from connections where the user is a participant
        return Message.objects.filter(
            connection__in=Connection.objects.filter(Q(sender=user) | Q(receiver=user))
        )

    def perform_create(self, serializer):
        # Set the message's user to the logged in user
        serializer.save(user=self.request.user)


# User Search ViewSet: for searching users (using the SearchSerializer)
class UserSearchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.none()
    serializer_class = SearchSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['first_name', 'last_name', 'username', 'email']
    ordering_fields = ['first_name', 'last_name', 'username']

    def get_queryset(self):
        user = self.request.user
        # Exclude the current user from the search results
        return User.objects.exclude(id=user.id)
