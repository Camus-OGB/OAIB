"""
Storage backend pour Supabase - Gère images CMS et documents candidats
"""
from supabase import create_client, Client
from django.conf import settings
from django.core.files.storage import Storage
import mimetypes
import uuid
from datetime import datetime


class SupabaseStorage(Storage):
    """Storage générique pour Supabase"""

    def __init__(self, bucket_name='cms-media'):
        # Utiliser la clé service_role pour bypass RLS, fallback sur anon key
        service_key = getattr(settings, 'SUPABASE_SERVICE_ROLE_KEY', '') or settings.SUPABASE_KEY
        self.supabase: Client = create_client(
            settings.SUPABASE_URL,
            service_key
        )
        self.bucket_name = bucket_name

    def _save(self, name, content):
        """Upload un fichier vers Supabase"""
        # Lire le contenu
        file_data = content.read()

        # Déterminer le content-type
        content_type = mimetypes.guess_type(name)[0] or 'application/octet-stream'

        # Générer un nom unique si nécessaire
        if not name:
            ext = content_type.split('/')[-1]
            name = f"{uuid.uuid4()}.{ext}"

        # Upload vers Supabase
        try:
            self.supabase.storage.from_(self.bucket_name).upload(
                path=name,
                file=file_data,
                file_options={
                    "content-type": content_type,
                    "upsert": "true"  # Remplacer si existe
                }
            )
            return name
        except Exception as e:
            print(f"Erreur upload Supabase: {e}")
            raise

    def url(self, name):
        """Retourne l'URL publique (CMS) ou signée (candidats)"""
        if not name:
            return ''

        if self.bucket_name == 'cms-media':
            # URL publique pour le CMS
            return f"{settings.SUPABASE_URL}/storage/v1/object/public/{self.bucket_name}/{name}"
        else:
            # URL signée (expire dans 1h) pour les documents candidats
            try:
                response = self.supabase.storage.from_(self.bucket_name).create_signed_url(
                    path=name,
                    expires_in=3600  # 1 heure
                )
                return response.get('signedURL', '')
            except:
                return ''

    def exists(self, name):
        """Vérifie si un fichier existe"""
        try:
            files = self.supabase.storage.from_(self.bucket_name).list()
            return any(f['name'] == name for f in files)
        except:
            return False

    def delete(self, name):
        """Supprime un fichier"""
        try:
            self.supabase.storage.from_(self.bucket_name).remove([name])
        except Exception as e:
            print(f"Erreur suppression Supabase: {e}")

    def size(self, name):
        """Retourne la taille du fichier"""
        try:
            files = self.supabase.storage.from_(self.bucket_name).list()
            file = next((f for f in files if f['name'] == name), None)
            return file['metadata']['size'] if file and 'metadata' in file else 0
        except:
            return 0


# Storage spécifique pour les images CMS
class CMSMediaStorage(SupabaseStorage):
    """Storage public pour les images du CMS (actualités, témoignages, logos)"""

    def __init__(self):
        super().__init__(bucket_name='cms-media')


# Storage spécifique pour les documents candidats
class CandidateDocumentStorage(SupabaseStorage):
    """Storage privé pour les documents des candidats"""

    def __init__(self):
        super().__init__(bucket_name='candidate-documents')

    def get_candidate_path(self, candidate_id, filename):
        """
        Génère un chemin unique pour un candidat
        Format: {candidate_id}/{timestamp}_{uuid}.{ext}
        """
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        ext = filename.split('.')[-1] if '.' in filename else 'pdf'
        unique_id = uuid.uuid4().hex[:8]
        return f"{candidate_id}/{timestamp}_{unique_id}.{ext}"
