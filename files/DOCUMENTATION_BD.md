# Documentation Base de Données - Olympiades d'IA du Bénin

## Vue d'ensemble

Cette base de données PostgreSQL a été conçue pour gérer l'ensemble de la plateforme des Olympiades d'Intelligence Artificielle du Bénin. Elle couvre :
- La gestion des utilisateurs (candidats et administrateurs)
- Le processus de sélection sur 6 phases
- Le système de QCM chronométré
- La gamification (badges, XP, classements)
- Le contenu institutionnel
- Les statistiques et analytics

---

## Architecture générale

### Organisation en 13 modules

1. **Gestion des utilisateurs et authentification**
2. **Éditions et phases de sélection**
3. **Système de QCM**
4. **Évaluations par phase**
5. **Gamification**
6. **Contenu et communication**
7. **Notifications et messages**
8. **Historique et audit**
9. **Statistiques et KPI**
10. **Configuration système**
11. **Triggers et fonctions**
12. **Vues utiles**
13. **Index d'optimisation**

---

## 1. Module Utilisateurs et Authentification

### Table `roles`
Définit les rôles disponibles dans le système.

**Colonnes principales :**
- `nom` : candidat, administrateur, super_admin
- Extensible pour ajouter de nouveaux rôles

### Table `utilisateurs`
Table centrale pour l'authentification de tous les utilisateurs.

**Points clés :**
- Utilise UUID pour les identifiants (meilleure sécurité et distribution)
- Stockage du hash du mot de passe (jamais en clair)
- Système de vérification d'email par code OTP
- Support de l'authentification à deux facteurs (2FA) optionnelle
- Tracking de la dernière connexion

**Champs de sécurité :**
```sql
mot_de_passe_hash    -- Hash bcrypt recommandé
code_verification    -- Code OTP à 6 chiffres
code_verification_expire_at  -- Expiration du code
deux_facteurs_active -- Activation 2FA
secret_2fa          -- Clé secrète TOTP
```

### Table `etablissements`
Référentiel des établissements scolaires du Bénin.

**Structure géographique :**
- Région → Département → Ville
- Permet des statistiques géographiques précises

**Contrainte d'unicité :**
- Combinaison (nom, ville) pour éviter les doublons

### Table `candidats`
Profil détaillé de chaque candidat (élève).

**Sections d'information :**
1. **Identité** : nom, prénoms, date de naissance, genre, photo
2. **Contact** : téléphone, email, adresse
3. **Parent/Tuteur** : obligatoire pour les mineurs
4. **Scolaire** : établissement, classe, niveau, moyennes
5. **Documents** : 3 bulletins scolaires (URLs)
6. **Statut** : suivi de la candidature

**Workflow du statut :**
```
inscription → en_attente → validé → sélectionné
                      ↓
                   rejeté
```

### Table `administrateurs`
Profil des gestionnaires de la plateforme.

**Permissions JSONB :**
Permet une gestion fine et flexible des droits :
```json
{
  "gestion_candidats": true,
  "gestion_qcm": true,
  "gestion_contenu": true,
  "acces_statistiques": true,
  "gestion_utilisateurs": false
}
```

---

## 2. Module Éditions et Phases

### Table `editions`
Représente chaque édition annuelle des Olympiades.

**Exemple d'édition :**
```sql
INSERT INTO editions (annee, titre, pays_hote, date_debut, date_fin)
VALUES (2026, 'Olympiades IA Bénin 2026', 'Maroc', '2026-01-01', '2026-12-31');
```

### Table `phases`
Les 6 phases de sélection pour chaque édition.

**Structure typique des phases :**
1. Phase 1 : Inscription et validation du dossier
2. Phase 2 : QCM de logique
3. Phase 3 : Évaluation du dossier scolaire
4. Phase 4 : Sélection régionale
5. Phase 5 : Sélection nationale
6. Phase 6 : Préparation finale

**Critères JSONB :**
Stockage flexible des critères de sélection :
```json
{
  "score_qcm_minimum": 12,
  "moyenne_generale_minimum": 12,
  "pourcentage_selectiones": 20
}
```

---

## 3. Module QCM

### Architecture du QCM

