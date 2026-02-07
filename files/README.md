# 🎓 Base de Données - Olympiades d'Intelligence Artificielle du Bénin

## 📋 Vue d'ensemble

Ce package contient l'architecture complète de la base de données PostgreSQL pour la plateforme des Olympiades d'IA du Bénin, incluant :
- Schéma de base de données complet
- Documentation détaillée
- Guides d'implémentation
- Scripts de migration et déploiement
- Diagrammes ERD

## 📦 Contenu du Package

### 1. **olympiades_ia_schema.sql** ⭐
**Fichier principal** contenant le schéma SQL complet avec :
- 30+ tables structurées
- Triggers automatiques
- Fonctions PostgreSQL
- Vues optimisées
- Index de performance
- Commentaires explicatifs

**Usage :**
```bash
psql -U votre_utilisateur -d olympiades_ia -f olympiades_ia_schema.sql
```

### 2. **DOCUMENTATION_BD.md** 📚
Documentation exhaustive (18 sections) couvrant :
- Architecture générale
- Description détaillée de chaque table
- Explications des relations
- Requêtes SQL courantes
- Conseils de sécurité et performance
- Conformité RGPD
- Tests et validation

**À lire en priorité pour comprendre la structure**

### 3. **ERD_DIAGRAM.md** 📊
Diagramme Entity-Relationship en format Mermaid montrant :
- Relations entre toutes les tables
- Clés primaires et étrangères
- Cardinalités
- Structure visuelle de la base

