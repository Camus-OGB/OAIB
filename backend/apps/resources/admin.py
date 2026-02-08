from django.contrib import admin
from .models import Resource


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'resource_type', 'category', 'phase', 'is_active', 'created_at')
    list_filter = ('resource_type', 'category', 'phase', 'is_active')
    search_fields = ('title', 'description')
