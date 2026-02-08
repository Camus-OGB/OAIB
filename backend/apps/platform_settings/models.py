from django.db import models


class PlatformSettings(models.Model):
    """Parametres globaux de la plateforme (singleton)."""

    # General
    site_name = models.CharField(
        'nom du site', max_length=200,
        default="OAIB - Olympiades d'IA du Benin",
    )
    site_description = models.TextField('description du site', blank=True)
    contact_email = models.EmailField('email de contact', blank=True)
    support_email = models.EmailField('email support', blank=True)

    # Registration
    registration_open = models.BooleanField('inscriptions ouvertes', default=True)
    maintenance_mode = models.BooleanField('mode maintenance', default=False)

    # File upload
    max_file_size_mb = models.PositiveSmallIntegerField(
        'taille max fichier (Mo)', default=10,
    )
    allowed_file_types = models.CharField(
        'types de fichiers autorises', max_length=200, default='pdf,jpg,png',
    )

    # Security
    security_settings = models.JSONField(
        'parametres de securite',
        default=dict,
        blank=True,
        help_text='{"two_factor_required": false, "session_timeout": 30, "max_login_attempts": 5, "password_min_length": 8}',
    )

    updated_at = models.DateTimeField('mis a jour le', auto_now=True)

    class Meta:
        verbose_name = 'parametres plateforme'
        verbose_name_plural = 'parametres plateforme'

    def __str__(self):
        return self.site_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
