from pathlib import Path
import environ
from django.core.management.utils import get_random_secret_key
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# Initialize environment variables
env = environ.Env(
    DEBUG=(bool, False),
    DEVELOPMENTMODE=(bool, False)
)

# Read environment variables from .env file if present
environ.Env.read_env(env_file=os.path.join(BASE_DIR, '.env'))

def read_secret(file_path):
    with open(file_path, 'r') as file:
        return file.read().strip()

# Ensure log directory exists
log_dir = BASE_DIR / "logs"
if not log_dir.exists():
    os.makedirs(log_dir)

# Secret key
SECRET_KEY = read_secret('/run/secrets/django_secret_key') if os.path.exists('/run/secrets/django_secret_key') else get_random_secret_key()

# Debugging and development mode
DEBUG = env("DJANGO_DEBUG", default=False)
DEVELOPMENTMODE = env("DEVELOPMENTMODE", default=False)

# Allowed hosts
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["*"])

# CORS settings
CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS",
    default=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
)
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = DEVELOPMENTMODE

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "drf_yasg",
    "rest_framework",
    "djoser",
    "storages",
    "social_django",
    "django_celery_beat",
    "django_celery_results",
    "apps.authentication",
    "apps.booking_app",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# WSGI and ASGI applications
WSGI_APPLICATION = "core.wsgi.application"
ASGI_APPLICATION = "core.asgi.application"

# Database configuration
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("POSTGRES_DB", default="painfx_db"),
        "USER": env("POSTGRES_USER", default="painfx_user"),
        "PASSWORD": read_secret('/run/secrets/postgres_password'),
        "HOST": env("POSTGRES_HOST", default="localhost"),
        "PORT": env("POSTGRES_PORT", default="5432"),
    }
}

# Password validators
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Localization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static and media files
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

# Domain and site settings
DOMAIN = env("DOMAIN", default="localhost:3000")
SITE_NAME = "PainFX"

# Custom user model
AUTH_USER_MODEL = "authentication.User"

# Stripe settings
STRIPE_SECRET_KEY = read_secret('/run/secrets/stripe_secret_key') if os.path.exists('/run/secrets/stripe_secret_key') else env("STRIPE_SECRET_KEY", default="sk_test_...")
STRIPE_WEBHOOK_SECRET = read_secret('/run/secrets/stripe_webhook_secret') if os.path.exists('/run/secrets/stripe_webhook_secret') else env("STRIPE_WEBHOOK_SECRET", default="")


# Google Maps API Key
GOOGLE_MAPS_API_KEY = read_secret('/run/secrets/google_maps_api_key') if os.path.exists('/run/secrets/google_maps_api_key') else env("GOOGLE_MAPS_API_KEY", default="")

# Twilio settings
TWILIO_ACCOUNT_SID = read_secret('/run/secrets/twilio_account_sid') if os.path.exists('/run/secrets/twilio_account_sid') else env("TWILIO_ACCOUNT_SID", default="ACxxxx")
TWILIO_AUTH_TOKEN = read_secret('/run/secrets/twilio_auth_token') if os.path.exists('/run/secrets/twilio_auth_token') else env("TWILIO_AUTH_TOKEN", default="47ab8efcd0a1a83629f6fa288a230a36")
TWILIO_FROM_NUMBER = env("TWILIO_FROM_NUMBER", default="+17753178557")

# Email settings
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default="supernovasoftwareco@gmail.com")
EMAIL_HOST_PASSWORD = read_secret('/run/secrets/email_host_password') if os.path.exists('/run/secrets/email_host_password') else env("EMAIL_HOST_PASSWORD", default="aodc mqwb nibd clbz")
DEFAULT_FROM_EMAIL = SITE_NAME

# Default auto field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# REST framework settings
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "apps.authentication.authentication.CustomJWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

# Celery settings
CELERY_BROKER_URL = env("CELERY_BROKER_URL", default="redis://localhost:6379/0")
CELERY_RESULT_BACKEND = env("CELERY_RESULT_BACKEND", default="redis://localhost:6379/0")
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "UTC"
broker_connection_retry_on_startup = True

# Logging settings
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
        "file": {
            "class": "logging.FileHandler",
            "filename": log_dir / "django.log",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console", "file"],
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": False,
        },
    },
    "formatters": {
        "verbose": {"format": "{levelname} {asctime} {module} {message}", "style": "{"},
        "simple": {"format": "{levelname} {message}", "style": "{"},
    },
}

# Security settings for production
if not DEVELOPMENTMODE:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 3600
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"
