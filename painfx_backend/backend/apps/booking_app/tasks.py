# backend/booking_app/tasks.py

from celery import shared_task
from apps.booking_app.models import Notification, Payment, DiscountCard, DiscountRule,Reservation
from apps.authentication.models import Patient
from django.core.mail import send_mail
from twilio.rest import Client
from django.conf import settings
from django.utils.timezone import now
from django.utils import timezone

# Twilio Configuration
TWILIO_ACCOUNT_SID = settings.TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN = settings.TWILIO_AUTH_TOKEN
TWILIO_FROM_NUMBER = settings.TWILIO_FROM_NUMBER

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


@shared_task
def send_reservation_reminder():
    tomorrow = timezone.now().date() + timezone.timedelta(days=1)
    reservations = Reservation.objects.filter(reservation_date=tomorrow, status='approved')
    
    for reservation in reservations:
        send_mail(
            'Reservation Reminder',
            f'This is a reminder for your reservation tomorrow at {reservation.reservation_time}.',
             settings.DEFAULT_FROM_EMAIL,
            [reservation.patient.user.email],
            fail_silently=False,
        )

@shared_task(bind=True, max_retries=3)
def send_sms_notification(self, user_id, message):
    from .models import User
    import logging
    logger = logging.getLogger(__name__)
    try:
        user = User.objects.get(id=user_id)
        phone_number = user.profile.phone_number
        if not phone_number:
            logger.warning(f"User {user_id} does not have a valid phone number.")
            return

        twilio_client.messages.create(
            body=message,
            from_=TWILIO_FROM_NUMBER,
            to=phone_number
        )
        logger.info(f"SMS sent to {phone_number} for User {user_id}.")
    except User.DoesNotExist:
        logger.error(f"User with ID {user_id} does not exist.")
    except Exception as e:
        logger.error(f"Error sending SMS to User {user_id}: {str(e)}")
        self.retry(exc=e, countdown=60)


@shared_task(bind=True, max_retries=3)
def process_payment_webhook(self, event_data):
    import logging
    logger = logging.getLogger(__name__)
    try:
        payment_intent = event_data['data']['object']
        payment_id = payment_intent.get('id')
        status = payment_intent.get('status')

        if not payment_id or not status:
            raise ValueError("Invalid event data: missing payment ID or status.")

        payment = Payment.objects.get(payment_intent_id=payment_id)
        payment.payment_status = status
        payment.last_updated = now()
        payment.save()
        logger.info(f"Payment {payment_id} processed successfully with status {status}.")
    except Payment.DoesNotExist:
        logger.error(f"Payment with intent ID {payment_id} not found.")
    except Exception as e:
        logger.error(f"Error processing payment webhook: {str(e)}")
        self.retry(exc=e, countdown=60)


@shared_task
def send_email_notification(user_email, subject, message):
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        fail_silently=False,
    )


@shared_task
def award_discount_card(patient_id, discount_rule_id):
    """
    Awards a discount card to a patient based on a discount rule.
    Also creates a notification for the user indicating that they have
    received a discount card.
    """
    try:
        # Retrieve the patient and discount rule objects
        patient = Patient.objects.get(id=patient_id)
        discount_rule = DiscountRule.objects.get(id=discount_rule_id)
        
        # Create the discount card.
        # If discount_rule.clinic is None, the card is considered global (applicable in all clinics)
        discount_card = DiscountCard.objects.create(
            patient=patient,
            clinic=discount_rule.clinic,  # Can be None if the rule is global
            discount_value=discount_rule.discount_value,
            discount_type=discount_rule.discount_type,
            # For example, make the card valid for 30 days from now; adjust as needed
            valid_until=timezone.now() + timedelta(days=30)
        )
        
        # Create a notification for the user
        discount_message = (
            f"Congratulations! You've been awarded a discount card offering "
            f"{discount_rule.discount_value}{'%' if discount_rule.discount_type == 'percentage' else ''} discount."
        )
        Notification.objects.create(
            user=patient.user,
            message=discount_message,
            notification_type='discount'  # Ensure this type exists in your Notification choices
        )
        
        logger.info(
            f"Discount card {discount_card.code} awarded to patient {patient_id} using rule {discount_rule_id}."
        )
        return discount_card.id
        
    except Exception as e:
        logger.error(f"Error awarding discount card for patient {patient_id}: {str(e)}")
        # Optionally, re-raise the exception if you want Celery to retry the task
        raise e
