from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.booking_app.models import Post, Reservation, Notification, ReservationStatus,WorkingHours
from apps.booking_app.services import DiscountRuleService, TimeSlotService

@receiver(post_save, sender=WorkingHours)
def generate_time_slots_on_working_hours_save(sender, instance, **kwargs):
    TimeSlotService.generate_time_slots(clinic=instance.clinic, doctor=instance.doctor)

@receiver(post_save, sender=Post)
def send_like_notification(sender, instance, created, **kwargs):
    if created:
        return
    if instance.post_likes.count() > 0:
        for like in instance.post_likes.all():
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
        user=instance.patient.user,
        message=status,
        notification_type='booking'
    )


@receiver(post_save, sender=Reservation)
def apply_discount_rules_on_reservation(sender, instance, **kwargs):
    """
    Automatically apply discount rules when a reservation is approved.
    """
    if instance.status == ReservationStatus.APPROVED:
        DiscountRuleService.apply_discount_rules(instance.patient, instance.clinic)