from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator,FileExtensionValidator
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.models import ContentType
from apps.authentication.models import Specialization, User, Doctor, Patient
from apps.core.general import BaseModel
from django.utils.translation import gettext_lazy as _
from datetime import datetime, timedelta

def validate_file_size(value):
    max_size = 10 * 1024 * 1024  # 5 MB
    if value.size > max_size:
        raise ValidationError(
            _('File size cannot exceed %(max_size)s MB.'),
            params={'max_size': max_size / (1024 * 1024)},
        )

# Enum Choices
class ReservationStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    APPROVED = 'approved', 'Approved'
    REJECTED = 'rejected', 'Rejected'
    CANCELLED = 'cancelled', 'Cancelled'

class SubscriptionStatus(models.TextChoices):
    ACTIVE = 'active', 'Active'
    CANCELLED = 'cancelled', 'Cancelled'

class PaymentStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    COMPLETED = 'completed', 'Completed'
    FAILED = 'failed', 'Failed'

class CampaignStatus(models.TextChoices):
    ACTIVE = 'active', 'Active'
    PAUSED = 'paused', 'Paused'
    COMPLETED = 'completed', 'Completed'
    
class MediaType(models.TextChoices):
    IMAGE = 'image', 'Image'
    VIDEO = 'video', 'Video'



class Tag(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        indexes = [models.Index(fields=['name'])]
        verbose_name = "Tag"
        verbose_name_plural = "Tags"

    def __str__(self):
        return self.name

class Clinic(BaseModel):
    name = models.CharField(max_length=255, db_index=True)
    address = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    specialization = models.ForeignKey(Specialization, on_delete=models.SET_NULL, null=True, blank=True)
    license_number = models.CharField(max_length=255, blank=True)
    license_expiry_date = models.DateField(null=True, blank=True)
    license_image = models.ImageField(upload_to='license_images/', blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_clinics')
    description = models.TextField(blank=True)
    icon = models.ImageField(upload_to='clinic_icons/', blank=True, null=True)
    privacy = models.BooleanField(default=False)
    reservation_open = models.BooleanField(default=True, db_index=True)
    active = models.BooleanField(default=False, db_index=True)
    doctors = models.ManyToManyField(Doctor, through='ClinicDoctor', related_name='clinics')

    class Meta:
        indexes = [
            models.Index(fields=['owner']),
            models.Index(fields=['reservation_open', 'active']),
            models.Index(fields=['name', 'address']),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(latitude__gte=-90) & models.Q(latitude__lte=90),
                name='valid_latitude'
            ),
            models.CheckConstraint(
                check=models.Q(longitude__gte=-180) & models.Q(longitude__lte=180),
                name='valid_longitude'
            ),
        ]

    def __str__(self):
        return f"Clinic: {self.name} ({self.owner})"

    @classmethod
    def get_active_clinics(cls):
        return cls.objects.filter(active=True, is_deleted=False).select_related('owner', 'specialization')



class ClinicDoctor(BaseModel):
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('clinic', 'doctor')
        indexes = [
            models.Index(fields=['clinic', 'doctor']),
        ]

    def __str__(self):
        return f"{self.doctor} at {self.clinic}"

class ClinicSettings(BaseModel):
    clinic = models.OneToOneField(Clinic, on_delete=models.CASCADE, related_name='settings')
    allow_online_bookings = models.BooleanField(default=True)
    notification_email = models.EmailField(blank=True, null=True)
    default_appointment_duration = models.PositiveIntegerField(default=30, validators=[MinValueValidator(1)])
    cancellation_policy = models.TextField(blank=True, null=True)
    working_hours = models.JSONField(default=dict)
    holiday_dates = models.JSONField(default=list)

    class Meta:
        verbose_name = "Clinic Settings"
        verbose_name_plural = "Clinic Settings"

    def __str__(self):
        return f"Settings for {self.clinic}"

    @classmethod
    def get_clinic_settings(cls, clinic):
        return cls.objects.select_related('clinic').get(clinic=clinic)
    

class BannedPatient(BaseModel):
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, related_name='banned_patients')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='banned_from')
    reason = models.TextField()
    banned_until = models.DateTimeField(null=True, blank=True, db_index=True)

    class Meta:
        unique_together = ('clinic', 'patient')
        indexes = [
            models.Index(fields=['clinic', 'patient', 'banned_until']),
        ]
        verbose_name = "Banned Patient"
        verbose_name_plural = "Banned Patients"

    def clean(self):
        if self.banned_until and self.banned_until < self.created_at:
            raise ValidationError("Ban end date cannot be earlier than the ban start date.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.patient} banned from {self.clinic}"

class Branch(BaseModel):
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, related_name='branches')
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255, blank=True)
    geolocation = models.JSONField(blank=True, null=True)
    active = models.BooleanField(default=False)
    reservation_open = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=['clinic']),
            models.Index(fields=['reservation_open', 'active']),
        ]

    def __str__(self):
        return f"Branch: {self.name} of {self.clinic.name}"


class BranchDoctor(BaseModel):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='branch_doctors')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='branches_assigned')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('branch', 'doctor')
        indexes = [
            models.Index(fields=['branch', 'doctor']),
        ]

    def __str__(self):
        return f"{self.doctor} at {self.branch}" 

