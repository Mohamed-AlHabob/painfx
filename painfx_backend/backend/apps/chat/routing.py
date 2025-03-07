from django.urls import re_path

def get_consumers():
    from apps.chat import consumers
    return consumers

websocket_urlpatterns = [
    re_path(r"^chat/$", get_consumers().ChatConsumer.as_asgi()),
]
