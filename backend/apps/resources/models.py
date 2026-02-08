from django.db import models


class Resource(models.Model):
    """Ressources de preparation pour les candidats."""

    class ResourceType(models.TextChoices):
        PDF = 'pdf', 'PDF'
        VIDEO = 'video', 'Video'
        LINK = 'link', 'Lien'
        ARTICLE = 'article', 'Article'
        EXERCISE = 'exercise', 'Exercice'

    title = models.CharField('titre', max_length=200)
    description = models.TextField('description', blank=True)
    resource_type = models.CharField(
        'type', max_length=20, choices=ResourceType.choices,
    )
    url = models.URLField('URL', blank=True)
    file = models.FileField('fichier', upload_to='resources/', blank=True)
    category = models.CharField('categorie', max_length=100, blank=True)
    phase = models.PositiveSmallIntegerField(
        'phase associee', null=True, blank=True,
        help_text='Phase de la competition (1-6)',
    )
    is_active = models.BooleanField('actif', default=True)
    created_at = models.DateTimeField('cree le', auto_now_add=True)

    class Meta:
        verbose_name = 'ressource'
        verbose_name_plural = 'ressources'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.get_resource_type_display()})"
