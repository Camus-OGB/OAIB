# Frontend OAIB - React + TypeScript

Application web React pour la plateforme des Olympiades d'Intelligence Artificielle du Bénin.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## ⚙️ Configuration

Créer un fichier `.env` dans le dossier `frontend/` (ou utiliser les variables du `.env` racine):

```bash
VITE_API_URL=http://localhost:8000
VITE_SITE_URL=http://localhost:3000
```

## 📚 Structure

```
frontend/
├── src/
│   ├── admin/              # Interface administrateur
│   │   ├── components/    # Composants admin
│   │   ├── layout/        # Layout admin
│   │   └── pages/         # Pages admin (Dashboard, Users, etc.)
│   ├── features/          # Fonctionnalités métier
│   │   └── auth/          # Authentification
│   │       ├── context/   # Contexte auth
│   │       ├── pages/     # Pages (Login, Register, etc.)
│   │       └── services/  # Services API auth
│   ├── public/            # Pages publiques (site vitrine)
│   │   ├── components/    # Composants publics
│   │   ├── data/          # Données statiques
│   │   └── pages/         # Pages (Home, About, etc.)
│   ├── shared/            # Composants partagés
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # Types TypeScript
│   │   └── utils/         # Utilitaires
│   ├── student/           # Espace étudiant/candidat
│   │   ├── layout/        # Layout étudiant
│   │   └── pages/         # Pages (Dashboard, Exams, etc.)
│   ├── services/          # Services API
│   │   ├── apiClient.ts   # Client HTTP centralisé
│   │   ├── examService.ts # API examens
│   │   └── ...
│   ├── styles/            # Styles globaux
│   ├── App.tsx            # Composant principal
│   └── main.tsx           # Point d'entrée
├── index.html             # Template HTML
├── package.json           # Dépendances
├── vite.config.ts         # Configuration Vite
├── tailwind.config.js     # Configuration Tailwind
└── tsconfig.json          # Configuration TypeScript
```

## 🎨 Stack Technique

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool rapide
- **TailwindCSS** - Framework CSS
- **React Router** - Routing
- **Recharts** - Graphiques
- **Lucide React** - Icônes

## 🔌 Intégration Backend

L'API est configurée via `VITE_API_URL`. Tous les appels API passent par le client centralisé dans `src/lib/apiClient.ts`.

Exemple d'utilisation:
```typescript
import { apiClient } from '@/lib/apiClient';

// GET request
const response = await apiClient.get('/api/users/me/');

// POST request
const response = await apiClient.post('/api/auth/login/', {
  email: 'user@example.com',
  password: 'password123'
});
```

## 📄 Pages et Routes

### Public (Site Vitrine)
- `/` - Page d'accueil
- `/programme` - Programme des olympiades
- `/resultats` - Résultats et innovations
- `/a-propos` - À propos de l'initiative
- `/blog` - Actualités

### Authentification
- `/login` - Connexion
- `/register` - Inscription
- `/forgot-password` - Mot de passe oublié
- `/verify-otp` - Vérification OTP

### Espace Étudiant/Candidat
- `/student/dashboard` - Tableau de bord
- `/student/profile` - Profil
- `/student/exams` - Liste des examens
- `/student/exam/:id` - Passer un examen
- `/student/results` - Résultats
- `/student/resources` - Ressources
- `/student/settings` - Paramètres

### Espace Admin
- `/admin/dashboard` - Tableau de bord admin
- `/admin/users` - Gestion des utilisateurs
- `/admin/candidates` - Gestion des candidatures
- `/admin/students` - Gestion des étudiants
- `/admin/exams` - Gestion des examens
- `/admin/qcm` - Gestion des QCM
- `/admin/content` - Gestion du contenu CMS
- `/admin/results` - Gestion des résultats
- `/admin/statistics` - Statistiques
- `/admin/settings` - Paramètres

## 🧪 Scripts

```bash
# Développement
npm run dev              # Serveur de dev avec hot reload

# Build
npm run build            # Build de production dans dist/
npm run preview          # Prévisualiser le build

# Linting
npm run lint             # ESLint
npm run lint:fix         # Fix auto des erreurs ESLint

# Type checking
npm run type-check       # Vérifier les types TypeScript
```

## 🎨 Personnalisation du Design

### Couleurs (Tailwind)
Les couleurs sont configurées dans `tailwind.config.js`:

```javascript
colors: {
  'primary': '#0F172A',        // Bleu foncé principal
  'accent': '#00D4FF',         // Cyan accent
  'benin-green': '#00843D',    // Vert drapeau Bénin
  'benin-yellow': '#FCD116',   // Jaune drapeau Bénin
  'benin-red': '#E8112D',      // Rouge drapeau Bénin
  // ...
}
```

### Composants Réutilisables
- `AnimatedSection` - Animations au scroll
- `AnimatedCard` - Cartes animées
- `OptimizedImage` - Images optimisées
- `Toast` - Notifications
- `LiveCounter` - Compteur animé
- Patterns AI (Matrix, Circuit, Hexagon, etc.)

## 🔒 Authentification

Le contexte d'authentification est géré par `AuthContext`:

```typescript
import { useAuth } from '@/features/auth/context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  // ...
}
```

## 📦 Production

### Build

```bash
# Créer le build de production
npm run build

# Le résultat est dans dist/
```

### Variables d'environnement

Pour la production, créer un fichier `.env.production`:

```bash
VITE_API_URL=https://api.votre-domaine.com
VITE_SITE_URL=https://votre-domaine.com
```

### Déploiement

Le dossier `dist/` contient les fichiers statiques à déployer. Vous pouvez:

1. **Serveur web classique** (Nginx, Apache)
   - Copier le contenu de `dist/` vers le document root
   - Configurer le rewrite pour le routing React

2. **Services de déploiement**
   - Vercel: `vercel --prod`
   - Netlify: Drag & drop du dossier `dist/`
   - GitHub Pages, Cloudflare Pages, etc.

### Configuration Nginx

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    root /chemin/vers/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache pour les assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🐛 Débogage

```bash
# Vérifier les erreurs TypeScript
npm run type-check

# Activer le mode verbose de Vite
npm run dev -- --debug

# Build avec source maps
npm run build -- --sourcemap
```

## 📝 Bonnes Pratiques

- ✅ Utiliser TypeScript pour tous les composants
- ✅ Créer des composants réutilisables dans `shared/components/`
- ✅ Utiliser les hooks personnalisés pour la logique partagée
- ✅ Gérer les états globaux avec Context API
- ✅ Valider les formulaires côté client
- ✅ Gérer les erreurs API avec des try/catch
- ✅ Utiliser les classes Tailwind plutôt que du CSS personnalisé
- ✅ Optimiser les images (format WebP, lazy loading)
