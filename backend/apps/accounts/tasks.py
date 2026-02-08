"""Tâches Celery pour l'app accounts (envoi d'emails OTP)."""
from datetime import datetime

from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags


PURPOSE_CONFIG = {
    'email_verify': {
        'subject': 'Vérifiez votre adresse email – OAIB',
        'title': 'Vérification de votre email',
        'message': (
            'Bienvenue sur la plateforme OAIB ! '
            'Utilisez le code ci-dessous pour vérifier votre adresse email et activer votre compte.'
        ),
    },
    'password_reset': {
        'subject': 'Réinitialisation de mot de passe – OAIB',
        'title': 'Réinitialisation du mot de passe',
        'message': (
            'Vous avez demandé la réinitialisation de votre mot de passe. '
            'Utilisez le code ci-dessous pour continuer. Si vous n\'êtes pas à l\'origine de cette demande, ignorez cet email.'
        ),
    },
}


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_otp_email(self, user_email: str, code: str, purpose: str):
    """
    Envoie un email contenant le code OTP.

    Args:
        user_email: adresse email du destinataire
        code: code OTP à 6 chiffres
        purpose: 'email_verify' ou 'password_reset'
    """
    cfg = PURPOSE_CONFIG.get(purpose, PURPOSE_CONFIG['email_verify'])

    context = {
        'title': cfg['title'],
        'message': cfg['message'],
        'code': code,
        'expiry_minutes': getattr(settings, 'OTP_EXPIRY_MINUTES', 10),
        'user_email': user_email,
        'year': datetime.now().year,
    }

    html_content = render_to_string('emails/otp.html', context)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(
        subject=cfg['subject'],
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user_email],
    )
    email.attach_alternative(html_content, 'text/html')

    try:
        email.send(fail_silently=False)
    except Exception as exc:
        # Retry automatique (3 tentatives max)
        raise self.retry(exc=exc)
