import uuid
from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator,FileExtensionValidator
from apps.authentication.models import Specialization, User, Doctor, Patient
from apps.core.general import BaseModel, generate_unique_code
from django.utils.translation import gettext_lazy as _
from datetime import datetime, timedelta, timezone

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

class WorkingHours(models.Model):
    DAY_CHOICES = [
        ('mon', 'Monday'),
        ('tue', 'Tuesday'),
        ('wed', 'Wednesday'),
        ('thu', 'Thursday'),
        ('fri', 'Friday'),
        ('sat', 'Saturday'),
        ('sun', 'Sunday')
    ]

    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, null=True, blank=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, null=True, blank=True)
    day = models.CharField(max_length=3, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['clinic', 'day'],
                name='unique_clinic_working_hours'
            ),
            models.UniqueConstraint(
                fields=['doctor', 'day'],
                name='unique_doctor_working_hours'
            )
        ]

class TimeSlot(models.Model):
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, null=True, blank=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_available = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['clinic', 'start_time', 'end_time'],
                name='unique_clinic_time_slot'
            ),
            models.UniqueConstraint(
                fields=['doctor', 'start_time', 'end_time'],
                name='unique_doctor_time_slot'
            )
        ]

class Reservation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled')
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='reservations')
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE, related_name='reservations')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    reason_for_cancellation = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['time_slot']),
            models.Index(fields=['status']),
        ]

    def clean(self):
        if self.time_slot.doctor and not self.time_slot.doctor.reservation_open:
            raise ValidationError("Reservations are currently closed for the selected doctor.")
        if self.time_slot.clinic and not self.time_slot.clinic.reservation_open:
            raise ValidationError("Reservations are currently closed for the selected clinic.")

    def save(self, *args, **kwargs):
        self.full_clean()  # Ensure validation is always called
        super().save(*args, **kwargs)
        

class Review(BaseModel):
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='reviews')

    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    review_text = models.TextField(blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['clinic']),
            models.Index(fields=['doctor']),
            models.Index(fields=['rating']),
        ]

    def clean(self):
        """Ensure a review is linked to either a Clinic or a Doctor, but not both."""
        if self.clinic and self.doctor:
            raise ValidationError("A review cannot be associated with both a Clinic and a Doctor at the same time.")
        if not self.clinic and not self.doctor:
            raise ValidationError("A review must be associated with either a Clinic or a Doctor.")

        from apps.core.models import Reservation, ReservationStatus
        if self.clinic:
            reservation_exists = Reservation.objects.filter(
                patient=self.patient, clinic=self.clinic, status=ReservationStatus.APPROVED
            ).exists()
        else:
            reservation_exists = Reservation.objects.filter(
                patient=self.patient, doctor=self.doctor, status=ReservationStatus.APPROVED
            ).exists()

        if not reservation_exists:
            raise ValidationError("Patient must have an approved reservation to leave a review.")

    def save(self, *args, **kwargs):
        """Validate data before saving."""
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        target = self.clinic if self.clinic else self.doctor
        return f"Review by {self.patient} for {target} - {self.rating} Stars"

    @classmethod
    def get_average_rating(cls, entity):
        """Get the average rating for a given clinic or doctor."""
        if isinstance(entity, Clinic):
            return cls.objects.filter(clinic=entity).aggregate(models.Avg('rating'))['rating__avg']
        elif isinstance(entity, Doctor):
            return cls.objects.filter(doctor=entity).aggregate(models.Avg('rating'))['rating__avg']
        return None


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
            models.Index(fields=['post']),
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
    


class DiscountCard(BaseModel):
    DISCOUNT_TYPE_CHOICES = (
        ('percentage', _('Percentage')),
        ('fixed', _('Fixed Amount')),
    )
    code = models.CharField(
        max_length=12, 
        unique=True, 
        default=generate_unique_code,
        help_text=_("Unique code for the discount card")
    )
    patient = models.ForeignKey(
        Patient, 
        on_delete=models.CASCADE, 
        related_name='discount_cards'
    )
    clinic = models.ForeignKey(
        Clinic, 
        on_delete=models.CASCADE, 
        related_name='discount_cards'
    )
    discount_value = models.DecimalField(
        max_digits=6, 
        decimal_places=2, 
        help_text=_("Discount value (e.g., 10 for 10% discount or a fixed amount)")
    )
    discount_type = models.CharField(
        max_length=10,
        choices=DISCOUNT_TYPE_CHOICES,
        help_text=_("Indicates whether the discount is a percentage or a fixed amount")
    )
    is_used = models.BooleanField(
        default=False,
        help_text=_("Indicates whether the discount card has been redeemed")
    )
    awarded_at = models.DateTimeField(
        auto_now_add=True,
        help_text=_("Timestamp when the discount card was granted")
    )
    valid_until = models.DateTimeField(
        null=True, 
        blank=True,
        help_text=_("Optional expiration date for the discount card")
    )
    redeemed_at = models.DateTimeField(
        null=True, 
        blank=True,
        help_text=_("Timestamp when the discount card was redeemed")
    )

    class Meta:
        verbose_name = _("Discount Card")
        verbose_name_plural = _("Discount Cards")
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['patient']),
            models.Index(fields=['clinic']),
        ]

    def redeem(self):
        """Mark the discount card as used if it hasn't been already."""
        if not self.is_used:
            self.is_used = True
            self.redeemed_at = timezone.now()
            self.save(update_fields=['is_used', 'redeemed_at'])
        else:
            raise ValidationError(_("This discount card has already been used."))

    def __str__(self):
        return f"DiscountCard {self.code} for {self.patient.user.get_full_name()} at {self.clinic.name}"


class DiscountRule(BaseModel):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    # Optionally, you may want the rule to apply to a specific clinic.
    clinic = models.ForeignKey(
        Clinic, 
        on_delete=models.CASCADE, 
        related_name='discount_rules', 
        null=True, 
        blank=True,
        help_text=_("If set, this rule applies only to the specified clinic")
    )
    discount_value = models.DecimalField(
        max_digits=6, 
        decimal_places=2, 
        help_text=_("Discount value to be granted")
    )
    discount_type = models.CharField(
        max_length=10,
        choices=DiscountCard.DISCOUNT_TYPE_CHOICES,
        help_text=_("Type of discount: percentage or fixed amount")
    )
    # A JSON field to hold the conditions for the rule.
    # For example: {"min_reservations": 5}
    condition_json = models.JSONField(
        blank=True, 
        null=True, 
        help_text=_("Conditions for awarding this discount card in JSON format")
    )
    active = models.BooleanField(default=True)

    class Meta:
        verbose_name = _("Discount Rule")
        verbose_name_plural = _("Discount Rules")
        indexes = [
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return self.name
    

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
        ('message', 'Message'),
        ('discount', 'Discount'),
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
