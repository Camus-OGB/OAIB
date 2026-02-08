"""URL configuration for OAIB project."""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    # API v1
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/candidates/', include('apps.candidates.urls')),
    path('api/v1/exams/', include('apps.exams.urls')),
    path('api/v1/cms/', include('apps.cms.urls')),
    path('api/v1/settings/', include('apps.platform_settings.urls')),
    path('api/v1/resources/', include('apps.resources.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),

    # API documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