class Reservation(BaseModel):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='reservations')
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, related_name='reservations', null=True, blank=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='reservations', null=True, blank=True)
    status = models.CharField(
        max_length=10,
        choices=[
            ('pending', _('Pending')),
            ('approved', _('Approved')),
            ('rejected', _('Rejected')),
            ('cancelled', _('Cancelled'))
        ],
        default='pending',
        db_index=True
    )
    reason_for_cancellation = models.TextField(blank=True)
    reservation_date = models.DateField(db_index=True)
    reservation_time = models.TimeField()

    class Meta:
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['clinic']),
            models.Index(fields=['doctor']),
            models.Index(fields=['reservation_date', 'reservation_time']),
        ]

    def clean(self):
        # Ensure that the reservation is linked to either a clinic or a doctor, but not both
        if not self.clinic and not self.doctor:
            raise ValidationError(_('A reservation must be linked to either a clinic or a doctor.'))
        if self.clinic and self.doctor:
            raise ValidationError(_('A reservation cannot be linked to both a clinic and a doctor.'))

        # Ensure the clinic or doctor is accepting reservations
        if self.clinic and not self.clinic.reservation_open:
            raise ValidationError(_('Reservations are currently closed for the selected clinic.'))
        if self.doctor and not self.doctor.reservation_open:
            raise ValidationError(_('Reservations are currently closed for the selected doctor.'))

    def save(self, *args, **kwargs):
        self.full_clean()  # Ensure validation is always called
        super().save(*args, **kwargs)
        
class Review(BaseModel):
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, related_name='reviews')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    review_text = models.TextField(blank=True)

    class Meta:
        unique_together = ('clinic', 'patient')
        indexes = [
            models.Index(fields=['clinic', 'rating']),
        ]

    def clean(self):
        if not Reservation.objects.filter(
            patient=self.patient,
            clinic=self.clinic,
            status=ReservationStatus.APPROVED
        ).exists():
            raise ValidationError('Patient must have an approved reservation to leave a review.')

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Review by {self.patient} for {self.clinic} - {self.rating} Stars"

    @classmethod
    def get_clinic_average_rating(cls, clinic):
        return cls.objects.filter(clinic=clinic).aggregate(models.Avg('rating'))['rating__avg']

class Post(BaseModel):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    tags = models.ManyToManyField(Tag, related_name="posts", blank=True)
    view_count = models.PositiveIntegerField(default=0)

    class Meta:
        indexes = [
            models.Index(fields=['doctor']),
            models.Index(fields=['view_count']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"Post '{self.title}' by {self.doctor.user.get_full_name()}"

    def increment_view_count(self):
        self.view_count += 1
        self.save(update_fields=['view_count'])

    def add_tags(self, tag_names):
        for tag_name in tag_names:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            self.tags.add(tag)
            tag.usage_count += 1
            tag.save()
        
class MediaAttachment(BaseModel):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='media_attachments')
    media_type = models.CharField(max_length=5, choices=MediaType.choices)
    file = models.FileField(
        upload_to='post_media/',
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov']),
            validate_file_size
        ]
    )
    thumbnail = models.ImageField(
        upload_to='post_thumbnails/',
        blank=True,
        null=True,
        validators=[validate_file_size]
    )
    url = models.URLField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        indexes = [
            models.Index(fields=['post', 'media_type']),
        ]

    def clean(self):
        if not self.file and not self.url:
            raise ValidationError("Either a file or a URL must be provided.")
        if self.file and self.url:
            raise ValidationError("Only one of file or URL should be provided, not both.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_media_type_display()} for {self.post}"


class Comment(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_comments')
    text = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')

    class Meta:
        indexes = [
            models.Index(fields=['post']),  # Faster lookups for comments on a post
        ]

    def __str__(self):
        return f"Comment by {self.user} on {self.post}"


class Like(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_likes')

    class Meta:
        unique_together = ('user', 'post')
        indexes = [
            models.Index(fields=['post']),
        ]

    def __str__(self):
        return f"{self.user} likes {self.post}"
    

class Category(BaseModel):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class PaymentMethod(BaseModel):
    method_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.method_name


class Payment(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE)
    payment_status = models.CharField(max_length=10, choices=PaymentStatus.choices)
    related_object = models.ForeignKey(
        'Reservation',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments'
    )

    class Meta:
        indexes = [
            models.Index(fields=['user'], name='idx_payments_user_id'),
        ]

    def clean(self):
        if not self.related_object:
            raise ValidationError('Payment must be linked to a reservation.')
        
class Subscription(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=SubscriptionStatus.choices, default=SubscriptionStatus.ACTIVE)
    payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, null=True, blank=True, related_name='subscriptions')

    class Meta:
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"{self.user} subscribed to {self.category}"

class Notification(BaseModel):
    NOTIFICATION_TYPE_CHOICES = (
        ('like', 'Like'),
        ('booking', 'Booking'),
        ('comment', 'Comment'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPE_CHOICES)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user}"


class EventSchedule(BaseModel):
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, blank=True)
    event_name = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    description = models.TextField(blank=True, null=True)

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError('start_time must be before end_time')

    def __str__(self):
        return f"Event {self.event_name} at {self.clinic}"

class AdvertisingCampaign(BaseModel):
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE)
    campaign_name = models.CharField(max_length=255)
    iamge = models.ImageField(upload_to='campaign_images/', blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=10, choices=CampaignStatus.choices)
    goto = models.URLField(blank=True, null=True)

    def clean(self):
        if self.start_date > self.end_date:
            raise ValidationError('start_date must be before or equal to end_date')

    def __str__(self):
        return f"Campaign {self.campaign_name} for {self.clinic}"

class UsersAudit(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    changed_data = models.JSONField()
    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Audit for {self.user} at {self.changed_at}"
