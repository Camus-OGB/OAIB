"""
Django settings for OAIB (Olympiades d'Intelligence Artificielle du Bénin).
"""
import os
from pathlib import Path
from datetime import timedelta
from decouple import Config, RepositoryEnv, Csv
import dj_database_url

# ──────────────────────────────────────────────
# PATHS
# ──────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

# Chercher le fichier .env à la racine du projet (parent du dossier backend)
PROJECT_ROOT = BASE_DIR.parent
env_path = PROJECT_ROOT / '.env'
if env_path.exists():
    config = Config(RepositoryEnv(str(env_path)))
else:
    from decouple import config

# ──────────────────────────────────────────────
# SECURITY
# ──────────────────────────────────────────────
SECRET_KEY = config('SECRET_KEY', default='django-insecure-81j5yt50(jj@=1v!o0$g_f0=q#pdj)1-4&(6cz#z9_7b3g%-&i')
DEBUG = config('DEBUG', default=True, cast=bool)

# ALLOWED_HOSTS — Configuration pour production et développement
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())

# En production, ajouter automatiquement les domaines de déploiement courants
if not DEBUG:
    ALLOWED_HOSTS.extend([
        '.onrender.com',      # Render
        '.railway.app',       # Railway
        '.vercel.app',        # Vercel
        '.herokuapp.com',     # Heroku
        '.fly.dev',           # Fly.io
    ])
# Ou permettre tous les hosts si RENDER est détecté (variable d'environnement Render)
if os.environ.get('RENDER'):
    ALLOWED_HOSTS.append('.onrender.com')

# ──────────────────────────────────────────────
# APPLICATIONS
# ──────────────────────────────────────────────
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'django_filters',
    'django_celery_beat',
    'django_celery_results',
    'drf_spectacular',
    'phonenumber_field',
    'storages',
]

LOCAL_APPS = [
    'apps.accounts',
    'apps.candidates',
    'apps.exams',
    'apps.cms',
    'apps.platform_settings',
    'apps.resources',
    'apps.notifications',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# ──────────────────────────────────────────────
# MIDDLEWARE
# ──────────────────────────────────────────────
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Servir fichiers statiques en production
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# ──────────────────────────────────────────────
# DATABASE — Supabase PostgreSQL (via DATABASE_URL)
# ──────────────────────────────────────────────
DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL', default='postgresql://localhost:5432/oaib'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}
# SSL obligatoire pour Supabase
if not DEBUG:
    DATABASES['default'].setdefault('OPTIONS', {})['sslmode'] = 'require'

# ──────────────────────────────────────────────
# CUSTOM USER MODEL
# ──────────────────────────────────────────────
AUTH_USER_MODEL = 'accounts.User'

# ──────────────────────────────────────────────
# PASSWORD VALIDATION
# ──────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
     'OPTIONS': {'min_length': 8}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ──────────────────────────────────────────────
# INTERNATIONALIZATION
# ──────────────────────────────────────────────
LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Africa/Porto-Novo'
USE_I18N = True
USE_TZ = True

# ──────────────────────────────────────────────
# STATIC & MEDIA FILES
# ──────────────────────────────────────────────
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static'] if (BASE_DIR / 'static').exists() else []

# WhiteNoise pour compression et cache des fichiers statiques
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
MAX_UPLOAD_SIZE = config('MAX_UPLOAD_SIZE', default=5242880, cast=int)  # 5 Mo

# ──────────────────────────────────────────────
# SUPABASE STORAGE (Images CMS + Documents candidats)
# ──────────────────────────────────────────────
SUPABASE_URL = config('SUPABASE_URL', default='')
SUPABASE_KEY = config('SUPABASE_KEY', default='')
SUPABASE_SERVICE_ROLE_KEY = config('SUPABASE_SERVICE_ROLE_KEY', default='')

# Utiliser Supabase Storage par défaut pour les fichiers uploadés
DEFAULT_FILE_STORAGE = 'config.supabase_storage.CMSMediaStorage'

# ──────────────────────────────────────────────
# DEFAULT PK
# ──────────────────────────────────────────────
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ──────────────────────────────────────────────
# DJANGO REST FRAMEWORK
# ──────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
    },
    'DATETIME_FORMAT': '%d/%m/%Y %H:%M',
    'DATE_FORMAT': '%d/%m/%Y',
}

# ──────────────────────────────────────────────
# JWT
# ──────────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(
        minutes=config('JWT_ACCESS_TOKEN_LIFETIME', default=60, cast=int)
    ),
    'REFRESH_TOKEN_LIFETIME': timedelta(
        minutes=config('JWT_REFRESH_TOKEN_LIFETIME', default=1440, cast=int)
    ),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# ──────────────────────────────────────────────
# CORS
# ──────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:5173,http://localhost:3000,https://oaib.onrender.com',
    cast=Csv(),
)
CORS_ALLOW_CREDENTIALS = True

# ──────────────────────────────────────────────
# EMAIL
# ──────────────────────────────────────────────
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@oaib.bj')

# ──────────────────────────────────────────────
# CELERY
# ──────────────────────────────────────────────
CELERY_BROKER_URL = config('REDIS_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = 'django-db'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

# En développement : exécuter les tâches Celery de manière synchrone
# (pas besoin de Redis ni d'un worker Celery)
if DEBUG:
    CELERY_TASK_ALWAYS_EAGER = True
    CELERY_TASK_EAGER_PROPAGATES = True

# ──────────────────────────────────────────────
# CACHE (Redis)
# ──────────────────────────────────────────────
# En développement, utiliser le cache en mémoire si Redis n'est pas disponible
if DEBUG:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'oaib-cache',
        }
    }
else:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.redis.RedisCache',
            'LOCATION': config('REDIS_URL', default='redis://localhost:6379/1'),
            'KEY_PREFIX': 'oaib',
            'TIMEOUT': 300,
        }
    }

# ──────────────────────────────────────────────
# SECURITY (production)
# ──────────────────────────────────────────────
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'

# ──────────────────────────────────────────────
# API DOCUMENTATION (drf-spectacular)
# ──────────────────────────────────────────────
SPECTACULAR_SETTINGS = {
    'TITLE': 'OAIB API',
    'DESCRIPTION': "API de la plateforme des Olympiades d'Intelligence Artificielle du Bénin",
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
}

# ──────────────────────────────────────────────
# PHONE NUMBER
# ──────────────────────────────────────────────
PHONENUMBER_DEFAULT_REGION = 'BJ'
PHONENUMBER_DB_FORMAT = 'E164'

# ──────────────────────────────────────────────
# APPLICATION SETTINGS
# ──────────────────────────────────────────────
SITE_NAME = config('SITE_NAME', default='Olympiades IA Bénin')
SITE_URL = config('SITE_URL', default='http://localhost:5173')
OTP_EXPIRY_MINUTES = 10
QCM_SESSION_TIMEOUT_MINUTES = 30
ALLOWED_DOCUMENT_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png']
