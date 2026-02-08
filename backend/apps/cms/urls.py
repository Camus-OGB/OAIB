"""URL patterns pour l'app cms."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'pages', views.PageViewSet, basename='pages')
router.register(r'news', views.NewsArticleViewSet, basename='news')
router.register(r'faq', views.FAQItemViewSet, basename='faq')
router.register(r'media', views.MediaViewSet, basename='media')
router.register(r'partners', views.PartnerViewSet, basename='partners')
router.register(r'testimonials', views.TestimonialViewSet, basename='testimonials')

urlpatterns = [
    path('', include(router.urls)),
]
