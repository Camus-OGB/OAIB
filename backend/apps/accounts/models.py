import uuid
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    """Custom user manager using email as unique identifier."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'adresse email est obligatoire")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.ADMIN)
        extra_fields.setdefault('is_email_verified', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Custom user model - email-based authentication."""

    class Role(models.TextChoices):
        STUDENT = 'student', 'Etudiant'
        ADMIN = 'admin', 'Administrateur'
        MODERATOR = 'moderator', 'Moderateur'

    # Remove username, use email instead
    username = None
    email = models.EmailField('adresse email', unique=True)
    phone = models.CharField('telephone', max_length=20, blank=True)
    birth_date = models.DateField('date de naissance', null=True, blank=True)
    role = models.CharField(
        'role', max_length=20,
        choices=Role.choices, default=Role.STUDENT,
    )
    avatar = models.ImageField('avatar', upload_to='avatars/', blank=True)
    is_email_verified = models.BooleanField('email verifie', default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    class Meta:
        verbose_name = 'utilisateur'
        verbose_name_plural = 'utilisateurs'
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    @property
    def is_admin(self):
        return self.role in (self.Role.ADMIN, self.Role.MODERATOR)

    @property
    def is_student(self):
        return self.role == self.Role.STUDENT


class OTPCode(models.Model):
    """One-Time Password for email verification and password reset."""

    class Purpose(models.TextChoices):
        EMAIL_VERIFY = 'email_verify', 'Verification email'
        PASSWORD_RESET = 'password_reset', 'Reinitialisation mot de passe'

    user = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='otp_codes', verbose_name='utilisateur',
    )
    code = models.CharField('code OTP', max_length=10)
    purpose = models.CharField(
        'objectif', max_length=20, choices=Purpose.choices,
    )
    expires_at = models.DateTimeField("date d'expiration")
    is_used = models.BooleanField('utilise', default=False)
    created_at = models.DateTimeField('cree le', auto_now_add=True)

    class Meta:
        verbose_name = 'code OTP'
        verbose_name_plural = 'codes OTP'
        ordering = ['-created_at']

    def __str__(self):
        return f"OTP {self.code} pour {self.user.email} ({self.purpose})"

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    @property
    def is_valid(self):
        return not self.is_used and not self.is_expired


class AuditLog(models.Model):
    """Tracks admin actions for traceability."""

    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='audit_logs', verbose_name='utilisateur',
    )
    action = models.CharField('action', max_length=100)
    target_model = models.CharField('modele cible', max_length=100, blank=True)
    target_id = models.PositiveBigIntegerField('ID cible', null=True, blank=True)
    details = models.JSONField('details', default=dict, blank=True)
    ip_address = models.GenericIPAddressField('adresse IP', null=True, blank=True)
    created_at = models.DateTimeField('cree le', auto_now_add=True)

    class Meta:
        verbose_name = "journal d'audit"
        verbose_name_plural = "journaux d'audit"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.action} - {self.created_at:%d/%m/%Y %H:%M}"


class PendingRegistration(models.Model):
    """
    Stocke temporairement les données d'inscription en attendant la vérification OTP.
    L'utilisateur n'est créé qu'après vérification du code OTP.
    """
    email = models.EmailField('adresse email', unique=True)
    password_hash = models.CharField('mot de passe (hash)', max_length=255)
    first_name = models.CharField('prénom', max_length=150)
    last_name = models.CharField('nom', max_length=150)
    phone = models.CharField('téléphone', max_length=20)
    birth_date = models.DateField('date de naissance')
    otp_code = models.CharField('code OTP', max_length=10)
    otp_expires_at = models.DateTimeField("expiration OTP")
    created_at = models.DateTimeField('créé le', auto_now_add=True)

    class Meta:
        verbose_name = 'inscription en attente'
        verbose_name_plural = 'inscriptions en attente'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} - En attente de vérification"

    @property
    def is_otp_expired(self):
        return timezone.now() > self.otp_expires_at

    @property
    def is_otp_valid(self):
        return not self.is_otp_expired
