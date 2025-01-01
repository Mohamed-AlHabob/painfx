from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from djoser.social.views import ProviderAuthView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from apps.authentication.authentication import get_tokens_for_user, set_auth_cookies, clear_auth_cookies

class CustomProviderAuthView(ProviderAuthView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 201:
            tokens = get_tokens_for_user(response.data['user'])
            platform = request.data.get('platform', 'web')
            set_auth_cookies(response, tokens, platform)

        return response

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            tokens = response.data
            platform = request.data.get('platform', 'web')
            set_auth_cookies(response, tokens, platform)

        return response

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh') or request.data.get('refresh')

        if refresh_token:
            request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            tokens = {'access': response.data['access'], 'refresh': refresh_token}
            platform = request.data.get('platform', 'web')
            set_auth_cookies(response, tokens, platform)

        return response

class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)
        clear_auth_cookies(response)
        return response

