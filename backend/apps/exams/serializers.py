"""Serializers pour l'app exams (éditions, phases, QCM, sessions)."""
from rest_framework import serializers

from .models import (
    Edition, Phase, QuestionCategory, Question, QuestionOption,
    Exam, ExamQuestion, ExamSession, ExamAnswer,
)


# ──────────────────────────────────────────────
# EDITIONS & PHASES
# ──────────────────────────────────────────────
class EditionSerializer(serializers.ModelSerializer):
    phases_count = serializers.IntegerField(source='phases.count', read_only=True)

    class Meta:
        model = Edition
        fields = ['id', 'year', 'title', 'description', 'is_active', 'phases_count', 'created_at']
        read_only_fields = ['id', 'created_at']


class PhaseSerializer(serializers.ModelSerializer):
    edition_title = serializers.CharField(source='edition.title', read_only=True)

    class Meta:
        model = Phase
        fields = [
            'id', 'edition', 'edition_title', 'phase_number',
            'title', 'description', 'start_date', 'end_date', 'status',
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            'edition': {'required': False, 'allow_null': True}
        }

    def create(self, validated_data):
        # Si aucune édition n'est fournie, utiliser l'édition active
        if 'edition' not in validated_data or validated_data.get('edition') is None:
            from datetime import datetime
            active_edition = Edition.objects.filter(is_active=True).first()
            if not active_edition:
                # Créer une édition par défaut
                current_year = datetime.now().year
                active_edition = Edition.objects.create(
                    year=current_year,
                    title=f'OAIB {current_year}',
                    description=f'Edition {current_year} des Olympiades',
                    is_active=True,
                )
            validated_data['edition'] = active_edition
        return super().create(validated_data)


# ──────────────────────────────────────────────
# QUESTIONS
# ──────────────────────────────────────────────
class QuestionCategorySerializer(serializers.ModelSerializer):
    questions_count = serializers.IntegerField(source='questions.count', read_only=True)
    slug = serializers.SlugField(read_only=True)

    class Meta:
        model = QuestionCategory
        fields = ['id', 'name', 'slug', 'questions_count']


class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ['id', 'text', 'is_correct', 'order']


class QuestionOptionPublicSerializer(serializers.ModelSerializer):
    """Version publique — masque is_correct pour les étudiants."""

    class Meta:
        model = QuestionOption
        fields = ['id', 'text', 'order']


class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Question
        fields = [
            'id', 'category', 'category_name', 'text',
            'difficulty', 'points', 'time_limit_seconds',
            'usage_count', 'is_active', 'options',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'usage_count', 'created_at', 'updated_at']


class QuestionCreateSerializer(serializers.ModelSerializer):
    """Création de question avec options imbriquées."""
    options = QuestionOptionSerializer(many=True)

    class Meta:
        model = Question
        fields = [
            'id', 'category', 'text', 'difficulty',
            'points', 'time_limit_seconds', 'is_active', 'options',
        ]

    def validate_options(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("Au moins 2 options sont requises.")
        correct_count = sum(1 for opt in value if opt.get('is_correct'))
        if correct_count != 1:
            raise serializers.ValidationError("Exactement 1 réponse correcte est requise.")
        return value

    def create(self, validated_data):
        options_data = validated_data.pop('options')
        question = Question.objects.create(**validated_data)
        for i, option_data in enumerate(options_data):
            option_data.setdefault('order', i)
            QuestionOption.objects.create(question=question, **option_data)
        return question

    def update(self, instance, validated_data):
        options_data = validated_data.pop('options', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if options_data is not None:
            instance.options.all().delete()
            for i, option_data in enumerate(options_data):
                option_data.setdefault('order', i)
                QuestionOption.objects.create(question=instance, **option_data)
        return instance


# ──────────────────────────────────────────────
# EXAMS
# ──────────────────────────────────────────────
class ExamSerializer(serializers.ModelSerializer):
    phase_title = serializers.CharField(source='phase.title', read_only=True)
    sessions_count = serializers.IntegerField(source='sessions.count', read_only=True)

    class Meta:
        model = Exam
        fields = [
            'id', 'phase', 'phase_title', 'title', 'description',
            'duration_minutes', 'questions_count', 'passing_score',
            'randomize_questions', 'show_correct_answers',
            'start_datetime', 'end_datetime', 'status',
            'sessions_count', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class ExamDetailSerializer(ExamSerializer):
    """Détail d'un examen avec les questions (vue admin)."""
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta(ExamSerializer.Meta):
        fields = ExamSerializer.Meta.fields + ['questions']


# ──────────────────────────────────────────────
# EXAM SESSION (candidat)
# ──────────────────────────────────────────────
class ExamQuestionPublicSerializer(serializers.ModelSerializer):
    """Question vue par le candidat pendant un examen (pas de is_correct)."""
    options = QuestionOptionPublicSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'category_name', 'text', 'difficulty', 'points', 'time_limit_seconds', 'options']


class ExamSessionSerializer(serializers.ModelSerializer):
    exam_title = serializers.CharField(source='exam.title', read_only=True)
    candidate_name = serializers.SerializerMethodField()
    candidate_email = serializers.SerializerMethodField()

    class Meta:
        model = ExamSession
        fields = [
            'id', 'candidate', 'exam', 'exam_title',
            'candidate_name', 'candidate_email',
            'started_at', 'completed_at', 'time_spent_seconds',
            'tab_switch_count', 'status',
            'score', 'max_score', 'percentage', 'rank',
            'category_scores',
        ]
        read_only_fields = fields

    def get_candidate_name(self, obj):
        try:
            return obj.candidate.user.get_full_name() or obj.candidate.user.email
        except Exception:
            return ''

    def get_candidate_email(self, obj):
        try:
            return obj.candidate.user.email
        except Exception:
            return ''


class ExamAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamAnswer
        fields = ['id', 'session', 'question', 'selected_option', 'is_correct', 'is_flagged']
        read_only_fields = ['id', 'is_correct']


class SubmitAnswerSerializer(serializers.Serializer):
    """Pour soumettre une réponse pendant un examen."""
    question_id = serializers.IntegerField()
    option_id = serializers.IntegerField(required=False, allow_null=True)
    is_flagged = serializers.BooleanField(default=False)
