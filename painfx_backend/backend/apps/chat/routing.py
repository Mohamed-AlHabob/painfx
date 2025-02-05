from django.urls import path

def get_consumers():
    from apps.chat import consumers
    return consumers

websocket_urlpatterns = [
    path("ws/chat/", get_consumers().ChatConsumer.as_asgi()),
]