Le système de QCM est conçu pour être :
- **Sécurisé** : détection de triche, anti-copie
- **Équitable** : tirage aléatoire, questions non répétées
- **Performant** : correction automatique instantanée

### Table `categories_questions`
Classification des questions par thème.

**Catégories de base :**
- Logique
- Mathématiques
- Algorithmique
- Raisonnement spatial

### Table `questions`
Banque de questions du QCM.

**Structure des options (JSONB) :**
```json
[
  {"lettre": "A", "texte": "Paris"},
  {"lettre": "B", "texte": "Londres"},
  {"lettre": "C", "texte": "Berlin"},
  {"lettre": "D", "texte": "Madrid"}
]
```

**Niveau de difficulté :** 1 (facile) à 5 (très difficile)

**Statistiques intégrées :**
- `fois_utilisee` : nombre d'utilisations
- `taux_reussite` : pourcentage de bonnes réponses

### Table `configuration_qcm`
Paramètres globaux du QCM par édition.

**Paramètres configurables :**
```sql
duree_minutes = 30
nombre_questions = 5
score_minimum = 10.0
mode_plein_ecran = TRUE
detection_triche = TRUE
```

### Table `sessions_qcm`
Chaque passage de QCM par un candidat.

**Workflow d'une session :**
1. Création de la session (statut = `en_cours`)
2. Tirage de 5 questions aléatoires
3. Candidat répond aux questions
4. Fin automatique ou manuelle
5. Calcul du score (trigger automatique)
6. Attribution des badges

**Détection de triche :**
- Comptage des changements d'onglet
- Comptage des sorties du mode plein écran
- Stockage de l'IP et user agent

### Table `sessions_questions`
Questions spécifiques tirées pour chaque session.

**Garantie d'unicité :** Un candidat ne peut pas avoir la même question deux fois dans une session (contrainte UNIQUE).

**Métriques par question :**
- Réponse donnée
- Correcte ou non
- Temps de réponse en secondes

---

## 4. Module Évaluations

### Table `evaluations_phases`
Évaluation complète d'un candidat pour une phase donnée.

**Calcul du score total :**
```
score_total = (score_qcm × poids_qcm) + (score_dossier × poids_dossier)
```

**Résultats possibles :**
- `qualifié` : passe à la phase suivante
- `éliminé` : ne passe pas
- `liste_attente` : peut passer si des places se libèrent

---

## 5. Module Gamification

### Table `badges`
Badges prédéfinis avec possibilité d'extension.

**Badges initiaux :**
| Nom | Description | XP |
|-----|-------------|-----|
| Bienvenue | Inscription complétée | 10 |
| Premier pas | QCM complété | 50 |
| Top 10% | Classé dans les 10% meilleurs | 100 |
| Perfectionniste | Score parfait au QCM | 200 |
| Rapide | QCM en moins de 15 min | 75 |
| Persévérant | 7 jours de connexion consécutifs | 150 |

**Extensibilité :**
Ajoutez facilement de nouveaux badges :
```sql
INSERT INTO badges (nom, description, points_xp, ordre_affichage)
VALUES ('Champion régional', 'Premier de votre région', 300, 7);
```

### Table `candidats_badges`
Liaison entre candidats et badges obtenus.

**Attribution automatique :**
Des triggers attribuent automatiquement certains badges :
- Badge "Bienvenue" à l'inscription
- Badge "Premier pas" à la fin du QCM
- Badge "Perfectionniste" si score parfait

### Table `candidats_xp`
Système de points d'expérience.

**Calcul du niveau :**
Vous pouvez implémenter une fonction pour calculer le niveau basé sur les XP :
```sql
niveau = FLOOR(SQRT(total_xp / 100)) + 1
```

### Table `classement_regional`
Classement des candidats par région et au niveau national.

**Mise à jour :**
À actualiser périodiquement (par exemple après chaque phase) via un job planifié.

---

## 6. Module Contenu

### Table `actualites`
Blog et actualités du site vitrine.

**Workflow de publication :**
1. Création en mode `brouillon`
2. Révision par un admin
3. Publication (statut = `publié`)
4. Archivage éventuel

**SEO :**
- Champ `slug` pour URLs propres
- Champ `resume` pour meta description

### Table `faq`
Questions fréquemment posées.

