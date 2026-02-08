"""URL patterns pour l'app candidates."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'admin', views.CandidateViewSet, basename='candidates-admin')

urlpatterns = [
    # Public — compteur d'inscrits (vitrine)
    path('public/count/', views.public_candidate_count, name='public-candidate-count'),

    # Candidat — son propre profil
    path('profile/', views.MyProfileView.as_view(), name='my-profile'),
    path('profile/tutor/', views.MyTutorInfoView.as_view(), name='my-tutor'),
    path('profile/documents/', views.MyDocumentsView.as_view(), name='my-documents'),
    path('profile/documents/<int:pk>/', views.MyDocumentDeleteView.as_view(), name='my-document-delete'),

    # Admin routes (router)
    path('', include(router.urls)),
]
