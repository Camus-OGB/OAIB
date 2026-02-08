"""URL patterns pour l'app accounts."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='users')
router.register(r'audit-logs', views.AuditLogViewSet, basename='audit-logs')

urlpatterns = [
    # Auth
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),

    # OTP
    path('otp/request/', views.RequestOTPView.as_view(), name='otp-request'),
    path('otp/verify/', views.VerifyOTPView.as_view(), name='otp-verify'),
    path('password/reset/', views.ResetPasswordView.as_view(), name='password-reset'),

    # Profil
    path('me/', views.MeView.as_view(), name='me'),

    # Admin routes (router)
    path('', include(router.urls)),
]
