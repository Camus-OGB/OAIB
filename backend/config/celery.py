"""Configuration Celery pour le projet OAIB."""
import os
from celery import Celery

# Défaut des settings Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('oaib')

# Charge la config depuis settings.py (préfixe CELERY_)
app.config_from_object('django.conf:settings', namespace='CELERY')

# Autodiscover tasks dans chaque app Django
app.autodiscover_tasks()