**Organisation :**
- Catégorisation pour grouper les questions
- Ordre d'affichage personnalisable

### Table `partenaires`
Logos et informations des partenaires.

**Types de partenaires :**
- Institutionnel (ministères, universités)
- Financier (sponsors)
- Technique (fournisseurs tech)
- Media (couverture médiatique)

### Table `medias`
Gestion centralisée de tous les fichiers uploadés.

**Métadonnées stockées :**
- Type MIME
- Taille en octets
- Auteur de l'upload
- Édition associée

### Table `temoignages`
Témoignages des anciens participants.

**Workflow d'approbation :**
```
en_attente → approuvé (affiché sur le site)
          → rejeté (non affiché)
```

---

## 7. Module Notifications

### Table `notifications`
Notifications in-app pour les utilisateurs.

**Types de notifications :**
- Inscription validée
- Nouvelle phase ouverte
- Résultats disponibles
- Badge obtenu
- Message reçu

**Niveaux de priorité :**
- `basse` : informations générales
- `normale` : notifications standards
- `haute` : actions requises
- `urgente` : échéances imminentes

### Table `messages`
Messages directs de l'administration aux candidats.

**Différence avec notifications :**
- Messages : communication personnalisée, bi-directionnelle
- Notifications : alertes système, uni-directionnelles

### Table `templates_emails`
Templates pour les emails automatiques.

**Variables dynamiques :**
```json
{
  "variables": [
    "{{nom_candidat}}",
    "{{prenom_candidat}}",
    "{{score_qcm}}",
    "{{lien_dashboard}}"
  ]
}
```

**Usage :**
```python
# Exemple en Python
template = get_template('bienvenue')
email_body = template.render(nom_candidat="Kofi", prenom_candidat="Jean")
send_email(to=candidat.email, subject=template.sujet, body=email_body)
```

---

## 8. Module Audit

### Table `audit_log`
Journal de toutes les actions critiques.

**Actions tracées :**
- Modifications de profil candidat
- Validation/rejet de candidatures
- Modification de questions
- Attribution manuelle de badges
- Changements de configuration

**Structure JSONB :**
```json
{
  "anciennes_valeurs": {"statut": "en_attente"},
  "nouvelles_valeurs": {"statut": "validé", "commentaire": "Dossier complet"}
}
```

**Retention :**
Conserver au moins 2 ans pour conformité RGPD et traçabilité.

---

## 9. Module Statistiques

### Table `statistiques_globales`
Pré-calcul des statistiques pour performances.

**Fréquence de mise à jour :**
- Quotidienne pour suivi en temps réel
- Hebdomadaire pour archivage

**Stockage JSONB pour flexibilité :**
```json
{
  "candidats_par_region": {
    "Atlantique": 450,
    "Littoral": 380,
    "Ouémé": 320
  }
}
```

**Requête d'exemple :**
```sql
-- Évolution du nombre de candidats sur 7 jours
SELECT date_calcul, total_candidats
FROM statistiques_globales
WHERE edition_id = 1
  AND date_calcul >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY date_calcul;
```

---

## 10. Triggers et Automatisations

### Trigger : Attribution du badge "Bienvenue"
**Déclenché** : À la création d'un candidat
**Action** : 
- Attribue automatiquement le badge id=1
- Initialise les XP à 10 points

### Trigger : Calcul automatique du score QCM
**Déclenché** : Quand une session passe au statut "terminé"
**Actions** :
1. Compte les réponses correctes
2. Calcule le score en %
3. Calcule la note sur 20
4. Attribue le badge "Premier pas"
5. Ajoute 50 XP
6. Vérifie et attribue "Perfectionniste" si score parfait
7. Vérifie et attribue "Rapide" si < 15 minutes

**Code simplifié :**
```sql
score = (reponses_correctes / total_questions) × 100
note_sur_20 = (reponses_correctes / total_questions) × 20
```

### Trigger : Mise à jour du timestamp
Appliqué sur toutes les tables avec `updated_at`.
Garantit que le champ est toujours à jour automatiquement.

---

## 11. Vues Utiles

### Vue `vue_tableau_bord_candidat`
Dashboard complet pour l'interface candidat.

**Usage frontend :**
```sql
SELECT * FROM vue_tableau_bord_candidat WHERE id = '...';
```

