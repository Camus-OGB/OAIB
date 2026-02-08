# 🚀 Guide de Déploiement Séparé - Backend & Frontend

Ce guide explique comment déployer le backend et le frontend sur des serveurs ou plateformes différents.

## 📋 Architecture de Déploiement

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│   (Vercel,      │────────▶│   (Railway,     │
│   Netlify,      │  HTTPS  │    Render,      │
│   Cloudflare)   │  calls  │    VPS)         │
└─────────────────┘         └─────────────────┘
     Domaine:                    Domaine:
     app.oaib.bj                 api.oaib.bj
```

---

## 🔧 1. Déploiement du Backend

### Option A: Railway (Recommandé - Gratuit pour débuter)

1. **Créer un compte sur [Railway](https://railway.app)**

2. **Créer un nouveau projet**
   - Cliquer sur "New Project"
   - Sélectionner "Deploy from GitHub repo"
   - Choisir votre dépôt OAIB

3. **Configurer le service**
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.web.txt`
   - Start Command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

4. **Ajouter PostgreSQL**
   - Dans le projet, cliquer sur "+ New"
   - Sélectionner "Database" → "PostgreSQL"
   - Railway génère automatiquement `DATABASE_URL`

5. **Variables d'environnement**

   Aller dans Settings → Variables et ajouter:
   ```bash
   DEBUG=False
   SECRET_KEY=<générer-une-clé-sécurisée>
   ALLOWED_HOSTS=votre-domaine-backend.railway.app
   DATABASE_URL=${{Postgres.DATABASE_URL}}  # Auto-généré par Railway
   CORS_ALLOWED_ORIGINS=https://votre-frontend.vercel.app

   # Supabase
   SUPABASE_URL=https://votre-projet.supabase.co
   SUPABASE_KEY=votre-clé-anon
   SUPABASE_SERVICE_ROLE_KEY=votre-clé-service

   # Email
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_HOST_USER=votre-email@gmail.com
   EMAIL_HOST_PASSWORD=votre-mot-de-passe-app
   ```

6. **Domaine personnalisé (optionnel)**
   - Settings → Networking → Custom Domain
   - Ajouter `api.oaib.bj`

✅ **Backend déployé sur**: `https://votre-projet.railway.app`

---

### Option B: Render

