"""Views pour l'app platform_settings."""
from rest_framework import generics, permissions
from rest_framework.response import Response

from apps.permissions import IsAdmin
from .models import PlatformSettings
from .serializers import PlatformSettingsSerializer, PlatformSettingsPublicSerializer


class PlatformSettingsPublicView(generics.RetrieveAPIView):
    """Paramètres publics de la plateforme (accessible à tous)."""
    serializer_class = PlatformSettingsPublicSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        return PlatformSettings.get_settings()


class PlatformSettingsAdminView(generics.RetrieveUpdateAPIView):
    """Paramètres complets de la plateforme (admin uniquement)."""
    serializer_class = PlatformSettingsSerializer
    permission_classes = [IsAdmin]

    def get_object(self):
        return PlatformSettings.get_settings()
