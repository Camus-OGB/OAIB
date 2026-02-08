"""Serializers pour l'app resources."""
from rest_framework import serializers

from .models import Resource


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'description', 'resource_type',
            'url', 'file', 'category', 'phase',
            'is_active', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class ResourceListSerializer(serializers.ModelSerializer):
    """Version liste sans le fichier."""

    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'description', 'resource_type',
            'url', 'category', 'phase', 'is_active', 'created_at',
        ]
