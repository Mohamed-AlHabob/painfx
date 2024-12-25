from celery import shared_task
from apps.booking_app.models import Notification, Payment
from django.core.mail import send_mail
from twilio.rest import Client
from django.conf import settings
from django.utils.timezone import now
import logging

# Twilio Configuration
twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def send_sms_notification(self, user_id, message):
    from apps.authentication.models import User
    try:
        user = User.objects.get(id=user_id)
        phone_number = user.profile.phone_number
        if not phone_number:
            logger.warning(f"User {user_id} does not have a valid phone number.")
            return

        twilio_client.messages.create(
            body=message,
            from_=settings.TWILIO_FROM_NUMBER,
            to=phone_number
        )
        logger.info(f"SMS sent to {phone_number} for User {user_id}.")
    except User.DoesNotExist:
        logger.error(f"User with ID {user_id} does not exist.")
    except Exception as e:
        logger.error(f"Error sending SMS to User {user_id}: {e}")
        self.retry(exc=e, countdown=60)


@shared_task(bind=True, max_retries=3)
def process_payment_webhook(self, event_data):
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
        logger.error(f"Error processing payment webhook: {e}")
        self.retry(exc=e, countdown=60)


@shared_task
def send_email_notification(user_email, subject, message):
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user_email],
            fail_silently=False,
        )
        logger.info(f"Email sent to {user_email}.")
    except Exception as e:
        logger.error(f"Error sending email to {user_email}: {e}")
