"""Serializers pour l'app platform_settings."""
from rest_framework import serializers

from .models import PlatformSettings


class PlatformSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformSettings
        fields = [
            'site_name', 'site_description',
            'contact_email', 'support_email',
            'registration_open', 'maintenance_mode',
            'max_file_size_mb', 'allowed_file_types',
            'security_settings', 'updated_at',
        ]
        read_only_fields = ['updated_at']


class PlatformSettingsPublicSerializer(serializers.ModelSerializer):
    """Version publique — uniquement les infos non-sensibles."""

    class Meta:
        model = PlatformSettings
        fields = [
            'site_name', 'site_description',
            'contact_email', 'registration_open',
            'maintenance_mode',
        ]
