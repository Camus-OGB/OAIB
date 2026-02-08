from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OTPCode, AuditLog, PendingRegistration


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_email_verified', 'date_joined')
    list_filter = ('role', 'is_email_verified', 'is_active', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informations personnelles', {'fields': ('first_name', 'last_name', 'phone', 'birth_date', 'avatar')}),
        ('Permissions', {'fields': ('role', 'is_email_verified', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )


@admin.register(OTPCode)
class OTPCodeAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'purpose', 'is_used', 'expires_at', 'created_at')
    list_filter = ('purpose', 'is_used')
    search_fields = ('user__email', 'code')
    readonly_fields = ('created_at',)


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'target_model', 'target_id', 'created_at')
    list_filter = ('action', 'target_model')
    search_fields = ('user__email', 'action')
    readonly_fields = ('user', 'action', 'target_model', 'target_id', 'details', 'ip_address', 'created_at')


@admin.register(PendingRegistration)
class PendingRegistrationAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'otp_code', 'otp_expires_at', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('email', 'first_name', 'last_name')
    readonly_fields = ('password_hash', 'otp_code', 'otp_expires_at', 'created_at')

    def has_add_permission(self, request):
        return False  # Ne pas permettre d'ajouter manuellement
