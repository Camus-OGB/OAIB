"""
Modèles de données pour l'application Olympiades IA Bénin
Basé sur le schéma PostgreSQL olympiades_ia_schema.sql
"""
import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import MinValueValidator, MaxValueValidator
from phonenumber_field.modelfields import PhoneNumberField


# ============================================================================
# 1. GESTION DES UTILISATEURS ET AUTHENTIFICATION
# ============================================================================

class Role(models.Model):
    """Rôles disponibles dans le système"""
    nom = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'roles'
        verbose_name = 'Rôle'
        verbose_name_plural = 'Rôles'
        managed = False

    def __str__(self):
        return self.nom


class UtilisateurManager(BaseUserManager):
    """Manager personnalisé pour le modèle Utilisateur"""
    
    def create_user(self, email, mot_de_passe=None, **extra_fields):
        if not email:
            raise ValueError("L'email est obligatoire")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(mot_de_passe)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, mot_de_passe=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('email_verifie', True)
        return self.create_user(email, mot_de_passe, **extra_fields)


class Utilisateur(AbstractBaseUser, PermissionsMixin):
    """Modèle utilisateur de base pour l'authentification"""
    
    STATUT_CHOICES = [
        ('actif', 'Actif'),
        ('inactif', 'Inactif'),
        ('suspendu', 'Suspendu'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255, db_column='mot_de_passe_hash')  # Mapping vers mot_de_passe_hash
    role = models.ForeignKey(Role, on_delete=models.PROTECT, db_column='role_id')
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='actif')
    
    # Vérification email
    email_verifie = models.BooleanField(default=False)
    code_verification = models.CharField(max_length=6, blank=True, null=True)
    code_verification_expire_at = models.DateTimeField(blank=True, null=True)
    
    # Authentification à deux facteurs
    deux_facteurs_active = models.BooleanField(default=False)
    secret_2fa = models.CharField(max_length=255, blank=True, null=True)
    
    # Tracking (last_login mappé vers derniere_connexion)
    last_login = models.DateTimeField(blank=True, null=True, db_column='derniere_connexion')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Champs requis pour Django Admin
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UtilisateurManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'utilisateurs'
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        managed = False  # Django ne gérera pas la création/suppression de cette table

    def __str__(self):
        return self.email


class Etablissement(models.Model):
    """Établissements scolaires du Bénin"""
    
    TYPE_CHOICES = [
        ('CEG', 'CEG'),
        ('Lycée', 'Lycée'),
        ('Collège', 'Collège'),
        ('Privé', 'Privé'),
        ('Autre', 'Autre'),
    ]
    
    STATUT_CHOICES = [
        ('actif', 'Actif'),
        ('inactif', 'Inactif'),
    ]

    nom = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    ville = models.CharField(max_length=100, blank=True, null=True)
    departement = models.CharField(max_length=100, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    adresse = models.TextField(blank=True, null=True)
    telephone = PhoneNumberField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='actif')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'etablissements'
        verbose_name = 'Établissement'
        verbose_name_plural = 'Établissements'
        unique_together = ['nom', 'ville']
        managed = False

    def __str__(self):
        return f"{self.nom} - {self.ville}"


