from pathlib import Path
import environ
from django.core.management.utils import get_random_secret_key
import os
from django.core.exceptions import ImproperlyConfigured  # Ensure this is imported

BASE_DIR = Path(__file__).resolve().parent.parent

# Initialize environment variables
env = environ.Env(
    DEBUG=(bool, False),
    DEVELOPMENTMODE=(bool, False)
)

# Read environment variables from .env file if present
environ.Env.read_env(env_file=os.path.join(BASE_DIR, '.env'))

def read_secret(secret_name, default_value=None):
    try:
        with open(f"/run/secrets/{secret_name}") as secret_file:
            return secret_file.read().strip()
    except FileNotFoundError:
        if default_value is not None:
            return default_value
        raise ImproperlyConfigured(f"Secret {secret_name} not found and no default provided.")


# Ensure log directory exists
log_dir = BASE_DIR / "logs"
if not log_dir.exists():
    os.makedirs(log_dir)

# Debugging and development mode
DEBUG = env("DJANGO_DEBUG", default=False)
DEVELOPMENTMODE = env("DEVELOPMENTMODE", default=False)

# Secret key
SECRET_KEY = read_secret('django_secret_key') if not DEVELOPMENTMODE else get_random_secret_key()

# Allowed hosts
ALLOWED_HOSTS = env.list(
    "ALLOWED_HOSTS",
    default=["api.painfx.in", "painfx.in", "www.painfx.in", "localhost", "143.110.155.48"]
)

# CORS settings
CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS",
    default=[
        "https://api.painfx.in",
        "https://painfx.in",
        "https://www.painfx.in",
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
        "NAME": read_secret('postgres_db'),
        "USER": read_secret('postgres_user'),
        "PASSWORD": read_secret('postgres_password'),
        "HOST": env("POSTGRES_HOST", default="painfx_stack_postgres"),
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
DOMAIN = env("DOMAIN", default="https://painfx.in")
SITE_NAME = "PainFX"

# Custom user model
AUTH_USER_MODEL = "authentication.User"

# Stripe settings
STRIPE_SECRET_KEY = read_secret('stripe_secret_key')
STRIPE_WEBHOOK_SECRET = read_secret('stripe_webhook_secret')

# Google Maps API Key
GOOGLE_MAPS_API_KEY = read_secret('google_maps_api_key')

# Twilio settings
TWILIO_ACCOUNT_SID = read_secret('twilio_account_sid')
TWILIO_AUTH_TOKEN = read_secret('twilio_auth_token')
TWILIO_FROM_NUMBER = "+17753178557"

# Email settings
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default="supernovasoftwareco@gmail.com")
EMAIL_HOST_PASSWORD = read_secret('email_host_password')
DEFAULT_FROM_EMAIL = f"{SITE_NAME} <{EMAIL_HOST_USER}>"

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
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.UserRateThrottle",
        "rest_framework.throttling.AnonRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "user": "1000/day",
        "anon": "100/day",
    },
}

# Celery settings
CELERY_BROKER_URL = "redis://:${REDIS_PASSWORD}@redis:6379/0"
CELERY_RESULT_BACKEND = "redis://:${REDIS_PASSWORD}@redis:6379/0"
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "UTC"
CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP = True

# Logging settings
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": log_dir / "django.log",
            "maxBytes": 1024*1024*5,  # 5MB
            "backupCount": 5,
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

    # Additional security settings
    SECURE_REFERRER_POLICY = "same-origin"
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    CSRF_TRUSTED_ORIGINS = ['https://painfx.in', 'https://www.painfx.in', 'https://api.painfx.in']
    
    # Content Security Policy (CSP)
    CSP_DEFAULT_SRC = ("'self'",)
    CSP_SCRIPT_SRC = ("'self'", 'https://trustedscripts.example.com')
    CSP_STYLE_SRC = ("'self'", 'https://trustedstyles.example.com')
    CSP_IMG_SRC = ("'self'", 'data:')
    CSP_CONNECT_SRC = ("'self'", 'https://api.painfx.in')
    CSP_FONT_SRC = ("'self'",)
    CSP_OBJECT_SRC = ("'none'",)
    CSP_BASE_URI = ("'self'",)
    CSP_FORM_ACTION = ("'self'",)
    CSP_FRAME_ANCESTORS = ("'none'",)
