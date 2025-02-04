from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.core.validators import EmailValidator
from django.core.validators import RegexValidator
from apps.core.general import BaseModel
from django.utils.translation import gettext_lazy as _

def upload_avatar(instance, filename):
	path = f'avatar/{instance.username}'
	extension = filename.split('.')[-1]
	if extension:
		path = path + '.' + extension
	return path

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_("The Email field must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

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
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
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
    address = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    phone_number = models.CharField(
        max_length=15,
        blank=True,
        validators=[RegexValidator(regex=r"^\+?1?\d{9,15}$", message=_("Phone number must be in the format: '+999999999'."))],
    )
    expo_push_token = models.CharField(max_length=255, null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[("he", _("He")), ("she", _("She")), ("other", _("Other"))], blank=True)

    class Meta:
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
    specialization = models.ForeignKey(Specialization, on_delete=models.SET_NULL, null=True, blank=True)
    license_number = models.CharField(max_length=255, blank=True)
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
