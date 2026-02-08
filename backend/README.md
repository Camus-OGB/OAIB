# Backend OAIB - Django REST API

API Django pour la plateforme des Olympiades d'Intelligence Artificielle du Bénin.

## 🚀 Démarrage Rapide

### Prérequis
- Python 3.11+
- PostgreSQL 14+

### Installation

```bash
# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.web.txt

# Configurer la base de données (voir Configuration ci-dessous)

# Appliquer les migrations
python manage.py migrate

# Créer un superuser
python manage.py createsuperuser

# Lancer le serveur de développement
python manage.py runserver
```

L'API sera accessible sur `http://localhost:8000`

## ⚙️ Configuration

Les variables d'environnement sont dans le fichier `.env` **à la racine du projet** (un niveau au-dessus).

Variables importantes:
```bash
# Django
SECRET_KEY=votre-clé-secrète
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/dbname

# Supabase Storage
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=votre-email
EMAIL_HOST_PASSWORD=votre-mot-de-passe

# CORS (autoriser le frontend)
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## 📚 Structure

```
backend/
├── apps/                    # Applications Django
│   ├── accounts/           # Gestion des utilisateurs
│   ├── candidates/         # Gestion des candidats
│   ├── cms/                # Système de contenu
│   ├── exams/              # Gestion des examens/QCM
│   └── notifications/      # Notifications email
├── config/                 # Configuration Django
│   ├── settings.py         # Paramètres principaux
│   ├── urls.py            # Routes principales
│   └── wsgi.py            # Point d'entrée WSGI
├── manage.py              # Commandes Django
└── requirements.web.txt   # Dépendances Python
```

## 🔌 Endpoints Principaux

### Authentification
- `POST /api/auth/register/` - Inscription
- `POST /api/auth/login/` - Connexion (obtenir JWT)
- `POST /api/auth/token/refresh/` - Rafraîchir le token
- `POST /api/auth/verify-otp/` - Vérifier OTP
- `POST /api/auth/password/reset/` - Réinitialiser mot de passe

### Utilisateurs
- `GET /api/users/me/` - Profil de l'utilisateur connecté
- `PUT /api/users/me/` - Mettre à jour le profil

### CMS (Public)
- `GET /api/cms/news/` - Liste des actualités
- `GET /api/cms/testimonials/` - Témoignages
- `GET /api/cms/faq/` - FAQ
- `GET /api/cms/stats/` - Statistiques publiques

### Candidatures
- `POST /api/candidates/apply/` - Soumettre une candidature
- `GET /api/candidates/my-application/` - Voir sa candidature

### Examens
- `GET /api/exams/editions/` - Liste des éditions
- `GET /api/exams/sessions/` - Sessions d'examen
- `POST /api/exams/sessions/{id}/start/` - Démarrer un examen
- `POST /api/exams/sessions/{id}/submit/` - Soumettre les réponses

### Admin
- `GET /admin/` - Interface d'administration Django

## 🧪 Tests

```bash
# Lancer tous les tests
python manage.py test

# Tests d'une app spécifique
python manage.py test apps.accounts

# Avec coverage
coverage run --source='.' manage.py test
coverage report
```

## 📊 Commandes Utiles

```bash
# Créer une nouvelle app
python manage.py startapp nom_app apps/nom_app

# Créer des migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Collecter les fichiers statiques
python manage.py collectstatic

# Shell Django
python manage.py shell

# Vérifier la configuration
python manage.py check
```

## 🔒 Sécurité

- Les mots de passe sont hashés avec PBKDF2
- JWT pour l'authentification
- CORS configuré pour autoriser uniquement le frontend
- Rate limiting sur les endpoints sensibles
- Validation des uploads de fichiers

## 📦 Production

Pour le déploiement en production:

```bash
# Installer Gunicorn (déjà dans requirements.web.txt)
pip install gunicorn

# Lancer avec Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000

# Avec configuration optimisée
gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 4 \
    --threads 2 \
    --timeout 60
```

Variables d'environnement à modifier pour la production:
```bash
DEBUG=False
SECRET_KEY=<générer-une-clé-complexe-unique>
ALLOWED_HOSTS=votre-domaine.com
```
