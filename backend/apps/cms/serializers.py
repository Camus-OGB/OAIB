"""Serializers pour l'app cms (pages, articles, FAQ, médias, partenaires)."""
from rest_framework import serializers

from .models import Page, NewsArticle, FAQItem, Media, Partner, Testimonial


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'content', 'status', 'last_modified', 'created_at']
        read_only_fields = ['id', 'last_modified', 'created_at']


class NewsArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = [
            'id', 'title', 'excerpt', 'content', 'image',
            'status', 'author', 'published_at', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class NewsArticleListSerializer(serializers.ModelSerializer):
    """Version liste sans le contenu complet."""

    class Meta:
        model = NewsArticle
        fields = ['id', 'title', 'excerpt', 'image', 'author', 'published_at', 'status']


class FAQItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQItem
        fields = ['id', 'question', 'answer', 'category', 'display_order', 'is_active']


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'name', 'media_type', 'file', 'size_bytes', 'uploaded_at']
        read_only_fields = ['id', 'size_bytes', 'uploaded_at']

    def create(self, validated_data):
        file = validated_data.get('file')
        if file:
            validated_data['size_bytes'] = file.size
        return super().create(validated_data)


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ['id', 'name', 'logo', 'website', 'tier', 'display_order', 'is_active']


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'name', 'role', 'quote', 'image', 'video_url', 'display_order', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