**Données retournées :**
- Informations personnelles
- Établissement et région
- Score QCM
- XP et niveau
- Nombre de badges

### Vue `vue_stats_par_region`
Statistiques agrégées par région.

**Usage dans l'admin :**
Affichage d'une carte interactive avec stats par région.

### Vue `vue_classement_national`
Classement en temps réel.

**Utilise les fonctions de fenêtrage PostgreSQL :**
- `RANK()` pour le classement national
- `PARTITION BY` pour le classement régional

---

## 12. Index et Performances

### Stratégie d'indexation

**Index sur colonnes fréquemment filtrées :**
- Statuts (candidat, QCM, phase)
- Dates (sessions, notifications)
- Références étrangères

**Index composites :**
```sql
-- Pour les requêtes de notifications non lues
CREATE INDEX idx_notifications_destinataire 
ON notifications(destinataire_id, lue);
```

**Full-text search :**
```sql
-- Recherche de candidats par nom
SELECT * FROM candidats 
WHERE to_tsvector('french', nom || ' ' || prenoms) 
      @@ to_tsquery('french', 'jean');
```

---

## 13. Sécurité et Bonnes Pratiques

### Mots de passe
- **Jamais en clair** : toujours hasher (bcrypt recommandé)
- Utiliser `pgcrypto` pour les fonctions de chiffrement
- Salt automatique avec bcrypt

### UUID vs SERIAL
**Pourquoi UUID pour les utilisateurs ?**
- Empêche l'énumération (sécurité)
- Distribution uniforme (scalabilité)
- Pas de collision en cas de merge de bases

**Pourquoi SERIAL pour les autres ?**
- Plus performant pour les jointures
- Plus compact (4 ou 8 octets vs 16)
- Pas de besoin de distribution

### JSONB vs Colonnes
**Utiliser JSONB quand :**
- Structure flexible nécessaire
- Données peu requêtées
- Évolution fréquente du schéma

**Utiliser des colonnes quand :**
- Données fortement requêtées
- Besoin d'index performants
- Intégrité référentielle nécessaire

### Soft Delete vs Hard Delete
**Dans ce schéma :**
- Utilisateurs/Candidats : soft delete recommandé (champ `statut`)
- Autres données : hard delete acceptable avec `ON DELETE CASCADE`

---

## 14. Requêtes Courantes

### Candidats éligibles pour une phase
```sql
SELECT c.id, c.nom, c.prenoms, sq.note_sur_20
FROM candidats c
JOIN sessions_qcm sq ON c.id = sq.candidat_id
WHERE sq.statut = 'termine'
  AND sq.note_sur_20 >= 12
  AND c.statut_candidature = 'valide'
ORDER BY sq.note_sur_20 DESC;
```

### Top 10% des candidats
```sql
WITH classement AS (
  SELECT 
    c.id,
    c.nom,
    c.prenoms,
    sq.note_sur_20,
    PERCENT_RANK() OVER (ORDER BY sq.note_sur_20 DESC) as percentile
  FROM candidats c
  JOIN sessions_qcm sq ON c.id = sq.candidat_id
  WHERE sq.statut = 'termine'
)
SELECT * FROM classement
WHERE percentile <= 0.1;
```

### Statistiques QCM par catégorie
```sql
SELECT 
  cq.nom as categorie,
  COUNT(DISTINCT sq.question_id) as nb_questions_utilisees,
  AVG(CASE WHEN sq.est_correcte THEN 1 ELSE 0 END) * 100 as taux_reussite
FROM sessions_questions sq
JOIN questions q ON sq.question_id = q.id
JOIN categories_questions cq ON q.categorie_id = cq.id
GROUP BY cq.nom;
```

### Candidats inactifs (pas de QCM passé)
```sql
SELECT c.id, c.nom, c.prenoms, c.email, u.created_at
FROM candidats c
JOIN utilisateurs u ON c.id = u.id
LEFT JOIN sessions_qcm sq ON c.id = sq.candidat_id
WHERE sq.id IS NULL
  AND u.created_at < CURRENT_TIMESTAMP - INTERVAL '7 days';
```

---

## 15. Migrations et Évolutions

### Gestion des versions
Utiliser un outil comme **Flyway** ou **Liquibase** pour versioner les migrations.

