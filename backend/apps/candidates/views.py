"""Views pour l'app candidates."""
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes as perm_dec
from rest_framework.response import Response

from apps.permissions import IsAdmin, IsOwner, IsOwnerOrAdmin, IsStudent
from .models import CandidateProfile, TutorInfo, Document
from .serializers import (
    CandidateProfileSerializer,
    CandidateProfileUpdateSerializer,
    AdminCandidateSerializer,
    TutorInfoSerializer,
    DocumentSerializer,
)


# ──────────────────────────────────────────────
# PUBLIC — Compteur d'inscrits (vitrine)
# ──────────────────────────────────────────────
@api_view(['GET'])
@perm_dec([permissions.AllowAny])
def public_candidate_count(request):
    """Retourne le nombre total de candidats inscrits (endpoint public)."""
    total = CandidateProfile.objects.count()
    approved = CandidateProfile.objects.filter(status='approved').count()
    return Response({'total': total, 'approved': approved})


# ──────────────────────────────────────────────
# CANDIDAT — SON PROPRE PROFIL
# ──────────────────────────────────────────────
class MyProfileView(generics.RetrieveUpdateAPIView):
    """Le candidat consulte / met à jour son profil."""
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return CandidateProfileUpdateSerializer
        return CandidateProfileSerializer

    def get_object(self):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        return profile


class MyTutorInfoView(generics.RetrieveUpdateAPIView, generics.CreateAPIView):
    """Gestion du tuteur légal du candidat."""
    serializer_class = TutorInfoSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_object(self):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        tutor, _ = TutorInfo.objects.get_or_create(candidate=profile)
        return tutor

    def perform_create(self, serializer):
        profile = CandidateProfile.objects.get(user=self.request.user)
        serializer.save(candidate=profile)


class MyDocumentsView(generics.ListCreateAPIView):
    """Le candidat uploade et voit ses documents."""
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    pagination_class = None  # Pas de pagination — un candidat a peu de documents

    def get_queryset(self):
        profile = CandidateProfile.objects.get(user=self.request.user)
        return Document.objects.filter(candidate=profile)

    def perform_create(self, serializer):
        profile = CandidateProfile.objects.get(user=self.request.user)
        serializer.save(candidate=profile)


class MyDocumentDeleteView(generics.DestroyAPIView):
    """Le candidat supprime un de ses documents."""
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        profile = CandidateProfile.objects.get(user=self.request.user)
        return Document.objects.filter(candidate=profile)


# ──────────────────────────────────────────────
# ADMIN — GESTION DES CANDIDATURES
# ──────────────────────────────────────────────
class CandidateViewSet(viewsets.ModelViewSet):
    """CRUD / gestion des candidatures (admin)."""
    queryset = CandidateProfile.objects.select_related('user', 'tutor_info').prefetch_related('documents').all()
    serializer_class = AdminCandidateSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['status', 'level', 'region', 'gender']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'school']
    ordering_fields = ['registered_at', 'profile_completion', 'status']

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Valider une candidature."""
        candidate = self.get_object()
        candidate.status = CandidateProfile.Status.APPROVED
        candidate.admin_comment = request.data.get('admin_comment', '') or request.data.get('comment', '')
        candidate.save(update_fields=['status', 'admin_comment'])
        return Response(AdminCandidateSerializer(candidate).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Rejeter une candidature."""
        candidate = self.get_object()
        candidate.status = CandidateProfile.Status.REJECTED
        candidate.admin_comment = request.data.get('admin_comment', '') or request.data.get('comment', '')
        candidate.save(update_fields=['status', 'admin_comment'])
        return Response(AdminCandidateSerializer(candidate).data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques des candidatures."""
        qs = self.get_queryset()
        return Response({
            'total': qs.count(),
            'incomplete': qs.filter(status='incomplete').count(),
            'pending': qs.filter(status='pending').count(),
            'approved': qs.filter(status='approved').count(),
            'rejected': qs.filter(status='rejected').count(),
        })
