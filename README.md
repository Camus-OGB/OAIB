# 🏆 OAIB - Olympiades d'Intelligence Artificielle du Bénin

Plateforme web complète pour la gestion des Olympiades d'Intelligence Artificielle du Bénin.

## 🚀 Démarrage Rapide

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.web.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
npm install
npm run dev
```

## 📦 Stack

**Backend** : Django 5.2 + PostgreSQL + Redis + Celery
**Frontend** : React 18 + TypeScript + Vite + TailwindCSS

## 🎯 Fonctionnalités

✅ Site public avec CMS
✅ Gestion des candidatures
✅ Système de QCM avec tirage aléatoire
✅ Épreuves en ligne
✅ Espace admin complet
✅ Statistiques et rapports

## ⚙️ Configuration

Créer un fichier `.env` à la racine :

```bash
cp .env.example .env
nano .env  # Remplir les valeurs
```

Variables importantes :
- `SECRET_KEY` - Clé secrète Django
- `DATABASE_URL` - URL PostgreSQL
- `SUPABASE_URL` et `SUPABASE_KEY` - Pour le storage
