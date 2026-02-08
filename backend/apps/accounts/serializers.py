"""Serializers pour l'app accounts (auth, users, OTP)."""
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import OTPCode, AuditLog

User = get_user_model()


# ──────────────────────────────────────────────
# AUTH
# ──────────────────────────────────────────────
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name',
            'phone', 'birth_date', 'password', 'password_confirm',
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError(
                {'password_confirm': "Les mots de passe ne correspondent pas."}
            )
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class OAIBTokenObtainPairSerializer(TokenObtainPairSerializer):
    """JWT login — ajoute role et nom complet dans le token."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['role'] = user.role
        token['full_name'] = f"{user.first_name} {user.last_name}"
        return token


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Mot de passe actuel incorrect.")
        return value


class RequestOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    purpose = serializers.ChoiceField(choices=OTPCode.Purpose.choices)


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=10)
    purpose = serializers.ChoiceField(choices=OTPCode.Purpose.choices)


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=10)
    new_password = serializers.CharField(validators=[validate_password])


# ──────────────────────────────────────────────
# USERS
# ──────────────────────────────────────────────
class UserSerializer(serializers.ModelSerializer):
    profile_status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name',
            'phone', 'birth_date', 'role', 'avatar',
            'is_email_verified', 'is_active', 'date_joined',
            'profile_status',
        ]
        read_only_fields = ['id', 'email', 'role', 'is_email_verified', 'date_joined', 'profile_status']

    def get_profile_status(self, obj) -> str:
        """Retourne le statut du profil candidat (ou 'none' si pas de profil)."""
        profile = getattr(obj, 'candidate_profile', None)
        if profile is None:
            return 'none'
        return profile.status


class UserMinimalSerializer(serializers.ModelSerializer):
    """Version légère pour les listes et références."""

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role']


class AdminUserSerializer(serializers.ModelSerializer):
    """Sérialiseur admin — peut modifier le rôle et le statut."""

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name',
            'phone', 'birth_date', 'role', 'avatar',
            'is_email_verified', 'is_active', 'is_staff',
            'date_joined', 'last_login',
        ]
        read_only_fields = ['id', 'email', 'date_joined', 'last_login']


# ──────────────────────────────────────────────
# AUDIT LOG
# ──────────────────────────────────────────────
class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_email', 'action',
            'target_model', 'target_id', 'details',
            'ip_address', 'created_at',
        ]
        read_only_fields = fields
