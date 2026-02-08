"""Views pour l'app resources."""
from rest_framework import permissions, viewsets

from apps.permissions import IsAdmin
from .models import Resource
from .serializers import ResourceSerializer, ResourceListSerializer


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    filterset_fields = ['resource_type', 'category', 'phase', 'is_active']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [IsAdmin()]

    def get_serializer_class(self):
        if self.action == 'list':
            return ResourceListSerializer
        return ResourceSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role in ('admin', 'moderator'):
            return Resource.objects.all()
        return Resource.objects.filter(is_active=True)
