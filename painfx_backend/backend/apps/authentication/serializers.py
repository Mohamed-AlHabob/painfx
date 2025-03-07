from apps.booking_app.models import WorkingHours
from rest_framework import serializers
from apps.authentication.models import User, Patient, Doctor, UserProfile, Specialization

class UserProfileSerializer(serializers.ModelSerializer):
    country = serializers.SerializerMethodField()
    region = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ['id', 'phone_number', 'gender', 'avatar', 'bio', 'expo_push_token', 'country', 'region', 'city', 'postal_code', 'address']
        read_only_fields = ['id']

    def get_country(self, obj):
        return obj.country.name if obj.country else None

    def get_region(self, obj):
        return obj.region.name if obj.region else None

    def get_city(self, obj):
        return obj.city.name if obj.city else None

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'first_name', 'last_name','username','is_online', 'is_active','created_at', 'last_login', 'profile']
        read_only_fields = ['id', 'is_active', 'last_login']

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = ['id', 'name']
        read_only_fields = ['id']

class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Patient
        fields = ['user', 'medical_history']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        medical_history = validated_data.get('medical_history', '')
        return Patient.objects.create(user=user, medical_history=medical_history)

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()
        instance.medical_history = validated_data.get('medical_history', instance.medical_history)
        instance.save()
        return instance

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    specialization = SpecializationSerializer()
    working_hours = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ['user', 'specialization', 'active', 'privacy', 'license_number', 'license_expiry_date', 'license_image', 'reservation_open', 'working_hours']

    def get_working_hours(self, obj):
        from apps.booking_app.serializers import WorkingHoursSerializer
        working_hours = WorkingHours.objects.filter(doctor=obj)
        return WorkingHoursSerializer(working_hours, many=True).data


