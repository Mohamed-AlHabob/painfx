from rest_framework import serializers
from apps.authentication.models import User, Patient, Doctor, UserProfile, Specialization

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'phone_number', 'gender', 'avatar','expo_push_token' , 'country', 'region', 'city', 'postal_code', 'address']
        read_only_fields = ['id']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'first_name', 'last_name', 'username', 'is_active', 'last_login', 'profile']
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
        return Patient.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()
        return super().update(instance, validated_data)

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    specialization = SpecializationSerializer()

    class Meta:
        model = Doctor
        fields = ['user', 'specialization','active','privacy', 'license_number', 'license_expiry_date','license_image', 'reservation_open']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        specialization_data = validated_data.pop('specialization', None)
        user = User.objects.create_user(**user_data)
        specialization = Specialization.objects.get_or_create(**specialization_data)[0]
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
        return super().update(instance, validated_data)

