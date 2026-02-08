"""URL patterns pour l'app platform_settings."""
from django.urls import path

from . import views

urlpatterns = [
    path('public/', views.PlatformSettingsPublicView.as_view(), name='settings-public'),
    path('admin/', views.PlatformSettingsAdminView.as_view(), name='settings-admin'),
]
