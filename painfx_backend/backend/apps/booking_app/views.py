from rest_framework import viewsets, permissions, serializers
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
import stripe
from rest_framework.permissions import BasePermission
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
# Local imports
from apps.authentication.models import Doctor, Patient
from apps.authentication.serializers import (
    DoctorSerializer, PatientSerializer
)
from apps.booking_app.models import (
    Clinic,
    Reservation, Review, Post,
    Comment, Like, Category, Subscription, PaymentMethod,
    Payment, Notification, EventSchedule, AdvertisingCampaign,
    UsersAudit
)
from apps.booking_app.serializers import (
    ClinicSerializer, ReservationSerializer, ReviewSerializer, PostSerializer,
     CommentSerializer, LikeSerializer, CategorySerializer,
    SubscriptionSerializer, PaymentMethodSerializer, PaymentSerializer,
    NotificationSerializer, EventScheduleSerializer, AdvertisingCampaignSerializer,
    UsersAuditSerializer
)

from apps.booking_app.tasks import process_payment_webhook
from apps.booking_app.tasks import send_sms_notification, send_email_notification,process_payment_webhook
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter, OrderingFilter

stripe.api_key = settings.STRIPE_SECRET_KEY

class GlPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'doctor'

class IsClinicOwner(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'clinic'

class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'patient'

# Patient ViewSet
class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.none()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['medical_history']
    ordering_fields = ['created_at']
    pagination_class = GlPagination

    def get_queryset(self):
        return Patient.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if Patient.objects.filter(user=self.request.user).exists():
            raise serializers.ValidationError("You already have a patient profile.")
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        patient = self.get_object()
        # Deactivate the user associated with this patient
        patient.user.is_active = False
        patient.user.save()
        return Response({'status': 'Patient archived'})


# Doctor ViewSet
class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = GlPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



# Clinic ViewSet
class ClinicViewSet(viewsets.ModelViewSet):
    queryset = Clinic.objects.all()
    serializer_class = ClinicSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = GlPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['owner']
    search_fields = ['name', 'address']
    ordering_fields = ['name', 'created_at']

    def perform_create(self, serializer):
        # Ensure a user can own only one clinic
        if Clinic.objects.filter(owner=self.request.user).exists():
            raise serializers.ValidationError({"error": "You already own a clinic."})
        
        serializer.save(owner=self.request.user)


# Reservation ViewSet
class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = GlPagination

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'clinicowner'):
            return Reservation.objects.filter(clinic__owner=user)
        elif hasattr(user, 'doctor'):
            return Reservation.objects.filter(doctor__user=user)
        elif hasattr(user, 'patient'):
            return Reservation.objects.filter(patient__user=user)
        return Reservation.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if not hasattr(user, 'patient'):
            raise serializers.ValidationError("Only patients can create reservations.")
        serializer.save(patient=user.patient)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsClinicOwner])
    def approve(self, request, pk=None):
        reservation = self.get_object()
        if reservation.status == ReservationStatus.APPROVED:
            return Response({'error': 'Reservation already approved'}, status=400)

        reservation.status = ReservationStatus.APPROVED
        reservation.save()

        # Assign a doctor
        assigned_doctor = reservation.clinic.doctors.filter(reservation_open=True).first()
        if not assigned_doctor:
            return Response({'error': 'No available doctors'}, status=400)

        reservation.doctor = assigned_doctor
        reservation.save()

        # Send notifications asynchronously
        send_sms_notification.delay(reservation.patient.user.id, 'Your reservation has been approved.')
        send_email_notification.delay(
            reservation.patient.user.email,
            'Reservation Approved',
            'Your reservation has been approved.'
        )
        return Response({'status': 'Reservation approved', 'doctor': DoctorSerializer(assigned_doctor).data})


    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsClinicOwner])
    def reject(self, request, pk=None):
        reservation = self.get_object()
        reservation.status = ReservationStatus.REJECTED
        reservation.reason_for_cancellation = request.data.get('reason', '')
        reservation.save()

        # Send notifications asynchronously
        send_sms_notification.delay(reservation.patient.user.id, 'Your reservation has been rejected.')
        send_email_notification.delay(
            reservation.patient.user.email,
            'Reservation Rejected',
            f'Your reservation has been rejected. Reason: {reservation.reason_for_cancellation}'
        )
        return Response({'status': 'Reservation rejected'})

# Review ViewSet
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

# Post ViewSet
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().annotate(
        likes_count=Count('like', distinct=True),
        comments_count=Count('comment', distinct=True)
    )
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = GlPagination

    @action(detail=False, methods=['get'])
    def stats(self, request):
        stats = Post.objects.annotate(
            likes_count=Count('like', distinct=True),
            comments_count=Count('comment', distinct=True)
        ).values('id', 'title', 'likes_count', 'comments_count')
        return Response(stats)

    def perform_create(self, serializer):
        user = self.request.user
        if not hasattr(user, 'doctor'):
            raise serializers.ValidationError("Only doctors can create posts.")
        serializer.save(doctor=user.doctor)


# Comment ViewSet
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.none()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = GlPagination

    def get_queryset(self):
        post_id = self.request.query_params.get('post_id')
        return Comment.objects.filter(post_id=post_id) if post_id else Comment.objects.none()

# Like ViewSet
class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.none()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        post_id = self.request.query_params.get('post_id')
        return Like.objects.filter(post_id=post_id) if post_id else Like.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        like = self.get_object()
        if like.user != request.user:
            return Response(
                {"detail": "You can only delete your own likes."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
    
    
# Category ViewSet
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

# Subscription ViewSet
class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

# PaymentMethod ViewSet
class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]

# Payment ViewSet
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

# Notification ViewSet
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

# EventSchedule ViewSet
class EventScheduleViewSet(viewsets.ModelViewSet):
    queryset = EventSchedule.objects.all()
    serializer_class = EventScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

# AdvertisingCampaign ViewSet
class AdvertisingCampaignViewSet(viewsets.ModelViewSet):
    queryset = AdvertisingCampaign.objects.all()
    serializer_class = AdvertisingCampaignSerializer
    permission_classes = [permissions.IsAuthenticated]

# UsersAudit ViewSet
class UsersAuditViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UsersAudit.objects.all()
    serializer_class = UsersAuditSerializer
    permission_classes = [permissions.IsAdminUser]


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    if not payload or not sig_header:
        return JsonResponse({'error': 'Missing payload or signature'}, status=400)

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)

        if event['type'] == 'payment_intent.succeeded':
            process_payment_webhook.delay(event['data']['object'])
        elif event['type'] == 'payment_intent.payment_failed':
            process_payment_webhook.delay(event['data']['object'])

        return JsonResponse({'status': 'success'})
    except stripe.error.SignatureVerificationError:
        return JsonResponse({'error': 'Invalid signature'}, status=400)
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Stripe webhook error: {str(e)}")
        return JsonResponse({'error': str(e)}, status=400)


class CreateStripePaymentIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            amount = int(request.data.get('amount'))
            currency = request.data.get('currency', 'usd')

            payment_intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                metadata={"user_id": request.user.id},
            )

            return Response({"client_secret": payment_intent['client_secret']})
        except Exception as e:
            return Response({"error": str(e)}, status=400)