1. **Créer un compte sur [Render](https://render.com)**

2. **Nouveau Web Service**
   - New → Web Service
   - Connecter votre dépôt GitHub
   - Root Directory: `backend`

3. **Configuration**
   - Build Command: `pip install -r requirements.web.txt && python manage.py migrate && python manage.py collectstatic --noinput`
   - Start Command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
   - Environment: Python 3

4. **Ajouter PostgreSQL**
   - Dans le dashboard, New → PostgreSQL
   - Copier l'Internal Database URL

5. **Variables d'environnement**
   - Même liste que Railway
   - `DATABASE_URL` = Internal Database URL de Render

---

### Option C: VPS (DigitalOcean, Linode, AWS EC2)

```bash
# Sur le serveur
cd /var/www

# Cloner uniquement le backend
git clone <url-repo> oaib-backend
cd oaib-backend

# Installer Python et dépendances
sudo apt update
sudo apt install python3.11 python3-pip postgresql nginx -y

# Installer l'app
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.web.txt

# Configurer .env
nano ../.env  # Remplir les variables

# Migrations
python manage.py migrate
python manage.py collectstatic --noinput

# Créer service systemd (voir backend/README.md)
sudo nano /etc/systemd/system/oaib-backend.service
sudo systemctl enable oaib-backend
sudo systemctl start oaib-backend

# Configurer Nginx
sudo nano /etc/nginx/sites-available/oaib-backend
# (Configuration reverse proxy vers Gunicorn)
sudo ln -s /etc/nginx/sites-available/oaib-backend /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 🎨 2. Déploiement du Frontend

### Option A: Vercel (Recommandé)

1. **Créer un compte sur [Vercel](https://vercel.com)**

2. **Import du projet**
   - New Project → Import Git Repository
   - Sélectionner votre dépôt OAIB

3. **Configuration**
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Variables d'environnement**

   Settings → Environment Variables:
   ```bash
   VITE_API_URL=https://votre-backend.railway.app
   VITE_SITE_URL=https://votre-frontend.vercel.app
   ```

5. **Domaine personnalisé**
   - Settings → Domains
   - Ajouter `oaib.bj` ou `app.oaib.bj`

✅ **Frontend déployé sur**: `https://votre-projet.vercel.app`

---

### Option B: Netlify

1. **Créer un compte sur [Netlify](https://netlify.com)**

2. **Nouveau site**
   - Sites → Add new site → Import existing project
   - Connecter GitHub

3. **Build settings**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

4. **Variables d'environnement**
   - Site settings → Environment variables
   - Ajouter `VITE_API_URL` et `VITE_SITE_URL`

5. **Redirects pour React Router**

   Créer `frontend/public/_redirects`:
   ```
   /* /index.html 200
   ```

---

### Option C: Cloudflare Pages

1. **Connecter GitHub à Cloudflare Pages**

2. **Créer un projet**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `frontend`

3. **Variables d'environnement**
   - Settings → Environment variables
   - Ajouter les variables `VITE_*`

---

## 🔗 3. Connecter Backend et Frontend

### A. Configurer CORS sur le Backend

Dans votre `.env` backend:
```bash
CORS_ALLOWED_ORIGINS=https://votre-frontend.vercel.app,https://oaib.bj
```

Si vous utilisez Railway/Render, redéployer après modification.

### B. Configurer l'API URL dans le Frontend

Variables Vercel/Netlify/Cloudflare:
```bash
VITE_API_URL=https://api.oaib.bj  # ou votre domaine Railway/Render
```

Redéployer le frontend après modification.

### C. Tester la connexion

```bash
# Depuis votre navigateur sur le frontend déployé
# Ouvrir la console (F12) et tester:
fetch('https://api.oaib.bj/api/cms/news/')
  .then(r => r.json())
  .then(console.log)
```

Si vous voyez des données, tout fonctionne ! ✅

---

## 🌐 4. Configuration DNS (Domaine personnalisé)

### Pour le Backend (api.oaib.bj)

Si déployé sur Railway/Render:
```
Type: CNAME
Name: api
Value: votre-projet.railway.app (ou render.com)
TTL: Auto
```

Si sur VPS:
```
Type: A
Name: api
Value: <IP-de-votre-serveur>
TTL: Auto
```

### Pour le Frontend (oaib.bj ou www.oaib.bj)

Si déployé sur Vercel:
```
Type: CNAME
Name: @  (ou www)
Value: cname.vercel-dns.com
TTL: Auto
```

---

## 🔒 5. HTTPS et Sécurité

### Railway/Render/Vercel/Netlify
✅ HTTPS automatique (Let's Encrypt)
✅ Certificats SSL gérés automatiquement

### VPS (Nginx)
```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir certificat SSL
sudo certbot --nginx -d api.oaib.bj

# Renouvellement automatique (déjà configuré)
sudo certbot renew --dry-run
```

---

## 📊 6. Monitoring et Logs

### Backend (Railway)
- Dashboard → Logs (temps réel)
- Métriques: CPU, RAM, requêtes

### Backend (VPS)
```bash
# Logs applicatifs
sudo journalctl -u oaib-backend -f

# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Frontend (Vercel)
- Dashboard → Logs
- Analytics intégré

---

## 🚨 Troubleshooting

### CORS Errors
```
Access to fetch at 'https://api.oaib.bj' from origin 'https://oaib.bj'
has been blocked by CORS policy
```

**Solution**: Vérifier `CORS_ALLOWED_ORIGINS` dans le backend

### 502 Bad Gateway
**Cause**: Backend ne répond pas

**Solutions**:
- Vérifier que le backend est démarré
- Vérifier les logs du backend
- Vérifier la commande de démarrage (Gunicorn)

### Build Failed (Frontend)
**Cause**: Erreurs TypeScript ou dépendances manquantes

**Solutions**:
```bash
# Localement
cd frontend
npm run type-check
npm run build
```

---

## 📋 Checklist de Déploiement

### Backend
- [ ] Variables d'environnement configurées
- [ ] `DEBUG=False`
- [ ] `SECRET_KEY` unique et sécurisé
- [ ] `ALLOWED_HOSTS` avec le domaine
- [ ] Base de données PostgreSQL connectée
- [ ] Migrations appliquées
- [ ] Fichiers statiques collectés
- [ ] CORS configuré pour le frontend
- [ ] Superuser créé

### Frontend
- [ ] `VITE_API_URL` pointe vers le backend
- [ ] Build réussit sans erreur
- [ ] Routing fonctionne (redirects configurés)
- [ ] HTTPS activé
- [ ] Domaine personnalisé configuré (optionnel)

### Tests
- [ ] Backend accessible via `curl https://api.oaib.bj/api/cms/news/`
- [ ] Frontend accessible via navigateur
- [ ] Login/Register fonctionnel
- [ ] Upload de fichiers fonctionne (Supabase Storage)
- [ ] Emails envoyés correctement

---

## 💰 Coûts Estimés

| Service | Free Tier | Recommandation |
|---------|-----------|----------------|
| **Railway** (Backend) | $5/mois de crédit | ✅ Parfait pour débuter |
| **Vercel** (Frontend) | Gratuit (hobby) | ✅ Idéal |
| **PostgreSQL** (Railway) | Inclus | ✅ |
| **Supabase** (Storage) | 1GB gratuit | ✅ |
| **Domaine** (.bj) | ~$20-50/an | Via registrar |

**Total démarrage**: ~$5-10/mois + domaine

---

## 📞 Support

Pour toute question sur le déploiement:
- Backend: Voir [backend/README.md](backend/README.md)
- Frontend: Voir [frontend/README.md](frontend/README.md)
- Architecture générale: Voir [README.md](README.md)
