from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def set_auth_cookies(response, tokens, platform='web'):
    if platform == 'web':
        response.set_cookie(
            'access',
            tokens['access'],
            max_age=settings.AUTH_COOKIE_MAX_AGE,
            path=settings.AUTH_COOKIE_PATH,
            secure=settings.AUTH_COOKIE_SECURE,
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            samesite=settings.AUTH_COOKIE_SAMESITE
        )
        response.set_cookie(
            'refresh',
            tokens['refresh'],
            max_age=settings.AUTH_COOKIE_MAX_AGE,
            path=settings.AUTH_COOKIE_PATH,
            secure=settings.AUTH_COOKIE_SECURE,
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            samesite=settings.AUTH_COOKIE_SAMESITE
        )
    else:  # mobile (iOS, Android)
        response.set_cookie(
            'access',
            tokens['access'],
            max_age=settings.MOBILE_COOKIE_MAX_AGE,
            secure=settings.MOBILE_AUTH_COOKIE_SECURE,
            httponly=settings.MOBILE_AUTH_COOKIE_HTTP_ONLY,
            samesite=settings.MOBILE_AUTH_COOKIE_SAMESITE
        )
        response.set_cookie(
            'refresh',
            tokens['refresh'],
            max_age=settings.MOBILE_COOKIE_MAX_AGE,
            secure=settings.MOBILE_AUTH_COOKIE_SECURE,
            httponly=settings.MOBILE_AUTH_COOKIE_HTTP_ONLY,
            samesite=settings.MOBILE_AUTH_COOKIE_SAMESITE
        )

def clear_auth_cookies(response):
    response.delete_cookie('access')
    response.delete_cookie('refresh')