class Candidat(models.Model):
    """Profil détaillé des candidats (élèves)"""
    
    GENRE_CHOICES = [
        ('M', 'Masculin'),
        ('F', 'Féminin'),
        ('Autre', 'Autre'),
    ]
    
    NIVEAU_CHOICES = [
        ('3ème', '3ème'),
        ('2nde', '2nde'),
        ('1ère', '1ère'),
        ('Tle', 'Terminale'),
    ]
    
    STATUT_CANDIDATURE_CHOICES = [
        ('inscription', 'Inscription'),
        ('en_attente', 'En attente'),
        ('valide', 'Validé'),
        ('rejete', 'Rejeté'),
        ('selectionne', 'Sélectionné'),
        ('elimine', 'Éliminé'),
    ]

    id = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, primary_key=True)
    
    # Identité
    nom = models.CharField(max_length=100)
    prenoms = models.CharField(max_length=150)
    date_naissance = models.DateField()
    genre = models.CharField(max_length=10, choices=GENRE_CHOICES)
    photo_url = models.URLField(max_length=500, blank=True, null=True)
    telephone = PhoneNumberField(blank=True, null=True)
    adresse = models.TextField(blank=True, null=True)
    
    # Parent/Tuteur
    nom_parent = models.CharField(max_length=100, blank=True, null=True)
    prenoms_parent = models.CharField(max_length=150, blank=True, null=True)
    telephone_parent = PhoneNumberField()
    email_parent = models.EmailField(blank=True, null=True)
    
    # Informations scolaires
    etablissement = models.ForeignKey(Etablissement, on_delete=models.SET_NULL, null=True, blank=True)
    classe = models.CharField(max_length=50)
    niveau_etudes = models.CharField(max_length=50, choices=NIVEAU_CHOICES)
    moyenne_generale = models.DecimalField(
        max_digits=4, decimal_places=2, 
        validators=[MinValueValidator(0), MaxValueValidator(20)],
        blank=True, null=True
    )
    note_mathematiques = models.DecimalField(
        max_digits=4, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(20)],
        blank=True, null=True
    )
    note_sciences = models.DecimalField(
        max_digits=4, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(20)],
        blank=True, null=True
    )
    
    # Documents
    bulletin_1_url = models.URLField(max_length=500, blank=True, null=True)
    bulletin_2_url = models.URLField(max_length=500, blank=True, null=True)
    bulletin_3_url = models.URLField(max_length=500, blank=True, null=True)
    
    # Statut candidature
    statut_candidature = models.CharField(
        max_length=30, 
        choices=STATUT_CANDIDATURE_CHOICES, 
        default='inscription'
    )
    commentaire_admin = models.TextField(blank=True, null=True)
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'candidats'
        verbose_name = 'Candidat'
        verbose_name_plural = 'Candidats'
        managed = False

    def __str__(self):
        return f"{self.nom} {self.prenoms}"


class Administrateur(models.Model):
    """Profil des administrateurs de la plateforme"""
    
    id = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, primary_key=True)
    nom = models.CharField(max_length=100)
    prenoms = models.CharField(max_length=150)
    fonction = models.CharField(max_length=100, blank=True, null=True)
    telephone = PhoneNumberField(blank=True, null=True)
    permissions = models.JSONField(blank=True, null=True)  # Permissions spécifiques
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'administrateurs'
        verbose_name = 'Administrateur'
        verbose_name_plural = 'Administrateurs'
        managed = False

    def __str__(self):
        return f"{self.nom} {self.prenoms}"


# ============================================================================
# 2. GESTION DES ÉDITIONS ET PHASES
# ============================================================================

class Edition(models.Model):
    """Éditions des Olympiades"""
    
    STATUT_CHOICES = [
        ('planifiee', 'Planifiée'),
        ('en_cours', 'En cours'),
        ('terminee', 'Terminée'),
        ('archivee', 'Archivée'),
    ]

    annee = models.IntegerField(unique=True)
    titre = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    pays_hote = models.CharField(max_length=100, blank=True, null=True)
    date_debut = models.DateField(blank=True, null=True)
    date_fin = models.DateField(blank=True, null=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='planifiee')
    nombre_participants_cible = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'editions'
        verbose_name = 'Édition'
        verbose_name_plural = 'Éditions'
        ordering = ['-annee']
        managed = False

    def __str__(self):
        return f"{self.titre} - {self.annee}"


class Phase(models.Model):
    """Phases de sélection par édition"""
    
    STATUT_CHOICES = [
        ('a_venir', 'À venir'),
        ('en_cours', 'En cours'),
        ('terminee', 'Terminée'),
    ]

    edition = models.ForeignKey(Edition, on_delete=models.CASCADE, related_name='phases')
    numero_phase = models.SmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(6)])
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    date_debut = models.DateField()
    date_fin = models.DateField()
    criteres_selection = models.JSONField(blank=True, null=True)
    nombre_selectiones = models.IntegerField(blank=True, null=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='a_venir')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'phases'
        verbose_name = 'Phase'
        verbose_name_plural = 'Phases'
        unique_together = ['edition', 'numero_phase']
        ordering = ['edition', 'numero_phase']
        managed = False

    def __str__(self):
        return f"{self.edition.annee} - Phase {self.numero_phase}: {self.nom}"

