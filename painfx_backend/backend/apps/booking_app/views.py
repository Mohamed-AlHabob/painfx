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
    permission_classes = [IsAuthenticated, IsOwner]
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
    permission_classes = [IsAuthenticated]
    pagination_class = GlPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



# Clinic ViewSet
class ClinicViewSet(viewsets.ModelViewSet):
    queryset = Clinic.objects.all()
    serializer_class = ClinicSerializer
    permission_classes = [IsAuthenticated]
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

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = GlPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'reservation_date', 'doctor']
    search_fields = ['patient__user__username', 'clinic__name']
    ordering_fields = ['reservation_date', 'reservation_time']

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

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsClinicOwner | IsDoctor])
    def approve(self, request, pk=None):
        reservation = self.get_object()
        if reservation.status != ReservationStatus.PENDING:
            return Response({'error': 'Reservation is not in a pending state'}, status=status.HTTP_400_BAD_REQUEST)    

        reservation.status = ReservationStatus.APPROVED
        reservation.save()    

        # Assign a doctor if not already assigned
        if not reservation.doctor and reservation.clinic:
            assigned_doctor = reservation.clinic.doctors.filter(reservation_open=True).first()
            if assigned_doctor:
                reservation.doctor = assigned_doctor
                reservation.save()
            else:
                return Response({'error': 'No available doctors for this clinic'}, status=status.HTTP_400_BAD_REQUEST)    

        # Send notifications
        send_sms_notification.delay(reservation.patient.user.id, 'Your reservation has been approved.')
        send_email_notification.delay(
            reservation.patient.user.email,
            'Reservation Approved',
            'Your reservation has been approved.'
        )
        return Response({'status': 'Reservation approved', 'doctor': DoctorSerializer(reservation.doctor).data})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsClinicOwner | IsDoctor])
    def reject(self, request, pk=None):
        reservation = self.get_object()
        if reservation.status == ReservationStatus.REJECTED:
            return Response({'error': 'Reservation already rejected'}, status=status.HTTP_400_BAD_REQUEST)

        reservation.status = ReservationStatus.REJECTED
        reservation.reason_for_cancellation = request.data.get('reason', '')
        reservation.save()

        # Send notifications
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
    permission_classes = [IsAuthenticated]


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().prefetch_related('post_comments').annotate(
        likes_count=Count('post_likes'),
        comments_count=Count('post_comments')
    )
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = GlPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['doctor']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'view_count']

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'doctor'):
            raise serializers.ValidationError("Only doctors can create posts.")
        serializer.save(doctor=self.request.user.doctor)

    @action(detail=True, methods=['post'])
    def increment_view_count(self, request, pk=None):
        post = self.get_object()
        post.increment_view_count()
        return Response({'status': 'View count incremented', 'view_count': post.view_count})

    @action(detail=True, methods=['post'])
    def add_tags(self, request, pk=None):
        post = self.get_object()
        tag_names = request.data.get('tags', [])
        if not isinstance(tag_names, list):
            return Response({'error': 'Tags must be provided as a list.'}, status=status.HTTP_400_BAD_REQUEST)
        post.add_tags(tag_names)
        return Response({'status': 'Tags added', 'tags': [tag.name for tag in post.tags.all()]})

    @action(detail=True, methods=['get'])
    def likes(self, request, pk=None):
        post = self.get_object()
        likes = Like.objects.filter(post=post)
        serializer = LikeSerializer(likes, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        post = self.get_object()
        comments = Comment.objects.filter(post=post)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = GlPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['post', 'user']
    search_fields = ['text']
    ordering_fields = ['created_at']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        parent_comment = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=self.request.user, post=parent_comment.post, parent=parent_comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# Like ViewSet
class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = GlPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['post', 'user']
    ordering_fields = ['created_at']

    def perform_create(self, serializer):
        post = serializer.validated_data['post']
        if Like.objects.filter(user=self.request.user, post=post).exists():
            raise serializers.ValidationError("You have already liked this post.")
        serializer.save(user=self.request.user)


    @action(detail=True, methods=['post'])
    def unlike(self, request, pk=None):
        like = self.get_object()
        if like.user != request.user:
            return Response({'error': 'You can only unlike your own likes.'}, status=status.HTTP_403_FORBIDDEN)
        like.delete()
        return Response({'status': 'Like removed'})
    
# Category ViewSet
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

# Subscription ViewSet
class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

# PaymentMethod ViewSet
class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]

# Payment ViewSet
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

# Notification ViewSet
class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = GlPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['read', 'created_at']
    search_fields = ['message']
    ordering_fields = ['created_at']

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

# EventSchedule ViewSet
class EventScheduleViewSet(viewsets.ModelViewSet):
    queryset = EventSchedule.objects.all()
    serializer_class = EventScheduleSerializer
    permission_classes = [IsAuthenticated]

# AdvertisingCampaign ViewSet
class AdvertisingCampaignViewSet(viewsets.ModelViewSet):
    queryset = AdvertisingCampaign.objects.all()
    serializer_class = AdvertisingCampaignSerializer
    permission_classes = [IsAuthenticated]

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
        else:
            logger.warning(f"Unhandled Stripe event type: {event['type']}")

        return JsonResponse({'status': 'success'})
    except stripe.error.SignatureVerificationError:
        return JsonResponse({'error': 'Invalid signature'}, status=400)
    except Exception as e:
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
