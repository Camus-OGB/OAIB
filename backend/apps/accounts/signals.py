"""Signals pour l'app accounts — création auto du profil candidat."""
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_candidate_profile(sender, instance, created, **kwargs):
    """Crée automatiquement un CandidateProfile pour tout nouvel étudiant."""
    if created and instance.role == 'student':
        from apps.candidates.models import CandidateProfile
        CandidateProfile.objects.get_or_create(user=instance)
