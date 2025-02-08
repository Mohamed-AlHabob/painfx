from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.booking_app.models import Post, Reservation, Notification

@receiver(post_save, sender=Post)
def send_like_notification(sender, instance, created, **kwargs):
    if created:
        return
    if instance.likes.count() > 0: 
        for like in instance.likes.all():
            Notification.objects.create(
                user=like.user,
                message=f"Your post has been liked by {like.user.first_name}",
                notification_type='like'
            )

@receiver(post_save, sender=Reservation)
def send_reservation_notification(sender, instance, created, **kwargs):
    if created:
        return
    
    status = 'Your booking status has been updated.'  # Default value

    if instance.status == 'approved':
        status = 'Your booking has been accepted.'
    elif instance.status == 'cancelled':
        status = 'Your booking has been cancelled.'
    elif instance.status == 'rejected':
        status = 'Your booking has been declined.'

    Notification.objects.create(
        user=instance.patient.user,  # Access the user through the patient
        message=status,
        notification_type='booking'
    )
