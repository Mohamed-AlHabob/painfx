# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.booking_app.models import Post, Reservation
from apps.booking_app.tasks import send_push_notification

@receiver(post_save, sender=Post)
def post_liked(sender, instance, created, **kwargs):
    if created:  # Only trigger if the post is created
        # Create notification and send it asynchronously
        message = f"Your post titled '{instance.title}' was liked!"
        send_push_notification.delay(instance.user.id, message, instance)

@receiver(post_save, sender=Reservation)
def reservation_status_changed(sender, instance, **kwargs):
    if instance.status in ['accepted', 'rejected', 'cancelled']:
        message = f"Your reservation has been {instance.status}."
        # Send notification and save it asynchronously
        send_push_notification.delay(instance.user.id, message, instance)
