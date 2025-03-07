from datetime import datetime, timedelta
from django.core.exceptions import ValidationError
from django.db.models import Q

from apps.booking_app.models import WorkingHours,TimeSlot,Reservation
from apps.booking_app.tasks import send_email_notification, send_sms_notification


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