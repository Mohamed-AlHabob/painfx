from django.contrib import admin
from apps.chat.models import Connection, Message,MessageAttachment

admin.site.register(Connection)
admin.site.register(Message)
admin.site.register(MessageAttachment)