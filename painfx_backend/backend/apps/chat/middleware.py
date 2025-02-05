from urllib.parse import parse_qs
from channels.auth import AuthMiddlewareStack
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from apps.authentication.models import User
from django.db import close_old_connections
import jwt
from django.conf import settings

class JWTAuthMiddleware:
    """
    Custom middleware to authenticate WebSocket connections using JWT.
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        # Extract token from query params (e.g., ws://localhost:8000/ws/chat/?token=xxx)
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token", [None])[0]  # Extract token if exists

        user = AnonymousUser()  # Default to anonymous user

        if token:
            try:
                decoded_data = AccessToken(token)  # Validate JWT
                user = User.objects.get(id=decoded_data["user_id"])  # Get user from DB
            except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
                user = AnonymousUser()  # Fallback if token is invalid

        close_old_connections()  # Close old DB connections
        scope["user"] = user  # Attach user to WebSocket scope
        return self.inner(scope)

# Wrap with AuthMiddlewareStack
def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))
