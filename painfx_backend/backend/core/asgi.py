import os
import django

# Set the settings module before doing anything else
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

# Explicitly initialize Django before importing other modules
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from apps.chat.routing import websocket_urlpatterns 
from apps.chat.middleware import JWTAuthMiddlewareStack

# Ensure ASGI app is properly initialized
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        JWTAuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
})
