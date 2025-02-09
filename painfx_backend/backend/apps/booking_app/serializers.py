from rest_framework import serializers
from apps.booking_app.models import (
    Clinic, Reservation, ReservationStatus, Review, Post,
    Comment, Like, Category, Subscription, PaymentMethod,
    Payment, Notification, EventSchedule, AdvertisingCampaign,
    UsersAudit, Tag,ClinicDoctor,ClinicSettings,BannedPatient,MediaAttachment
)
from apps.authentication.serializers import DoctorSerializer, UserSerializer, PatientSerializer, SpecializationSerializer
from apps.authentication.models import Doctor
from django.contrib.contenttypes.models import ContentType

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class ClinicSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    doctors = DoctorSerializer(many=True, read_only=True)
    specialization = SpecializationSerializer(read_only=True)

    class Meta:
        model = Clinic
        fields = ['id', 'name', 'address', 'doctors', 'icon', 'owner', 'specialization', 'description',
                  'reservation_open', 'privacy', 'active', 'license_number', 'license_expiry_date',
                  'created_at']
        read_only_fields = ['id', 'created_at']
        
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

class ReservationSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    clinic = ClinicSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id', 'patient', 'clinic', 'doctor', 'status',
            'reason_for_cancellation', 'reservation_date', 'reservation_time'
        ]
        read_only_fields = ['id', 'patient']

    def validate(self, attrs):
        # Ensure that the reservation is linked to either a clinic or a doctor, but not both
        clinic = attrs.get('clinic')
        doctor = attrs.get('doctor')

        if not clinic and not doctor:
            raise serializers.ValidationError("A reservation must be linked to either a clinic or a doctor.")
        if clinic and doctor:
            raise serializers.ValidationError("A reservation cannot be linked to both a clinic and a doctor.")

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        if not hasattr(user, 'patient'):
            raise serializers.ValidationError("Only patients can create reservations.")

        # Ensure the patient is linked to the reservation
        validated_data['patient'] = user.patient

        # Create the reservation
        reservation = Reservation.objects.create(**validated_data)
        return reservation

    def update(self, instance, validated_data):
        # Update the reservation fields
        instance.status = validated_data.get('status', instance.status)
        instance.reason_for_cancellation = validated_data.get('reason_for_cancellation', instance.reason_for_cancellation)
        instance.reservation_date = validated_data.get('reservation_date', instance.reservation_date)
        instance.reservation_time = validated_data.get('reservation_time', instance.reservation_time)

        # Save and return the updated instance
        instance.save()
        return instance

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
        fields = ['id', 'media_type', 'file', 'url', 'order']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'post', 'parent', 'replies', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def get_replies(self, obj):
        replies = obj.replies.all()
        return CommentSerializer(replies, many=True).data

    def validate(self, attrs):
        post = attrs.get('post')
        if not Post.objects.filter(id=post.id).exists():
            raise serializers.ValidationError("The post does not exist.")
        return attrs


class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def validate(self, attrs):
        post = attrs.get('post')
        if not Post.objects.filter(id=post.id).exists():
            raise serializers.ValidationError("The post does not exist.")
        return attrs
    
class PostSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)
    tags = TagSerializer(many=True, required=False)
    media_attachments = MediaAttachmentSerializer(many=True, required=False)
    likes_count = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'content', 'tags', 'media_attachments', 'comments',
            'doctor', 'likes_count', 'comments_count', 'view_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'doctor', 'likes_count', 'comments_count', 'created_at', 'updated_at']

    def get_likes_count(self, obj):
        return obj.post_likes.count()

    def get_comments_count(self, obj):
        return obj.post_comments.count()

    def create(self, validated_data):
        user = self.context['request'].user
        if not hasattr(user, 'doctor'):
            raise serializers.ValidationError("Only doctors can create posts.")

        tags_data = validated_data.pop('tags', [])
        media_attachments_data = validated_data.pop('media_attachments', [])

        post = Post.objects.create(doctor=user.doctor, **validated_data)

        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_data['name'])
            post.tags.add(tag)

        for media_data in media_attachments_data:
            MediaAttachment.objects.create(post=post, **media_data)

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

