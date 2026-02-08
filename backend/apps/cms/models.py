from django.db import models


class Page(models.Model):
    """Pages editables du site (A propos, etc.)."""

    class Status(models.TextChoices):
        PUBLISHED = 'published', 'Publie'
        DRAFT = 'draft', 'Brouillon'

    title = models.CharField('titre', max_length=200)
    slug = models.SlugField('slug', unique=True)
    content = models.TextField('contenu')
    status = models.CharField(
        'statut', max_length=20, choices=Status.choices, default=Status.DRAFT,
    )
    last_modified = models.DateTimeField('derniere modification', auto_now=True)
    created_at = models.DateTimeField('cree le', auto_now_add=True)

    class Meta:
        verbose_name = 'page'
        verbose_name_plural = 'pages'
        ordering = ['title']

    def __str__(self):
        return self.title


class NewsArticle(models.Model):
    """Articles d'actualite."""

    class Status(models.TextChoices):
        PUBLISHED = 'published', 'Publie'
        DRAFT = 'draft', 'Brouillon'

    title = models.CharField('titre', max_length=200)
    excerpt = models.CharField('extrait', max_length=500, blank=True)
    content = models.TextField('contenu')
    image = models.ImageField('image', upload_to='news/', blank=True)
    status = models.CharField(
        'statut', max_length=20, choices=Status.choices, default=Status.DRAFT,
    )
    author = models.CharField('auteur', max_length=100, blank=True)
    published_at = models.DateTimeField('publie le', null=True, blank=True)
    created_at = models.DateTimeField('cree le', auto_now_add=True)

    class Meta:
        verbose_name = 'article'
        verbose_name_plural = 'articles'
        ordering = ['-published_at']

    def __str__(self):
        return self.title


class FAQItem(models.Model):
    """Questions frequentes."""

    question = models.CharField('question', max_length=500)
    answer = models.TextField('reponse')
    category = models.CharField('categorie', max_length=100, blank=True)
    display_order = models.PositiveSmallIntegerField("ordre d'affichage", default=0)
    is_active = models.BooleanField('actif', default=True)

    class Meta:
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'
        ordering = ['display_order']

    def __str__(self):
        return self.question[:80]


class Media(models.Model):
    """Mediatheque (images, videos, documents)."""

    class MediaType(models.TextChoices):
        IMAGE = 'image', 'Image'
        VIDEO = 'video', 'Video'
        DOCUMENT = 'document', 'Document'

    name = models.CharField('nom', max_length=200)
    media_type = models.CharField(
        'type de media', max_length=20, choices=MediaType.choices,
    )
    file = models.FileField('fichier', upload_to='media_uploads/%Y/%m/')
    size_bytes = models.PositiveIntegerField('taille (octets)', default=0)
    uploaded_at = models.DateTimeField('uploade le', auto_now_add=True)

    class Meta:
        verbose_name = 'media'
        verbose_name_plural = 'medias'
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.name


class Partner(models.Model):
    """Partenaires / sponsors."""

    class Tier(models.TextChoices):
        GOLD = 'gold', 'Or'
        SILVER = 'silver', 'Argent'
        BRONZE = 'bronze', 'Bronze'

    name = models.CharField('nom', max_length=200)
    logo = models.ImageField('logo', upload_to='partners/')
    website = models.URLField('site web', blank=True)
    tier = models.CharField(
        'niveau', max_length=10, choices=Tier.choices, default=Tier.BRONZE,
    )
    display_order = models.PositiveSmallIntegerField("ordre d'affichage", default=0)
    is_active = models.BooleanField('actif', default=True)

    class Meta:
        verbose_name = 'partenaire'
        verbose_name_plural = 'partenaires'
        ordering = ['display_order']

    def __str__(self):
        return f"{self.name} ({self.get_tier_display()})"


class Testimonial(models.Model):
    """Témoignages des anciens participants."""

    name = models.CharField('nom', max_length=200)
    role = models.CharField('rôle/titre', max_length=300)
    quote = models.TextField('témoignage')
    image = models.ImageField('photo', upload_to='testimonials/', blank=True)
    video_url = models.URLField('URL vidéo (YouTube/Vimeo)', blank=True, help_text='Lien vers une vidéo YouTube ou Vimeo (optionnel)')
    display_order = models.PositiveSmallIntegerField("ordre d'affichage", default=0)
    is_active = models.BooleanField('actif', default=True)
    created_at = models.DateTimeField('créé le', auto_now_add=True)

    class Meta:
        verbose_name = 'témoignage'
        verbose_name_plural = 'témoignages'
        ordering = ['display_order']

    def __str__(self):
        return f"{self.name} - {self.role}"
