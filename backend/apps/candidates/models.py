from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from config.supabase_storage import CandidateDocumentStorage


class CandidateProfile(models.Model):
    """Profil candidat complet - lie 1:1 a un User etudiant."""

    class Gender(models.TextChoices):
        MALE = 'M', 'Masculin'
        FEMALE = 'F', 'Feminin'
        OTHER = 'O', 'Autre'

    class Level(models.TextChoices):
        SECONDE = 'Seconde', 'Seconde'
        PREMIERE = 'Premiere', 'Premiere'
        TERMINALE = 'Terminale', 'Terminale'

    class Region(models.TextChoices):
        LITTORAL = 'Littoral', 'Littoral'
        OUEME = 'Oueme', 'Oueme'
        ATLANTIQUE = 'Atlantique', 'Atlantique'
        BORGOU = 'Borgou', 'Borgou'
        ATACORA = 'Atacora', 'Atacora'
        ZOU = 'Zou', 'Zou'
        COLLINES = 'Collines', 'Collines'
        MONO = 'Mono', 'Mono'
        COUFFO = 'Couffo', 'Couffo'
        PLATEAU = 'Plateau', 'Plateau'
        ALIBORI = 'Alibori', 'Alibori'
        DONGA = 'Donga', 'Donga'

    class Status(models.TextChoices):
        INCOMPLETE = 'incomplete', 'Incomplet'
        PENDING = 'pending', 'En attente'
        APPROVED = 'approved', 'Valide'
        REJECTED = 'rejected', 'Rejete'

    # Link to User
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='candidate_profile', verbose_name='utilisateur',
    )

    # Personal info
    gender = models.CharField('genre', max_length=1, choices=Gender.choices, blank=True)
    address = models.CharField('adresse', max_length=255, blank=True)
    city = models.CharField('ville', max_length=100, blank=True)
    country = models.CharField('pays', max_length=100, default='Benin')

    # School info
    school = models.CharField('etablissement', max_length=200, blank=True)
    level = models.CharField('niveau', max_length=20, choices=Level.choices, blank=True)
    class_name = models.CharField('classe/serie', max_length=50, blank=True)
    average_grade = models.DecimalField(
        'moyenne generale', max_digits=4, decimal_places=2,
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(20)],
    )
    math_grade = models.DecimalField(
        'note maths', max_digits=4, decimal_places=2,
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(20)],
    )
    science_grade = models.DecimalField(
        'note sciences', max_digits=4, decimal_places=2,
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(20)],
    )

    # Location
    region = models.CharField(
        'region', max_length=20, choices=Region.choices, blank=True,
    )

    # Status
    status = models.CharField(
        'statut', max_length=20, choices=Status.choices, default=Status.INCOMPLETE,
    )
    profile_completion = models.PositiveSmallIntegerField(
        'completion du profil (%)', default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    admin_comment = models.TextField('commentaire admin', blank=True)
    registered_at = models.DateTimeField('inscrit le', auto_now_add=True)
    updated_at = models.DateTimeField('mis a jour le', auto_now=True)

    class Meta:
        verbose_name = 'profil candidat'
        verbose_name_plural = 'profils candidats'
        ordering = ['-registered_at']

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.get_status_display()}"

    def calculate_completion(self):
        """Calcule le pourcentage de completion du profil."""
        fields_check = [
            self.gender, self.city, self.school, self.level,
            self.class_name, self.average_grade is not None,
            self.math_grade is not None, self.science_grade is not None,
            self.region,
        ]
        filled = sum(1 for f in fields_check if f)
        total = len(fields_check)

        # Documents
        docs_count = self.documents.count()
        if docs_count > 0:
            filled += 1
        total += 1

        # Tuteur requis uniquement pour les mineurs
        if self.user.birth_date:
            from datetime import date
            age = (date.today() - self.user.birth_date).days // 365
            if age < 18:
                total += 1
                try:
                    tutor = self.tutor_info
                    if tutor and (tutor.first_name or tutor.last_name or tutor.phone):
                        filled += 1
                except TutorInfo.DoesNotExist:
                    pass

        self.profile_completion = int((filled / total) * 100) if total > 0 else 0

        # Mettre à jour le statut automatiquement
        if self.profile_completion >= 80 and self.status == self.Status.INCOMPLETE:
            self.status = self.Status.PENDING

        return self.profile_completion


class TutorInfo(models.Model):
    """Info du tuteur legal (obligatoire si candidat mineur)."""

    class Relationship(models.TextChoices):
        FATHER = 'Pere', 'Pere'
        MOTHER = 'Mere', 'Mere'
        LEGAL_GUARDIAN = 'Tuteur legal', 'Tuteur legal'
        UNCLE = 'Oncle', 'Oncle'
        AUNT = 'Tante', 'Tante'
        OTHER = 'Autre', 'Autre'

    candidate = models.OneToOneField(
        CandidateProfile, on_delete=models.CASCADE,
        related_name='tutor_info', verbose_name='candidat',
    )
    first_name = models.CharField('prenom', max_length=100)
    last_name = models.CharField('nom', max_length=100)
    relationship = models.CharField(
        'lien de parente', max_length=20, choices=Relationship.choices,
    )
    phone = models.CharField('telephone', max_length=20)
    email = models.EmailField('email', blank=True)

    class Meta:
        verbose_name = 'info tuteur'
        verbose_name_plural = 'infos tuteurs'

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.get_relationship_display()})"


class Document(models.Model):
    """Documents uploades par le candidat (bulletins, certificats)."""

    class DocType(models.TextChoices):
        BULLETIN = 'bulletin', 'Bulletin scolaire'
        CERTIFICATE = 'certificate', 'Certificat'
        OTHER = 'other', 'Autre'

    class Status(models.TextChoices):
        PENDING = 'pending', 'En attente'
        VERIFIED = 'verified', 'Verifie'
        REJECTED = 'rejected', 'Rejete'

    candidate = models.ForeignKey(
        CandidateProfile, on_delete=models.CASCADE,
        related_name='documents', verbose_name='candidat',
    )
    name = models.CharField('nom du fichier', max_length=200)
    doc_type = models.CharField(
        'type de document', max_length=20, choices=DocType.choices,
    )
    file = models.FileField(
        'fichier',
        storage=CandidateDocumentStorage,
        upload_to='documents/%Y/%m/'
    )
    size_bytes = models.PositiveIntegerField('taille (octets)', default=0)
    status = models.CharField(
        'statut', max_length=20, choices=Status.choices, default=Status.PENDING,
    )
    uploaded_at = models.DateTimeField('uploade le', auto_now_add=True)

    class Meta:
        verbose_name = 'document'
        verbose_name_plural = 'documents'
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.name} - {self.get_doc_type_display()}"
