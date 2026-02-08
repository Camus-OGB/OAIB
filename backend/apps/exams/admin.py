from django.contrib import admin
from .models import (
    Edition, Phase, QuestionCategory, Question,
    QuestionOption, Exam, ExamQuestion, ExamSession, ExamAnswer,
)


@admin.register(Edition)
class EditionAdmin(admin.ModelAdmin):
    list_display = ('title', 'year', 'is_active', 'created_at')
    list_filter = ('is_active',)


class PhaseInline(admin.TabularInline):
    model = Phase
    extra = 0


@admin.register(Phase)
class PhaseAdmin(admin.ModelAdmin):
    list_display = ('title', 'edition', 'phase_number', 'start_date', 'end_date', 'status')
    list_filter = ('status', 'edition')


class QuestionOptionInline(admin.TabularInline):
    model = QuestionOption
    extra = 4


@admin.register(QuestionCategory)
class QuestionCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text_short', 'category', 'difficulty', 'points', 'usage_count', 'is_active')
    list_filter = ('difficulty', 'category', 'is_active')
    search_fields = ('text',)
    inlines = [QuestionOptionInline]

    def text_short(self, obj):
        return obj.text[:80]
    text_short.short_description = 'Enonce'


class ExamQuestionInline(admin.TabularInline):
    model = ExamQuestion
    extra = 0


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('title', 'phase', 'duration_minutes', 'questions_count', 'status')
    list_filter = ('status', 'phase__edition')
    inlines = [ExamQuestionInline]


@admin.register(ExamSession)
class ExamSessionAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'exam', 'status', 'score', 'max_score', 'percentage', 'tab_switch_count')
    list_filter = ('status', 'exam')
    search_fields = ('candidate__user__email',)
    readonly_fields = ('started_at', 'completed_at')


@admin.register(ExamAnswer)
class ExamAnswerAdmin(admin.ModelAdmin):
    list_display = ('session', 'question', 'is_correct', 'is_flagged')
    list_filter = ('is_correct', 'is_flagged')
