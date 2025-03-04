from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.core.general import BaseModel
from apps.authentication.models import User

class Connection(BaseModel):
    STATUS_PENDING = 'pending'
    STATUS_ACCEPTED = 'accepted'
    STATUS_REJECTED = 'rejected'

    STATUS_CHOICES = (
        (STATUS_PENDING, _('Pending')),
        (STATUS_ACCEPTED, _('Accepted')),
        (STATUS_REJECTED, _('Rejected')),
    )

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
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING
    )

    def __str__(self):
        return f"{self.sender.get_full_name()} -> {self.receiver.get_full_name()} ({self.status})"


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
    text = models.TextField(blank=True)  # Optional text if only attachments are sent
    read_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.get_full_name()}: {self.text[:20]}"


class MessageAttachment(BaseModel):
    message = models.ForeignKey(
        Message,
        related_name='attachments',
        on_delete=models.CASCADE
    )
    file = models.FileField(upload_to='message_attachments/')
    file_type = models.CharField(max_length=50, blank=True, null=True)  # MIME type or a custom identifier

    def __str__(self):
        return f"Attachment for message {self.message.id}"
