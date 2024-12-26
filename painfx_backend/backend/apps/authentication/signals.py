from django.utils import timezone
from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.authentication.models import User, UserProfile, Patient,Doctor
from apps.booking_app.models import Clinic, ClinicDoctor

@receiver(post_save, sender=User)
def create_user_related_models(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
        if instance.role == 'patient':
            Patient.objects.create(user=instance)

@receiver(post_save, sender=Doctor)
def create_clinic_for_new_doctor(sender, instance, created, **kwargs):
    if created:
        try:
            with transaction.atomic():
                clinic = Clinic.objects.create(
                    name=f"{instance.user.get_full_name()}'s Clinic",
                    address=instance.user.profile.address if hasattr(instance.user, 'profile') else "",
                    latitude=instance.user.profile.latitude if hasattr(instance.user, 'profile') else None,
                    longitude=instance.user.profile.longitude if hasattr(instance.user, 'profile') else None,
                    specialization=instance.specialization,
                    license_number=instance.license_number,
                    license_expiry_date=instance.license_expiry_date,
                    license_image=instance.license_image,
                    owner=instance.user,
                    description=f"Clinic owned by Dr. {instance.user.get_full_name()}",
                    privacy=instance.privacy,
                    reservation_open=instance.reservation_open,
                    active=instance.active,
                )

                ClinicDoctor.objects.create(
                    clinic=clinic,
                    doctor=instance,
                    joined_at=timezone.now()
                )
        except Exception as e:
            pass