**Visualisation :**
Copiez le contenu dans [Mermaid Live Editor](https://mermaid.live) ou utilisez l'extension Mermaid dans VS Code.

### 4. **GUIDE_IMPLEMENTATION.md** 💻
Guide pratique avec exemples de code incluant :
- Configuration Node.js/Express
- Modèles Sequelize
- Routes d'API (inscription, QCM, etc.)
- Système de gamification
- Scripts d'administration
- Middleware de sécurité

**Stack technologique utilisée dans les exemples :**
- Node.js + Express
- Sequelize ORM
- PostgreSQL
- JWT pour l'authentification
- bcrypt pour les mots de passe

### 5. **GUIDE_MIGRATION_DEPLOIEMENT.md** 🚀
Guide complet pour la mise en production :
- Stratégie de migration de schéma
- Gestion des versions
- Configuration par environnement (dev/staging/prod)
- Déploiement cloud (AWS, Google Cloud, VPS)
- Backup et restauration
- Monitoring et optimisations

## 🎯 Par où commencer ?

### Pour les développeurs backend :
1. ✅ Lisez **DOCUMENTATION_BD.md** (sections 1-5)
2. ✅ Examinez **ERD_DIAGRAM.md** pour visualiser la structure
3. ✅ Installez le schéma : `olympiades_ia_schema.sql`
4. ✅ Suivez **GUIDE_IMPLEMENTATION.md** pour le code backend
5. ✅ Adaptez les exemples à votre stack (Python/Django, PHP/Laravel, etc.)

### Pour les administrateurs système :
1. ✅ Consultez **GUIDE_MIGRATION_DEPLOIEMENT.md**
2. ✅ Configurez votre environnement PostgreSQL
3. ✅ Mettez en place les backups automatiques
4. ✅ Configurez le monitoring

### Pour les chefs de projet :
1. ✅ Lisez le **DOCUMENTATION_BD.md** (sections 1-2) pour comprendre l'architecture
2. ✅ Examinez **ERD_DIAGRAM.md** pour voir les relations
3. ✅ Utilisez la documentation pour coordonner avec les équipes

## 🛠️ Installation Rapide

### Prérequis
```bash
# PostgreSQL 14+
sudo apt install postgresql-14

# Extensions nécessaires
sudo -u postgres psql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Installation
```bash
# 1. Créer la base de données
sudo -u postgres createdb olympiades_ia

# 2. Créer l'utilisateur
sudo -u postgres psql
CREATE USER olympiades_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE olympiades_ia TO olympiades_user;

# 3. Exécuter le schéma
psql -U olympiades_user -d olympiades_ia -f olympiades_ia_schema.sql

# 4. Vérifier l'installation
psql -U olympiades_user -d olympiades_ia -c "\dt"
```

## 📊 Statistiques du Schéma

- **Tables principales** : 30+
- **Triggers automatiques** : 10+
- **Vues** : 3
- **Index d'optimisation** : 25+
- **Fonctions** : 5+

## 🔐 Sécurité

Le schéma intègre :
- ✅ Chiffrement des mots de passe (bcrypt recommandé)
- ✅ UUID pour les identifiants sensibles
- ✅ Validation des contraintes
- ✅ Journal d'audit complet
- ✅ Protection contre les injections SQL
- ✅ Conformité RGPD

## 🎨 Modules Fonctionnels

### Module 1 : Utilisateurs et Authentification
- Gestion des rôles (candidat, admin, super_admin)
- Authentification sécurisée
- Vérification email par OTP
- Support 2FA

### Module 2 : Éditions et Phases
- Gestion des éditions annuelles
- 6 phases de sélection configurables
- Critères de sélection flexibles (JSONB)

### Module 3 : Système de QCM
- Banque de questions catégorisées
- Tirage aléatoire sans doublon
- Chronomètre et détection de triche
- Correction automatique

### Module 4 : Évaluations
- Évaluation par phase
- Scores multiples (QCM + dossier)
- Classement et rang

### Module 5 : Gamification
- Badges prédéfinis et extensibles
- Système de points XP
- Classement régional et national

### Module 6 : Contenu et Communication
- Actualités et FAQ
- Gestion des partenaires
- Témoignages des participants
- Médias (photos, vidéos)

### Module 7 : Notifications
- Notifications in-app
- Messages personnalisés
- Templates d'emails
- Niveaux de priorité

### Module 8 : Audit et Traçabilité
- Journal de toutes les actions
- Stockage des valeurs avant/après
- Tracking IP et user agent

### Module 9 : Statistiques
- KPIs pré-calculés
- Rapports par région
- Analyses de performance

## 🔄 Workflow Typique

```
1. Inscription candidat
   ↓
2. Vérification email (code OTP)
   ↓
3. Complétion du profil
   ↓
4. Validation du dossier par admin
   ↓
5. Passage du QCM chronométré
   ↓
6. Attribution automatique de badges
   ↓
7. Évaluation par phase
   ↓
8. Sélection finale
```

## 🎓 Technologies Recommandées

### Backend
- **Node.js** : Express + Sequelize (exemples fournis)
- **Python** : Django + Django ORM / FastAPI + SQLAlchemy
- **PHP** : Laravel + Eloquent
- **Ruby** : Rails + Active Record

### Frontend
- React / Vue.js / Angular
- Next.js (SSR recommandé)
- Tailwind CSS pour le design

### Infrastructure
- **Database** : PostgreSQL 14+ (requis)
- **Cache** : Redis
- **Storage** : AWS S3 / Google Cloud Storage
- **Hosting** : AWS / Google Cloud / DigitalOcean / OVH

## 📈 Performances

### Optimisations intégrées
- Index sur les colonnes fréquemment requêtées
- Vues pré-calculées pour dashboards
- Triggers pour calculs automatiques
- Full-text search pour recherche rapide
- Support du partitionnement pour grandes tables

### Capacité estimée
- **Candidats** : 50 000+
- **Sessions QCM simultanées** : 10 000+
- **Utilisateurs simultanés** : 10 000+
- **Temps de réponse** : < 100ms (requêtes simples)

## 🧪 Tests

### Données de test
Le schéma inclut des données initiales :
- 3 rôles prédéfinis
- 6 badges de base
- 4 catégories de questions
- Configuration système par défaut

### Scripts de test fournis dans GUIDE_IMPLEMENTATION.md
- Génération de candidats fictifs
- Création de sessions QCM de test
- Population de questions

## 📞 Support et Évolution

### Pour ajouter de nouvelles fonctionnalités

1. **Nouvelle table** :
   - Créer un fichier de migration
   - Documenter dans DOCUMENTATION_BD.md
   - Mettre à jour ERD_DIAGRAM.md

2. **Nouveau badge** :
   ```sql
   INSERT INTO badges (nom, description, points_xp, ordre_affichage)
   VALUES ('Nouveau Badge', 'Description', 100, 7);
   ```

3. **Nouvelle question QCM** :
   - Via interface admin
   - Ou directement en SQL (voir GUIDE_IMPLEMENTATION.md)

### Versioning
Suivez le Semantic Versioning (voir GUIDE_MIGRATION_DEPLOIEMENT.md) :
- `MAJOR.MINOR.PATCH`
- Exemple : 1.2.3

## 🎉 Points Forts

✅ **Architecture robuste** : 30+ tables bien structurées
✅ **Sécurité** : Chiffrement, audit, validation
✅ **Performance** : Index optimisés, cache
✅ **Scalabilité** : Partitionnement, cloud-ready
✅ **Gamification** : Badges, XP, classements
✅ **Flexibilité** : JSONB pour données évolutives
✅ **Documentation** : Exhaustive et détaillée
✅ **Production-ready** : Backup, monitoring, déploiement

## 📝 Licence et Crédits

**Projet** : Olympiades d'Intelligence Artificielle du Bénin
**Base de données** : Conçue par Claude (Anthropic)
**Version** : 1.0
**Date** : Janvier 2026

---

## 🚀 Prochaines Étapes

1. [ ] Installer PostgreSQL
2. [ ] Créer la base de données
3. [ ] Exécuter le schéma
4. [ ] Lire la documentation
5. [ ] Implémenter l'API backend
6. [ ] Développer le frontend
7. [ ] Tester en environnement de staging
8. [ ] Déployer en production
9. [ ] Configurer les backups
10. [ ] Mettre en place le monitoring

---

**Bonne chance pour le développement de la plateforme ! 🎓🚀**

Pour toute question sur la base de données, référez-vous à la documentation détaillée dans les fichiers fournis.
