from django.contrib import admin
from .models import CandidateProfile, TutorInfo, Document


class TutorInfoInline(admin.StackedInline):
    model = TutorInfo
    extra = 0


class DocumentInline(admin.TabularInline):
    model = Document
    extra = 0
    readonly_fields = ('uploaded_at',)


@admin.register(CandidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'school', 'level', 'region', 'status', 'profile_completion', 'registered_at')
    list_filter = ('status', 'region', 'level', 'gender')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'school')
    readonly_fields = ('registered_at', 'updated_at')
    inlines = [TutorInfoInline, DocumentInline]


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('name', 'candidate', 'doc_type', 'status', 'uploaded_at')
    list_filter = ('doc_type', 'status')
    search_fields = ('name', 'candidate__user__email')
