from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.booking_app.models import Post, Reservation ,Notification
from apps.authentication.models import User

@receiver(post_save, sender=Post)
def send_like_notification(sender, instance, created, **kwargs):
    if created:
        return
    
    if instance.likes.count() > 0:  # Assuming you have a `likes` ManyToMany relationship
        for user in instance.likes.all():
            # Create a like notification
            Notification.objects.create(
                user=user,
                content=f"Your post has been liked by {instance.user.username}",
                notification_type='like'
            )

@receiver(post_save, sender=Reservation)
def send_Reservation_notification(sender, instance, created, **kwargs):
    if created:
        return
    
    if instance.status == 'accepted':
        status_message = 'Your booking has been accepted.'
    elif instance.status == 'cancelled':
        status_message = 'Your booking has been cancelled.'
    elif instance.status == 'declined':
        status_message = 'Your booking has been declined.'

    Notification.objects.create(
        user=instance.patient,  # Assuming Booking has a `patient` field pointing to User
        content=status_message,
        notification_type='booking'
    )
