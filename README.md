# 🏆 OAIB - Olympiades d'Intelligence Artificielle du Bénin

Plateforme web complète pour la gestion des Olympiades d'Intelligence Artificielle du Bénin.

## 📁 Architecture du Projet

```
OAIB/
├── backend/          # API Django REST Framework
│   ├── apps/        # Applications Django
│   ├── config/      # Configuration
│   └── manage.py    # CLI Django
├── frontend/        # Application React + TypeScript
│   ├── src/         # Code source
│   ├── public/      # Assets statiques
│   └── index.html   # Point d'entrée HTML
├── .env            # Variables d'environnement (partagées)
├── .env.example    # Template de configuration
└── README.md       # Ce fichier
```

## 🚀 Démarrage Rapide

### Prérequis
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

### 1. Configuration initiale

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd OAIB

# Copier et configurer les variables d'environnement
cp .env.example .env
nano .env  # Remplir les valeurs
```

### 2. Backend (Django)

```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.web.txt

# Appliquer les migrations
python manage.py migrate

# Créer un superuser
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
```

✅ API disponible sur `http://localhost:8000`

### 3. Frontend (React)

```bash
# Dans un nouveau terminal
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

✅ Application disponible sur `http://localhost:3000`

## 📦 Stack Technique

### Backend
- **Django 5.2** - Framework web Python
- **Django REST Framework** - API REST
- **PostgreSQL** - Base de données (via Supabase)
- **Supabase Storage** - Stockage de fichiers
- **JWT** - Authentification
- **Gunicorn** - Serveur WSGI (production)

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool rapide
- **TailwindCSS** - Framework CSS utility-first
- **React Router** - Routing côté client
- **Recharts** - Visualisation de données

## 🎯 Fonctionnalités

### Site Public
✅ Page d'accueil avec countdown
✅ Programme des olympiades
✅ Résultats et projets des lauréats
✅ Blog/Actualités
✅ À propos et informations

### Espace Candidat/Étudiant
✅ Inscription et authentification (JWT + OTP)
✅ Soumission de candidature
✅ Profil personnalisé
✅ Passage d'examens QCM
✅ Consultation des résultats
✅ Accès aux ressources

### Espace Administrateur
✅ Gestion des utilisateurs et candidatures
✅ Création et gestion des examens/QCM
✅ Gestion du contenu CMS (actualités, FAQ, témoignages)
✅ Statistiques détaillées
✅ Configuration du site (timeline, countdown)
✅ Export de données et rapports

## ⚙️ Configuration

Le fichier `.env` à la racine contient toutes les variables d'environnement pour le backend et le frontend.

### Variables essentielles

```bash
# Django
SECRET_KEY=votre-clé-secrète-unique
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (Supabase PostgreSQL Session Pooler)
DATABASE_URL=postgresql://user:password@host:port/database

# Supabase Storage
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service

# Email (SMTP)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=votre-email@gmail.com
EMAIL_HOST_PASSWORD=votre-mot-de-passe

# CORS (autoriser le frontend)
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Frontend (Vite)
VITE_API_URL=http://localhost:8000
```

## 📚 Documentation Détaillée

- [Backend README](backend/README.md) - Documentation complète du backend Django
- [Frontend README](frontend/README.md) - Documentation complète du frontend React

## 🔐 Authentification

Le système utilise JWT (JSON Web Tokens) pour l'authentification:

1. L'utilisateur s'inscrit (`POST /api/auth/register/`)
2. Reçoit un OTP par email
3. Vérifie l'OTP (`POST /api/auth/verify-otp/`)
4. Se connecte (`POST /api/auth/login/`) et reçoit un access token + refresh token
5. Utilise l'access token dans le header `Authorization: Bearer <token>` pour les requêtes protégées

## 🧪 Tests

### Backend
```bash
cd backend
source venv/bin/activate
python manage.py test
```

### Frontend
```bash
cd frontend
npm run test  # Si configuré
npm run type-check  # Vérifier les types TypeScript
```

## 📦 Déploiement

### Backend
Voir [backend/README.md](backend/README.md) pour les instructions de déploiement avec Gunicorn.

### Frontend
```bash
cd frontend
npm run build  # Génère dist/
```

Le dossier `dist/` peut être déployé sur:
- Vercel, Netlify, Cloudflare Pages (déploiement automatique)
- Serveur web classique (Nginx, Apache)
- CDN (S3 + CloudFront, etc.)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👥 Équipe

Olympiades d'Intelligence Artificielle du Bénin - [Site Web](https://oaib.bj)
