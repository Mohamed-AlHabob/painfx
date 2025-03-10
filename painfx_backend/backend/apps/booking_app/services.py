from datetime import datetime, timedelta
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models import Q
from apps.booking_app.models import ReservationStatus, WorkingHours,TimeSlot,Reservation,DiscountCard, DiscountRule,Notification
from apps.booking_app.tasks import send_email_notification, send_sms_notification

class DiscountService:
    @staticmethod
    def create_discount_card(patient, clinic, discount_value, discount_type, valid_until=None):
        """
        Create a new discount card for a patient and send a notification.
        """
        discount_card = DiscountCard(
            patient=patient,
            clinic=clinic,
            discount_value=discount_value,
            discount_type=discount_type,
            valid_until=valid_until
        )
        discount_card.save()

        # Send notification to the patient
        Notification.objects.create(
            user=patient.user,
            message=f"You have received a discount card for {clinic.name}. Use code: {discount_card.code}",
            notification_type='discount'
        )

        return discount_card

    @staticmethod
    def redeem_discount_card(discount_card):
        """
        Redeem a discount card.
        """
        if discount_card.is_used:
            raise ValidationError("This discount card has already been used.")
        if discount_card.valid_until and discount_card.valid_until < timezone.now():
            raise ValidationError("This discount card has expired.")
        
        discount_card.is_used = True
        discount_card.redeemed_at = timezone.now()
        discount_card.save()

class DiscountRuleService:
    @staticmethod
    def evaluate_conditions(patient, clinic, condition_json):
        """
        Evaluate conditions for issuing a discount card.
        """
        if condition_json.get('min_reservations'):
            reservation_count = Reservation.objects.filter(
                patient=patient,
                clinic=clinic,
                status=ReservationStatus.APPROVED
            ).count()
            return reservation_count >= condition_json['min_reservations']
        
        # Add more conditions here (e.g., based on reviews, total spending, etc.)
        return False

    @staticmethod
    def apply_discount_rules(patient, clinic):
        """
        Apply all active discount rules for a patient and clinic.
        """
        discount_rules = DiscountRule.objects.filter(clinic=clinic, active=True)
        for rule in discount_rules:
            if rule.condition_json and DiscountRuleService.evaluate_conditions(patient, clinic, rule.condition_json):
                DiscountService.create_discount_card(
                    patient=patient,
                    clinic=clinic,
                    discount_value=rule.discount_value,
                    discount_type=rule.discount_type,
                    valid_until=timezone.now() + timedelta(days=30)  # Example: Valid for 30 days
                )

class TimeSlotService:
    @staticmethod
    def generate_time_slots(clinic=None, doctor=None):
        if not clinic and not doctor:
            raise ValidationError("Either clinic or doctor must be provided.")

        working_hours = WorkingHours.objects.filter(clinic=clinic, doctor=doctor)
        time_slots = []

        for working_hour in working_hours:
            start_time = datetime.combine(datetime.today(), working_hour.start_time)
            end_time = datetime.combine(datetime.today(), working_hour.end_time)

            while start_time < end_time:
                # Check if the time slot already exists
                exists = TimeSlot.objects.filter(
                    Q(clinic=clinic) | Q(doctor=doctor),
                    start_time=start_time,
                    end_time=start_time + timedelta(minutes=30)
                ).exists()

                if not exists:
                    time_slots.append(TimeSlot(
                        clinic=clinic,
                        doctor=doctor,
                        start_time=start_time,
                        end_time=start_time + timedelta(minutes=30)  # 30-minute slots
                    ))
                start_time += timedelta(minutes=30)

        if time_slots:
            TimeSlot.objects.bulk_create(time_slots)

class ReservationService:
    @staticmethod
    def create_reservation(user, time_slot_id):
        if not hasattr(user, 'patient'):
            raise ValidationError("Only patients can create reservations.")

        time_slot = TimeSlot.objects.filter(id=time_slot_id, is_available=True).first()
        if not time_slot:
            raise ValidationError("The selected time slot is not available.")

        reservation = Reservation.objects.create(patient=user.patient, time_slot=time_slot)
        time_slot.is_available = False
        time_slot.save()

        # Send notification
        send_email_notification.delay(user.email, 'Reservation Created', 'Your reservation has been created.')
        send_sms_notification.delay(user.id, 'Your reservation has been created.')

        return reservation

    @staticmethod
    def approve_reservation(reservation_id):
        reservation = Reservation.objects.get(id=reservation_id)
        if reservation.status != 'pending':
            raise ValidationError("Reservation is not in a pending state.")

        reservation.status = 'approved'
        reservation.save()

        # Send notification
        send_email_notification.delay(reservation.patient.user.email, 'Reservation Approved', 'Your reservation has been approved.')
        send_sms_notification.delay(reservation.patient.user.id, 'Your reservation has been approved.')

        return reservation