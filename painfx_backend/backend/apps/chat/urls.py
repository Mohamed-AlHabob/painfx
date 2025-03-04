from django.urls import path
from apps.chat import views

urlpatterns = [
    # Endpoint to retrieve the friend list
    path('friends/', views.FriendListView.as_view(), name='friend-list'),
    
    # Endpoint to list messages for a specific connection (chat conversation)
    path('messages/<int:connection_id>/', views.MessageListView.as_view(), name='message-list'),
    
    # Endpoint to send a message with optional attachments
    path('messages/send/', views.MessageSendView.as_view(), name='message-send'),
    
    # Endpoint to list pending friend (connection) requests
    path('requests/', views.RequestListView.as_view(), name='request-list'),
    
    # Endpoint to accept or reject a pending connection request.
    # The action should be either 'accept' or 'reject'
    path('requests/<str:action>/', views.RequestActionView.as_view(), name='request-action'),
    
    # Endpoint to search for users to connect with
    path('search/', views.SearchUserView.as_view(), name='user-search'),
]
