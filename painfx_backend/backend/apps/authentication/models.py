import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.core.validators import EmailValidator, RegexValidator
from django.utils.translation import gettext_lazy as _
from apps.core.general import BaseModel
from phonenumber_field.modelfields import PhoneNumberField
from cities_light.models import City, Region, Country

def upload_avatar(instance, filename):
    user_uuid = instance.id if instance.id else uuid.uuid4().hex
    path = f'avatar/{user_uuid}'
    extension = filename.split('.')[-1] if '.' in filename else 'jpg'
    return f'{path}.{extension}'

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_("The Email field must be set"))
        email = self.normalize_email(email)
        username = self.generate_unique_username()
        extra_fields.setdefault("username", username)
        
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def generate_unique_username(self, email):
        base_username = email.split('@')[0].replace('.', '').replace('_', '').replace('-', '')
        username = f"{base_username}-painfx"
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}-painfx"
            counter += 1
        return username

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if not extra_fields.get("is_staff"):
            raise ValueError(_("Superuser must have is_staff=True."))
        if not extra_fields.get("is_superuser"):
            raise ValueError(_("Superuser must have is_superuser=True."))

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    email = models.EmailField(
        unique=True, 
        max_length=255, 
        validators=[EmailValidator()],
        verbose_name=_("Email Address")
    )
    username = models.CharField(max_length=30, blank=True, verbose_name=_("Username"))
    first_name = models.CharField(max_length=30, blank=True, verbose_name=_("First Name"))
    last_name = models.CharField(max_length=30, blank=True, verbose_name=_("Last Name"))
    language = models.CharField(max_length=10, default="en")
    timezone = models.CharField(max_length=50, default="UTC")
    is_online = models.BooleanField(default=False)

    preferred_language = models.CharField(max_length=10, default="en", verbose_name=_("Preferred Language"))
    preferred_currency = models.CharField(max_length=10, default="USD", verbose_name=_("Preferred Currency"))
    
    is_active = models.BooleanField(default=True, verbose_name=_("Active"))
    is_staff = models.BooleanField(default=False, verbose_name=_("Staff Status"))

    role = models.CharField(
        max_length=10,
        choices=[("patient", _("Patient")), ("doctor", _("Doctor")), ("clinic", _("Clinic"))],
        default="patient",
        verbose_name=_("User Role")
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['is_active']),
            models.Index(fields=['role']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['email'],
                condition=models.Q(is_deleted=False),
                name='unique_active_email',
            )
        ]

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email

    def __str__(self):
        return self.get_full_name()

class UserProfile(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    date_of_birth = models.DateField(null=True, blank=True)
    avatar = models.ImageField(upload_to=upload_avatar, null=True, blank=True)
    bio = models.TextField(blank=True)
    phone_number = PhoneNumberField(blank=True, verbose_name=_("Phone Number"))
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, blank=True)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True)
    postal_code = models.CharField(max_length=20, blank=True, verbose_name=_("Postal Code"))
    address = models.CharField(max_length=255, blank=True, verbose_name=_("Address"))
    privacy_consent = models.BooleanField(default=False, verbose_name=_("Privacy Consent"))
    consent_date = models.DateTimeField(null=True, blank=True, verbose_name=_("Consent Date"))

    expo_push_token = models.CharField(max_length=255, null=True, blank=True)
    gender = models.CharField(
        max_length=20,
        choices=[
            ("male", _("Male")),
            ("female", _("Female")),
            ("non_binary", _("Non-Binary")),
            ("other", _("Other")),
            ("prefer_not_to_say", _("Prefer Not to Say"))
        ],
        default="prefer_not_to_say",
        blank=True,
        verbose_name=_("Gender")
    )

    class Meta:
        verbose_name = _("User Profile")
        verbose_name_plural = _("User Profiles")
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['phone_number']),
        ]

    def __str__(self):
        return f"Profile of {self.user.get_full_name()}"

class Specialization(BaseModel):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        verbose_name = _("Specialization")
        verbose_name_plural = _("Specializations")
        indexes = [
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return self.name

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='patient')
    medical_history = models.TextField(blank=True)

    class Meta:
        verbose_name = _("Patient")
        verbose_name_plural = _("Patients")
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"Patient: {self.user.get_full_name()}"
    
class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='doctor')
    specialization = models.ForeignKey(Specialization, on_delete=models.SET_NULL, null=True, blank=True, related_name='doctors')
    license_number = models.CharField(max_length=255, blank=True, null=True)
    license_expiry_date = models.DateField(null=True, blank=True)
    license_image = models.ImageField(upload_to="license_images/", blank=True, null=True)
    active = models.BooleanField(default=False)
    privacy = models.BooleanField(default=False)
    reservation_open = models.BooleanField(default=True)

    class Meta:
        verbose_name = _("Doctor")
        verbose_name_plural = _("Doctors")
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['specialization']),
            models.Index(fields=['active', 'reservation_open']),
        ]

    def __str__(self):
        return f"Dr. {self.user.get_full_name()}"