from django.conf import settings
from django.db import models


class Notification(models.Model):
    """Notifications envoyees aux utilisateurs."""

    class NotifType(models.TextChoices):
        INFO = 'info', 'Information'
        SUCCESS = 'success', 'Succes'
        WARNING = 'warning', 'Avertissement'
        ERROR = 'error', 'Erreur'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='notifications', verbose_name='utilisateur',
    )
    title = models.CharField('titre', max_length=200)
    message = models.TextField('message')
    notif_type = models.CharField(
        'type', max_length=20, choices=NotifType.choices, default=NotifType.INFO,
    )
    is_read = models.BooleanField('lu', default=False)
    created_at = models.DateTimeField('cree le', auto_now_add=True)

    class Meta:
        verbose_name = 'notification'
        verbose_name_plural = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.get_notif_type_display()}] {self.title}"
