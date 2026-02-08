"""
Permissions partagées pour l'API OAIB.
"""
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Accès réservé aux administrateurs."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('admin', 'moderator')
        )


class IsStudent(permissions.BasePermission):
    """Accès réservé aux étudiants."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'student'
        )


class IsOwner(permissions.BasePermission):
    """L'utilisateur ne peut accéder qu'à ses propres ressources."""

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'candidate'):
            return obj.candidate.user == request.user
        return obj == request.user


class IsOwnerOrAdmin(permissions.BasePermission):
    """Propriétaire ou administrateur."""

    def has_object_permission(self, request, view, obj):
        if request.user.role in ('admin', 'moderator'):
            return True
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'candidate'):
            return obj.candidate.user == request.user
        return obj == request.user


class ReadOnly(permissions.BasePermission):
    """Accès en lecture seule."""

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS
