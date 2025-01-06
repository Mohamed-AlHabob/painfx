from django.apps import AppConfig


class BookingAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.booking_app'
    
    def ready(self):
        import apps.booking_app.signals
