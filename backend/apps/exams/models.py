from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify


class Edition(models.Model):
    """Une edition annuelle des Olympiades (ex: 2026)."""

    year = models.PositiveSmallIntegerField('annee', unique=True)
    title = models.CharField('titre', max_length=200)
    description = models.TextField('description', blank=True)
    is_active = models.BooleanField('edition active', default=False)
    created_at = models.DateTimeField('cree le', auto_now_add=True)

    class Meta:
        verbose_name = 'edition'
        verbose_name_plural = 'editions'
        ordering = ['-year']

    def __str__(self):
        return f"{self.title} ({self.year})"

    def save(self, *args, **kwargs):
        if self.is_active:
            Edition.objects.filter(is_active=True).exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)


class Phase(models.Model):
    """Phase de selection au sein d'une edition (6 phases)."""

    class Status(models.TextChoices):
        UPCOMING = 'upcoming', 'A venir'
        ACTIVE = 'active', 'En cours'
        COMPLETED = 'completed', 'Terminee'

    edition = models.ForeignKey(
        Edition, on_delete=models.CASCADE,
        related_name='phases', verbose_name='edition',
        null=True, blank=True,
    )
    phase_number = models.PositiveSmallIntegerField('numero de phase')
    title = models.CharField('titre', max_length=200)
    description = models.TextField('description', blank=True)
    start_date = models.DateField('date de debut')
    end_date = models.DateField('date de fin')
    status = models.CharField(
        'statut', max_length=20, choices=Status.choices, default=Status.UPCOMING,
    )

    def save(self, *args, **kwargs):
        # Auto-assigner l'édition active par défaut si non spécifiée
        if not self.edition_id:
            self.edition = Edition.objects.filter(is_active=True).first()
            if not self.edition:
                # Créer une édition par défaut si aucune n'existe
                from datetime import datetime
                current_year = datetime.now().year
                self.edition = Edition.objects.create(
                    year=current_year,
                    title=f'OAIB {current_year}',
                    description=f'Edition {current_year} des Olympiades',
                    is_active=True,
                )
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'phase'
        verbose_name_plural = 'phases'
        ordering = ['edition', 'phase_number']
        unique_together = ['edition', 'phase_number']

    def __str__(self):
        return f"Phase {self.phase_number} - {self.title}"


class QuestionCategory(models.Model):
    """Categories de questions QCM."""

    name = models.CharField('nom', max_length=100, unique=True)
    slug = models.SlugField('slug', unique=True, blank=True)

    class Meta:
        verbose_name = 'categorie de question'
        verbose_name_plural = 'categories de questions'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            # Assurer l'unicité du slug
            base_slug = self.slug
            counter = 1
            while QuestionCategory.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f'{base_slug}-{counter}'
                counter += 1
        super().save(*args, **kwargs)


class Question(models.Model):
    """Question de la banque QCM."""

    class Difficulty(models.TextChoices):
        EASY = 'easy', 'Facile'
        MEDIUM = 'medium', 'Moyen'
        HARD = 'hard', 'Difficile'

    category = models.ForeignKey(
        QuestionCategory, on_delete=models.SET_NULL, null=True,
        related_name='questions', verbose_name='categorie',
    )
    text = models.TextField('enonce')
    difficulty = models.CharField(
        'difficulte', max_length=10, choices=Difficulty.choices, default=Difficulty.MEDIUM,
    )
    points = models.PositiveSmallIntegerField('points', default=1)
    time_limit_seconds = models.PositiveSmallIntegerField(
        'temps limite (secondes)', default=60,
    )
    usage_count = models.PositiveIntegerField("nombre d'utilisations", default=0)
    is_active = models.BooleanField('actif', default=True)
    created_at = models.DateTimeField('cree le', auto_now_add=True)
    updated_at = models.DateTimeField('mis a jour le', auto_now=True)

    class Meta:
        verbose_name = 'question'
        verbose_name_plural = 'questions'
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.get_difficulty_display()}] {self.text[:80]}..."


class QuestionOption(models.Model):
    """Option de reponse pour une question QCM."""

    question = models.ForeignKey(
        Question, on_delete=models.CASCADE,
        related_name='options', verbose_name='question',
    )
    text = models.CharField('texte', max_length=500)
    is_correct = models.BooleanField('reponse correcte', default=False)
    order = models.PositiveSmallIntegerField('ordre', default=0)

    class Meta:
        verbose_name = 'option de reponse'
        verbose_name_plural = 'options de reponse'
        ordering = ['question', 'order']

    def __str__(self):
        mark = 'V' if self.is_correct else 'X'
        return f"{mark} {self.text[:60]}"


