"""Serializers pour l'app candidates."""
from rest_framework import serializers

from .models import CandidateProfile, TutorInfo, Document


class TutorInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorInfo
        fields = [
            'id', 'first_name', 'last_name',
            'relationship', 'phone', 'email',
        ]


class DocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = ['id', 'name', 'doc_type', 'file', 'file_url', 'size_bytes', 'status', 'uploaded_at']
        read_only_fields = ['id', 'size_bytes', 'status', 'uploaded_at', 'file_url']

    def get_file_url(self, obj):
        """Retourne l'URL signée du fichier"""
        if obj.file:
            return obj.file.url
        return None

    def create(self, validated_data):
        file = validated_data.get('file')
        candidate = validated_data.get('candidate')

        if file and candidate:
            # Générer un nom de fichier unique pour le candidat
            from config.supabase_storage import CandidateDocumentStorage
            storage = CandidateDocumentStorage()
            unique_path = storage.get_candidate_path(candidate.id, file.name)

            # Sauvegarder avec le chemin unique
            file.name = unique_path
            validated_data['size_bytes'] = file.size

        return super().create(validated_data)


class CandidateProfileSerializer(serializers.ModelSerializer):
    tutor_info = TutorInfoSerializer(read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = CandidateProfile
        fields = [
            'id', 'user', 'user_email', 'user_name',
            'gender', 'address', 'city', 'country',
            'school', 'level', 'class_name',
            'average_grade', 'math_grade', 'science_grade',
            'region', 'status', 'profile_completion',
            'admin_comment', 'registered_at', 'updated_at',
            'tutor_info', 'documents',
        ]
        read_only_fields = [
            'id', 'user', 'user_email', 'user_name',
            'status', 'profile_completion', 'admin_comment',
            'registered_at', 'updated_at',
        ]

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


class CandidateProfileUpdateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la mise à jour du profil par le candidat."""
    first_name = serializers.CharField(required=False, write_only=True)
    last_name = serializers.CharField(required=False, write_only=True)
    phone = serializers.CharField(required=False, write_only=True, allow_blank=True)
    birth_date = serializers.DateField(required=False, write_only=True, allow_null=True)

    class Meta:
        model = CandidateProfile
        fields = [
            'first_name', 'last_name', 'phone', 'birth_date',
            'gender', 'address', 'city', 'country',
            'school', 'level', 'class_name',
            'average_grade', 'math_grade', 'science_grade',
            'region',
        ]

    def update(self, instance, validated_data):
        # Extraire et appliquer les champs User
        user_fields = {}
        for field in ('first_name', 'last_name', 'phone', 'birth_date'):
            if field in validated_data:
                user_fields[field] = validated_data.pop(field)
        if user_fields:
            user = instance.user
            for attr, value in user_fields.items():
                setattr(user, attr, value)
            user.save(update_fields=list(user_fields.keys()))

        instance = super().update(instance, validated_data)
        instance.calculate_completion()
        instance.save(update_fields=['profile_completion', 'status'])
        return instance


class AdminCandidateSerializer(serializers.ModelSerializer):
    """Sérialiseur admin — peut valider/rejeter une candidature."""
    tutor_info = TutorInfoSerializer(read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    user_phone = serializers.CharField(source='user.phone', read_only=True)
    birth_date = serializers.DateField(source='user.birth_date', read_only=True)

    class Meta:
        model = CandidateProfile
        fields = [
            'id', 'user', 'user_email', 'user_name', 'user_phone', 'birth_date',
            'gender', 'address', 'city', 'country',
            'school', 'level', 'class_name',
            'average_grade', 'math_grade', 'science_grade',
            'region', 'status', 'profile_completion',
            'admin_comment', 'registered_at', 'updated_at',
            'tutor_info', 'documents',
        ]
        read_only_fields = [
            'id', 'user', 'user_email', 'user_name', 'user_phone', 'birth_date',
            'profile_completion', 'registered_at', 'updated_at',
        ]

    def get_user_name(self, obj):
        name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return name or None
