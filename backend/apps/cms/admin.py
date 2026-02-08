from django.contrib import admin
from .models import Page, NewsArticle, FAQItem, Media, Partner, Testimonial


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'last_modified')
    list_filter = ('status',)
    prepopulated_fields = {'slug': ('title',)}


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'author', 'published_at')
    list_filter = ('status',)
    search_fields = ('title', 'content')


@admin.register(FAQItem)
class FAQItemAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'display_order', 'is_active')
    list_filter = ('category', 'is_active')
    list_editable = ('display_order',)


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ('name', 'media_type', 'size_bytes', 'uploaded_at')
    list_filter = ('media_type',)


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ('name', 'tier', 'display_order', 'is_active')
    list_filter = ('tier', 'is_active')
    list_editable = ('display_order',)


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'display_order', 'is_active', 'created_at')
    list_filter = ('is_active',)
    list_editable = ('display_order',)
    search_fields = ('name', 'role', 'quote')
