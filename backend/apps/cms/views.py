"""Views pour l'app cms (pages, articles, FAQ, médias, partenaires)."""
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.permissions import IsAdmin, ReadOnly
from .models import Page, NewsArticle, FAQItem, Media, Partner, Testimonial
from .serializers import (
    PageSerializer, NewsArticleSerializer, NewsArticleListSerializer,
    FAQItemSerializer, MediaSerializer, PartnerSerializer, TestimonialSerializer,
)


class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [IsAdmin()]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role in ('admin', 'moderator'):
            return Page.objects.all()
        return Page.objects.filter(status='published')


class NewsArticleViewSet(viewsets.ModelViewSet):
    queryset = NewsArticle.objects.all()

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [IsAdmin()]

    def get_serializer_class(self):
        if self.action == 'list':
            return NewsArticleListSerializer
        return NewsArticleSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role in ('admin', 'moderator'):
            return NewsArticle.objects.all()
        return NewsArticle.objects.filter(status='published')


class FAQItemViewSet(viewsets.ModelViewSet):
    queryset = FAQItem.objects.all()
    serializer_class = FAQItemSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [IsAdmin()]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role in ('admin', 'moderator'):
            return FAQItem.objects.all()
        return FAQItem.objects.filter(is_active=True)


class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['media_type']
    search_fields = ['name']


class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [IsAdmin()]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role in ('admin', 'moderator'):
            return Partner.objects.all()
        return Partner.objects.filter(is_active=True)


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [IsAdmin()]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role in ('admin', 'moderator'):
            return Testimonial.objects.all()
        return Testimonial.objects.filter(is_active=True)
