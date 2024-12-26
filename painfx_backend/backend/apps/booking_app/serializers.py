from rest_framework import serializers
from apps.booking_app.models import (
    Clinic, Reservation, ReservationStatus, Review, Post,
    Comment, Like, Category, Subscription, PaymentMethod,
    Payment, Notification, EventSchedule, AdvertisingCampaign,
    UsersAudit, Tag
)
from apps.authentication.serializers import DoctorSerializer, UserSerializer, PatientSerializer, SpecializationSerializer

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']

class ClinicSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    doctors = DoctorSerializer(many=True, read_only=True)
    specialization = SpecializationSerializer(read_only=True)

    class Meta:
        model = Clinic
        fields = ['id', 'name', 'address', 'doctors', 'icon', 'owner', 'specialization', 'description',
                  'reservation_open', 'privacy', 'active', 'license_number', 'license_expiry_date',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ReservationSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)

    class Meta:
        model = Reservation
        fields = ['id', 'clinic', 'status', 'reason_for_cancellation', 'reservation_date','reservation_time', 'patient', 'doctor']
        read_only_fields = ['id', 'patient']

    def create(self, validated_data):
        user = self.context['request'].user
        if not hasattr(user, 'patient_profile'):
            raise serializers.ValidationError("Only patients can create reservations.")
        validated_data['patient'] = user.patient_profile
        return super().create(validated_data)

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'clinic', 'patient', 'rating', 'review_text', 'created_at']
        read_only_fields = ['id', 'patient', 'created_at']

    def validate(self, attrs):
        patient = self.context['request'].user.patient
        clinic = attrs.get('clinic')
        if not Reservation.objects.filter(
            patient=patient,
            clinic=clinic,
            status=ReservationStatus.APPROVED
        ).exists():
            raise serializers.ValidationError('Patient must have an approved reservation at the clinic to leave a review')
        attrs['patient'] = patient
        return attrs

class PostSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'video_file', 'video_url', 'thumbnail_url', 'content',
            'doctor', 'likes_count', 'comments_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'doctor', 'likes_count', 'comments_count', 'created_at', 'updated_at']

    def create(self, validated_data):
        user = self.context['request'].user
        if not hasattr(user, 'doctor_profile'):
            raise serializers.ValidationError("Only doctors can create posts.")
        validated_data['doctor'] = user.doctor_profile
        return super().create(validated_data)

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'comment_text', 'parent_comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'post', 'user', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']

class SubscriptionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Subscription
        fields = ['id', 'user', 'category', 'status', 'payment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['id', 'method_name']
        read_only_fields = ['id']

class PaymentSerializer(serializers.ModelSerializer):
    subscription = SubscriptionSerializer(read_only=True)
    reservation = ReservationSerializer(read_only=True)
    method = PaymentMethodSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'user', 'amount', 'method', 'payment_status', 'subscription', 'reservation', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def validate(self, attrs):
        subscription = attrs.get('subscription')
        reservation = attrs.get('reservation')
        if bool(subscription) == bool(reservation):
            raise serializers.ValidationError('Payment must be associated with either a subscription or a reservation, but not both.')
        return attrs

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class NotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class EventScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventSchedule
        fields = ['id', 'clinic', 'doctor', 'event_name', 'start_time', 'end_time', 'description']
        read_only_fields = ['id']

    def validate(self, attrs):
        if attrs['start_time'] >= attrs['end_time']:
            raise serializers.ValidationError('start_time must be before end_time')
        return attrs

class AdvertisingCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdvertisingCampaign
        fields = ['id', 'clinic', 'image', 'goto', 'campaign_name', 'start_date', 'end_date', 'budget', 'status']
        read_only_fields = ['id']

    def validate(self, attrs):
        if attrs['start_date'] > attrs['end_date']:
            raise serializers.ValidationError('start_date must be before or equal to end_date')
        return attrs

class UsersAuditSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UsersAudit
        fields = ['id', 'user', 'changed_data', 'changed_at']
        read_only_fields = ['id', 'user', 'changed_at']

