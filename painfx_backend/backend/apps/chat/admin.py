from django.contrib import admin
from apps.chat.models import Connection, Message

admin.site.register(Connection)
admin.site.register(Message)