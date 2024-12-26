from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.core.validators import EmailValidator
from django.core.validators import RegexValidator
from apps.core.general import BaseModel

# User Management and Authentication
class UserManager(BaseUserManager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True.")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    email = models.EmailField(unique=True, max_length=255, validators=[EmailValidator()])
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    role = models.CharField(
        max_length=10,
        choices=[("patient", "Patient"), ("doctor", "Doctor"), ("clinic", "Clinic")],
        default="patient",
    )
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
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
    
    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

    def __str__(self):
        return self.get_full_name()

class UserProfile(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True, default="avatars/default.png")
    bio = models.TextField(blank=True)
    address = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    phone_number = models.CharField(
        max_length=15,
        blank=True,
        validators=[RegexValidator(regex=r"^\+?1?\d{9,15}$", message="Phone number must be in the format: '+999999999'.")],
    )
    html_content = models.TextField(blank=True)
    json_content = models.JSONField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=[("male", "Male"), ("female", "Female"), ("other", "Other")], blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['phone_number']),
        ]

    def __str__(self):
        return f"Profile of {self.user.get_full_name()}"


class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='patient')
    medical_history = models.TextField(blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"Patient: {self.user.get_full_name()}"

class Specialization(BaseModel):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        indexes = [
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return self.name
    
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
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['specialization']),
            models.Index(fields=['active', 'reservation_open']),
        ]

    def __str__(self):
        return f"Dr. {self.user.get_full_name()}"
