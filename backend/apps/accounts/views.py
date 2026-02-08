"""Views pour l'app accounts (auth, users, OTP)."""
import random
import string

from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.permissions import IsAdmin, IsOwner, IsOwnerOrAdmin
from .models import OTPCode, AuditLog, PendingRegistration
from .tasks import send_otp_email
from .serializers import (
    RegisterSerializer,
    OAIBTokenObtainPairSerializer,
    ChangePasswordSerializer,
    RequestOTPSerializer,
    VerifyOTPSerializer,
    ResetPasswordSerializer,
    UserSerializer,
    AdminUserSerializer,
    AuditLogSerializer,
)

User = get_user_model()


def _generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))


# ──────────────────────────────────────────────
# AUTH
# ──────────────────────────────────────────────
class RegisterView(generics.CreateAPIView):
    """
    Inscription d'un nouvel utilisateur.
    Les données sont stockées temporairement jusqu'à vérification OTP.
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        from django.contrib.auth.hashers import make_password

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']

        # Vérifier si l'email existe déjà (utilisateur ou inscription en attente)
        if User.objects.filter(email=email).exists():
            return Response(
                {'detail': 'Un compte existe déjà avec cet email.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Supprimer les anciennes inscriptions en attente pour cet email
        PendingRegistration.objects.filter(email=email).delete()

        # Générer le code OTP
        code = _generate_otp()
        expires_at = timezone.now() + timedelta(minutes=10)

        # Stocker temporairement les données d'inscription
        pending = PendingRegistration.objects.create(
            email=email,
            password_hash=make_password(serializer.validated_data['password']),
            first_name=serializer.validated_data.get('first_name', ''),
            last_name=serializer.validated_data.get('last_name', ''),
            phone=serializer.validated_data.get('phone', ''),
            birth_date=serializer.validated_data.get('birth_date'),
            otp_code=code,
            otp_expires_at=expires_at,
        )

        # Envoyer le code OTP par email
        send_otp_email.delay(email, code, OTPCode.Purpose.EMAIL_VERIFY)

        return Response(
            {'detail': 'Code de vérification envoyé. Vérifiez votre email.'},
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    """Connexion JWT — retourne access + refresh tokens."""
    serializer_class = OAIBTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]


class ChangePasswordView(generics.GenericAPIView):
    """Changement de mot de passe (utilisateur connecté)."""
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({'detail': 'Mot de passe modifié avec succès.'})


class RequestOTPView(generics.GenericAPIView):
    """Demande d'un code OTP (vérification email ou reset password)."""
    serializer_class = RequestOTPSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        purpose = serializer.validated_data['purpose']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Ne pas révéler si l'email existe ou non
            return Response({'detail': 'Si cet email existe, un code OTP a été envoyé.'})

        # Invalider les anciens codes
        OTPCode.objects.filter(user=user, purpose=purpose, is_used=False).update(is_used=True)

        code = _generate_otp()
        OTPCode.objects.create(
            user=user,
            code=code,
            purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=10),
        )

        # Envoyer le code par email via Celery
        send_otp_email.delay(user.email, code, purpose)

        return Response({'detail': 'Si cet email existe, un code OTP a été envoyé.'})


class VerifyOTPView(generics.GenericAPIView):
    """
    Vérification d'un code OTP.
    Pour les inscriptions, crée l'utilisateur après vérification du code.
    """
    serializer_class = VerifyOTPSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from rest_framework_simplejwt.tokens import RefreshToken

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        purpose = serializer.validated_data['purpose']

        # Cas 1 : Vérification email pour inscription (PendingRegistration)
        if purpose == OTPCode.Purpose.EMAIL_VERIFY:
            try:
                pending = PendingRegistration.objects.get(email=email, otp_code=code)
            except PendingRegistration.DoesNotExist:
                return Response(
                    {'detail': 'Code OTP invalide.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not pending.is_otp_valid:
                return Response(
                    {'detail': 'Code OTP expiré.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Créer l'utilisateur maintenant que l'OTP est vérifié
            user = User.objects.create(
                email=pending.email,
                password=pending.password_hash,  # Déjà hashé
                first_name=pending.first_name,
                last_name=pending.last_name,
                phone=pending.phone,
                birth_date=pending.birth_date,
                is_email_verified=True,  # Email vérifié !
                role=User.Role.STUDENT,
            )

            # Supprimer l'inscription en attente
            pending.delete()

            # Générer les tokens JWT
            refresh = RefreshToken.for_user(user)

            return Response({
                'detail': 'Inscription validée avec succès !',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role,
                },
            })

        # Cas 2 : Vérification OTP pour utilisateur existant (reset password)
        try:
            user = User.objects.get(email=email)
            otp = OTPCode.objects.filter(
                user=user,
                code=code,
                purpose=purpose,
                is_used=False,
            ).latest('created_at')
        except (User.DoesNotExist, OTPCode.DoesNotExist):
            return Response(
                {'detail': 'Code OTP invalide.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not otp.is_valid:
            return Response(
                {'detail': 'Code OTP expiré.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        otp.is_used = True
        otp.save()

        return Response({'detail': 'Code OTP vérifié avec succès.'})


class ResetPasswordView(generics.GenericAPIView):
    """Réinitialisation du mot de passe via code OTP."""
    serializer_class = ResetPasswordSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data['email'])
            otp = OTPCode.objects.filter(
                user=user,
                code=serializer.validated_data['code'],
                purpose=OTPCode.Purpose.PASSWORD_RESET,
                is_used=False,
            ).latest('created_at')
        except (User.DoesNotExist, OTPCode.DoesNotExist):
            return Response(
                {'detail': 'Code OTP invalide.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not otp.is_valid:
            return Response(
                {'detail': 'Code OTP expiré.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        otp.is_used = True
        otp.save()
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({'detail': 'Mot de passe réinitialisé avec succès.'})


# ──────────────────────────────────────────────
# PROFIL UTILISATEUR
# ──────────────────────────────────────────────
class MeView(generics.RetrieveUpdateAPIView):
    """Profil de l'utilisateur connecté."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# ──────────────────────────────────────────────
# ADMIN — GESTION DES UTILISATEURS
# ──────────────────────────────────────────────
class UserViewSet(viewsets.ModelViewSet):
    """CRUD utilisateurs (admin uniquement)."""
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['role', 'is_active', 'is_email_verified']
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'last_login', 'email']

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save(update_fields=['is_active'])
        return Response({'is_active': user.is_active})


# ──────────────────────────────────────────────
# ADMIN — AUDIT LOG
# ──────────────────────────────────────────────
class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """Journal d'audit (lecture seule, admin)."""
    queryset = AuditLog.objects.select_related('user').all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['action', 'target_model', 'user']
    search_fields = ['action', 'details']
    ordering_fields = ['created_at']