class Exam(models.Model):
    """Examen / epreuve liee a une phase."""

    class Status(models.TextChoices):
        UPCOMING = 'upcoming', 'A venir'
        ACTIVE = 'active', 'En cours'
        COMPLETED = 'completed', 'Termine'

    phase = models.ForeignKey(
        Phase, on_delete=models.CASCADE,
        related_name='exams', verbose_name='phase',
    )
    title = models.CharField('titre', max_length=200)
    description = models.TextField('description', blank=True)
    duration_minutes = models.PositiveSmallIntegerField('duree (minutes)', default=60)
    questions_count = models.PositiveSmallIntegerField('nombre de questions', default=20)
    passing_score = models.PositiveSmallIntegerField(
        'score de passage (%)', default=60,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    randomize_questions = models.BooleanField('questions aleatoires', default=True)
    show_correct_answers = models.BooleanField('afficher les reponses', default=False)
    start_datetime = models.DateTimeField('debut', null=True, blank=True)
    end_datetime = models.DateTimeField('fin', null=True, blank=True)
    status = models.CharField(
        'statut', max_length=20, choices=Status.choices, default=Status.UPCOMING,
    )
    questions = models.ManyToManyField(
        Question, through='ExamQuestion',
        related_name='exams', verbose_name='questions', blank=True,
    )
    created_at = models.DateTimeField('cree le', auto_now_add=True)

    class Meta:
        verbose_name = 'examen'
        verbose_name_plural = 'examens'
        ordering = ['-start_datetime']

    def __str__(self):
        return self.title


class ExamQuestion(models.Model):
    """Liaison question - examen avec ordre."""

    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    order = models.PositiveSmallIntegerField('ordre', default=0)

    class Meta:
        verbose_name = "question d'examen"
        verbose_name_plural = "questions d'examen"
        ordering = ['exam', 'order']
        unique_together = ['exam', 'question']

    def __str__(self):
        return f"{self.exam.title} - Q{self.order}"


class ExamSession(models.Model):
    """Session d'examen d'un candidat."""

    class Status(models.TextChoices):
        NOT_STARTED = 'not_started', 'Non commence'
        IN_PROGRESS = 'in_progress', 'En cours'
        COMPLETED = 'completed', 'Termine'
        EVALUATED = 'evaluated', 'Evalue'

    candidate = models.ForeignKey(
        'candidates.CandidateProfile', on_delete=models.CASCADE,
        related_name='exam_sessions', verbose_name='candidat',
    )
    exam = models.ForeignKey(
        Exam, on_delete=models.CASCADE,
        related_name='sessions', verbose_name='examen',
    )
    started_at = models.DateTimeField('commence le', null=True, blank=True)
    completed_at = models.DateTimeField('termine le', null=True, blank=True)
    time_spent_seconds = models.PositiveIntegerField('temps passe (secondes)', default=0)
    tab_switch_count = models.PositiveSmallIntegerField(
        'changements onglet', default=0,
    )
    status = models.CharField(
        'statut', max_length=20, choices=Status.choices, default=Status.NOT_STARTED,
    )
    score = models.PositiveSmallIntegerField('score', default=0)
    max_score = models.PositiveSmallIntegerField('score max', default=0)
    percentage = models.DecimalField(
        'pourcentage', max_digits=5, decimal_places=2, default=0,
    )
    rank = models.PositiveIntegerField('classement', null=True, blank=True)
    category_scores = models.JSONField(
        'scores par categorie', default=list, blank=True,
    )

    class Meta:
        verbose_name = "session d'examen"
        verbose_name_plural = "sessions d'examen"
        ordering = ['-started_at']
        unique_together = ['candidate', 'exam']

    def __str__(self):
        return f"{self.candidate} - {self.exam.title}"


class ExamAnswer(models.Model):
    """Reponse d'un candidat a une question dans un examen."""

    session = models.ForeignKey(
        ExamSession, on_delete=models.CASCADE,
        related_name='answers', verbose_name='session',
    )
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, verbose_name='question',
    )
    selected_option = models.ForeignKey(
        QuestionOption, on_delete=models.SET_NULL,
        null=True, blank=True, verbose_name='option choisie',
    )
    is_correct = models.BooleanField('reponse correcte', default=False)
    is_flagged = models.BooleanField('marquee', default=False)

    class Meta:
        verbose_name = 'reponse examen'
        verbose_name_plural = 'reponses examen'
        unique_together = ['session', 'question']

    def __str__(self):
        mark = 'V' if self.is_correct else 'X'
        return f"{mark} Session #{self.session_id} - Q#{self.question_id}"