**Exemple de structure :**
```
migrations/
  V1__initial_schema.sql
  V2__add_badges_table.sql
  V3__add_gamification_triggers.sql
```

### Rollback
Toujours créer des migrations DOWN :
```sql
-- V2__add_badges_table_down.sql
DROP TABLE IF EXISTS candidats_badges;
DROP TABLE IF EXISTS badges;
```

### Backup
**Stratégie recommandée :**
- Backup complet quotidien
- Backup incrémental toutes les heures
- Rétention : 30 jours
- Test de restauration mensuel

**Commande PostgreSQL :**
```bash
pg_dump -U postgres olympiades_ia > backup_$(date +%Y%m%d).sql
```

---

## 16. Monitoring et Maintenance

### Requêtes lentes
Activer le log des requêtes lentes :
```sql
ALTER SYSTEM SET log_min_duration_statement = 1000; -- 1 seconde
SELECT pg_reload_conf();
```

### Vacuum et Analyze
Planifier des maintenances régulières :
```sql
-- Toutes les semaines
VACUUM ANALYZE;

-- Sur des tables spécifiques très utilisées
VACUUM ANALYZE sessions_qcm;
VACUUM ANALYZE candidats;
```

### Taille des tables
Surveiller la croissance :
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 17. Conformité RGPD

### Données personnelles
**Tables concernées :**
- `candidats` : toutes les colonnes
- `utilisateurs` : email
- `messages`, `notifications`

### Droits des utilisateurs
**Droit d'accès :**
```sql
-- Export de toutes les données d'un candidat
SELECT json_build_object(
  'profil', (SELECT row_to_json(c.*) FROM candidats c WHERE id = '...'),
  'sessions_qcm', (SELECT json_agg(sq.*) FROM sessions_qcm sq WHERE candidat_id = '...'),
  'badges', (SELECT json_agg(b.*) FROM candidats_badges cb JOIN badges b ON cb.badge_id = b.id WHERE cb.candidat_id = '...')
);
```

**Droit à l'oubli :**
```sql
-- Anonymisation (préférable à la suppression totale pour les stats)
UPDATE candidats 
SET nom = 'Anonymisé',
    prenoms = 'Anonymisé',
    email = 'anonymise_' || id || '@example.com',
    telephone = NULL,
    adresse = NULL,
    photo_url = NULL
WHERE id = '...';
```

### Durée de conservation
- Candidats actifs : durée du programme
- Candidats éliminés : 1 an après la fin de l'édition
- Logs d'audit : 2 ans minimum

---

## 18. Tests et Validation

### Jeu de données de test
```sql
-- Insérer des candidats de test
INSERT INTO etablissements (nom, type, ville, region)
VALUES ('CEG Test', 'CEG', 'Cotonou', 'Littoral');

-- Créer 100 candidats fictifs
INSERT INTO utilisateurs (email, mot_de_passe_hash, role_id)
SELECT 
  'candidat' || generate_series || '@test.com',
  crypt('password123', gen_salt('bf')),
  1
FROM generate_series(1, 100);
```

### Tests de performance
```sql
-- Simuler 1000 sessions QCM
INSERT INTO sessions_qcm (candidat_id, edition_id, statut, score, note_sur_20)
SELECT 
  id,
  1,
  'termine',
  random() * 100,
  random() * 20
FROM candidats
LIMIT 1000;
```

---

## Conclusion

Ce schéma de base de données a été conçu pour être :
- **Robuste** : contraintes d'intégrité, types appropriés
- **Sécurisé** : audit, chiffrement, validation
- **Performant** : index optimisés, vues matérialisées possibles
- **Évolutif** : structure modulaire, JSONB pour flexibilité
- **Maintenable** : triggers automatiques, documentation complète

### Prochaines étapes recommandées
1. ✅ Valider le schéma avec l'équipe
2. 🔧 Créer les scripts de migration
3. 🧪 Générer des données de test
4. 📊 Implémenter les dashboards
5. 🔐 Configurer les backups
6. 📈 Mettre en place le monitoring

### Support et évolution
Pour toute question ou évolution future, documenter :
- Les choix de conception dans un wiki
- Les requêtes complexes dans un repository
- Les performances dans un tableau de bord dédié
