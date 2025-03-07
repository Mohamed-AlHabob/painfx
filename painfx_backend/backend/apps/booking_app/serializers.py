from rest_framework import serializers
from apps.booking_app.models import (
    Clinic, Reservation, ReservationStatus, Review, Post,
    Comment, Like, Category, Subscription, PaymentMethod,
    Payment, Notification, EventSchedule, AdvertisingCampaign,
    UsersAudit, Tag,ClinicDoctor,ClinicSettings,BannedPatient,MediaAttachment,TimeSlot,WorkingHours
)
from apps.authentication.serializers import DoctorSerializer, UserSerializer, PatientSerializer, SpecializationSerializer
from apps.authentication.models import Doctor
from django.contrib.contenttypes.models import ContentType

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']



class WorkingHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkingHours
        fields = ['day', 'start_time', 'end_time']
        
class ClinicSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    doctors = DoctorSerializer(many=True, read_only=True)
    specialization = SpecializationSerializer(read_only=True)
    working_hours = serializers.SerializerMethodField()

    class Meta:
        model = Clinic
        fields = ['id', 'name', 'address', 'doctors', 'icon', 'owner', 'specialization', 'description',
                  'reservation_open', 'privacy', 'active', 'license_number', 'license_expiry_date',
                  'created_at', 'working_hours']
        read_only_fields = ['id', 'created_at']

    def get_working_hours(self, obj):
        working_hours = WorkingHours.objects.filter(clinic=obj)
        return WorkingHoursSerializer(working_hours, many=True).data
        
class ClinicDoctorSerializer(serializers.ModelSerializer):
    clinic = ClinicSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)

    class Meta:
        model = ClinicDoctor
        fields = ['id', 'clinic', 'doctor', 'joined_at']

class ClinicSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicSettings
        fields = ['id', 'clinic', 'allow_online_bookings', 'notification_email',
                  'default_appointment_duration', 'cancellation_policy',
                  'working_hours', 'holiday_dates']

class BannedPatientSerializer(serializers.ModelSerializer):
    clinic = ClinicSerializer(read_only=True)
    patient = PatientSerializer(read_only=True)

    class Meta:
        model = BannedPatient
        fields = ['id', 'clinic', 'patient', 'reason', 'banned_until']

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['id', 'clinic', 'doctor', 'start_time', 'end_time', 'is_available']

class ReservationSerializer(serializers.ModelSerializer):
    time_slot = TimeSlotSerializer(read_only=True)

    class Meta:
        model = Reservation
        fields = ['id', 'patient', 'time_slot', 'status', 'reason_for_cancellation', 'created_at', 'updated_at']
        read_only_fields = ['id', 'patient', 'created_at', 'updated_at']

    def validate(self, attrs):
        time_slot = attrs.get('time_slot')
        if not time_slot.is_available:
            raise serializers.ValidationError("The selected time slot is not available.")
        return attrs

class ReviewSerializer(serializers.ModelSerializer):
    clinic = ClinicSerializer(read_only=True)
    patient = PatientSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'clinic', 'patient', 'rating', 'review_text']
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
    
class MediaAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAttachment
        fields = ['id', 'post', 'media_type', 'file', 'thumbnail', 'url', 'order']

    def validate(self, data):
        if not data.get('file') and not data.get('url'):
            raise serializers.ValidationError("Either a file or a URL must be provided.")
        if data.get('file') and data.get('url'):
            raise serializers.ValidationError("Only one of file or URL should be provided, not both.")
        return data


class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'text', 'parent','replies', 'created_at']
        read_only_fields = ['created_at']

    def get_replies(self, obj):
        replies = obj.replies.all()
        return CommentSerializer(replies, many=True).data
        
    def validate(self, data):
        if data.get('parent') and data['parent'].post != data['post']:
            raise serializers.ValidationError("Parent comment must belong to the same post.")
        return data

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'created_at']
        read_only_fields = ['user', 'created_at']
    
class PostSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    media_attachments = MediaAttachmentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'doctor', 'title', 'content','likes_count','comments_count', 'tags','is_liked', 'media_attachments', 'view_count', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['view_count', 'created_at', 'likes_count', 'comments_count', 'updated_at']

    def get_likes_count(self, obj):
        return obj.post_likes.count()

    def get_comments_count(self, obj):
        return obj.post_comments.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.post_likes.filter(user=request.user).exists()
        return False

    def create(self, validated_data):
        tags_data = self.context.get('tags', [])
        post = Post.objects.create(**validated_data)
        for tag_name in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            post.tags.add(tag)
        return post

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['id', 'method_name']
        read_only_fields = ['id']

class PaymentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    method = PaymentMethodSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'user', 'amount', 'method', 'payment_status', 'related_object']
        read_only_fields = ['id', 'user']
        
class SubscriptionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    payment = PaymentSerializer(read_only=True)

    class Meta:
        model = Subscription
        fields = ['id', 'user', 'category', 'status', 'payment']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

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
    clinic = ClinicSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)

    class Meta:
        model = EventSchedule
        fields = ['id', 'clinic', 'doctor', 'event_name', 'start_time', 'end_time', 'description']
        read_only_fields = ['id']

    def validate(self, attrs):
        if attrs['start_time'] >= attrs['end_time']:
            raise serializers.ValidationError('start_time must be before end_time')
        return attrs

class AdvertisingCampaignSerializer(serializers.ModelSerializer):
    clinic = ClinicSerializer(read_only=True)

    class Meta:
        model = AdvertisingCampaign
        fields = ['id', 'clinic', 'campaign_name', 'iamge', 'start_date', 'end_date',
                  'budget', 'status', 'goto']
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

