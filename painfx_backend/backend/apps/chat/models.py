from apps.core.general import BaseModel
from django.db import models
from apps.authentication.models import User

class Connection(BaseModel):
    sender = models.ForeignKey(
        User,
        related_name='sent_connections',
        on_delete=models.CASCADE
    )
    receiver = models.ForeignKey(
        User,
        related_name='received_connections',
        on_delete=models.CASCADE
    )
    accepted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender.get_full_name()} -> {self.receiver.get_full_name()}"

class Message(BaseModel):
    connection = models.ForeignKey(
        Connection,
        related_name='messages',
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        User,
        related_name='my_messages',
        on_delete=models.CASCADE
    )
    text = models.TextField()

    def __str__(self):
        return f"{self.user.get_full_name()}: {self.text}"