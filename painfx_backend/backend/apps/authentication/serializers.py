from apps.booking_app.models import WorkingHours
from apps.booking_app.serializers import WorkingHoursSerializer
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
        working_hours = WorkingHours.objects.filter(doctor=obj)
        return WorkingHoursSerializer(working_hours, many=True).data
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        specialization_data = validated_data.pop('specialization', None)
        user = User.objects.create_user(**user_data)
        specialization = Specialization.objects.get_or_create(**specialization_data)[0] if specialization_data else None
        return Doctor.objects.create(user=user, specialization=specialization, **validated_data)

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        specialization_data = validated_data.pop('specialization', None)
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()
        if specialization_data:
            specialization = Specialization.objects.get_or_create(**specialization_data)[0]
            instance.specialization = specialization
        instance.active = validated_data.get('active', instance.active)
        instance.privacy = validated_data.get('privacy', instance.privacy)
        instance.license_number = validated_data.get('license_number', instance.license_number)
        instance.license_expiry_date = validated_data.get('license_expiry_date', instance.license_expiry_date)
        instance.license_image = validated_data.get('license_image', instance.license_image)
        instance.reservation_open = validated_data.get('reservation_open', instance.reservation_open)
        instance.save()
        return instance

