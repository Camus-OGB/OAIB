# Guide de Migration et Déploiement - Olympiades d'IA du Bénin

## Table des matières
1. [Stratégie de Migration](#migration)
2. [Gestion des Versions](#versions)
3. [Environnements](#environnements)
4. [Déploiement Cloud](#deploiement)
5. [Backup et Restauration](#backup)
6. [Monitoring](#monitoring)
7. [Optimisations](#optimisations)

---

## 1. Stratégie de Migration {#migration}

### Structure des fichiers de migration

```
migrations/
├── V1_0__initial_schema.sql
├── V1_1__add_gamification.sql
├── V1_2__add_audit_log.sql
├── V2_0__add_mobile_features.sql
└── rollback/
    ├── V1_1__rollback.sql
    ├── V1_2__rollback.sql
    └── V2_0__rollback.sql
```

### Migration initiale (V1.0)

**V1_0__initial_schema.sql**
```sql
-- Cette migration contient le schéma complet de base
-- (c'est le fichier olympiades_ia_schema.sql)
```

### Exemple de migration additionnelle (V1.1)

**V1_1__add_notifications_push.sql**
```sql
-- Migration V1.1 : Ajout des notifications push
-- Date : 2026-02-15
-- Auteur : Équipe Dev

BEGIN;

-- Ajouter une table pour les tokens de notifications push
CREATE TABLE notification_tokens (
    id SERIAL PRIMARY KEY,
    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    platform VARCHAR(20) CHECK (platform IN ('ios', 'android', 'web')),
    token TEXT NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(utilisateur_id, platform, token)
);

-- Index pour performances
CREATE INDEX idx_notification_tokens_user ON notification_tokens(utilisateur_id);
CREATE INDEX idx_notification_tokens_actif ON notification_tokens(actif);

-- Ajouter une colonne pour tracer les notifications push envoyées
ALTER TABLE notifications 
ADD COLUMN push_envoye BOOLEAN DEFAULT FALSE,
ADD COLUMN push_envoye_at TIMESTAMP;

-- Commentaire
COMMENT ON TABLE notification_tokens IS 'Tokens FCM/APNs pour notifications push';

-- Insertion dans le log de migration
INSERT INTO schema_migrations (version, description, applied_at)
VALUES ('1.1', 'Ajout notifications push', NOW());

COMMIT;
```

**Rollback correspondant (V1_1__rollback.sql)**
```sql
BEGIN;

DROP TABLE IF EXISTS notification_tokens;

ALTER TABLE notifications 
DROP COLUMN IF EXISTS push_envoye,
DROP COLUMN IF EXISTS push_envoye_at;

DELETE FROM schema_migrations WHERE version = '1.1';

COMMIT;
```

### Table de suivi des migrations

```sql
-- À créer avant toute migration
CREATE TABLE schema_migrations (
    id SERIAL PRIMARY KEY,
    version VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied_by VARCHAR(100) DEFAULT CURRENT_USER
);
```

### Script d'application de migrations

**migrate.sh**
```bash
#!/bin/bash

# Configuration
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="olympiades_ia"
DB_USER="olympiades_user"
MIGRATIONS_DIR="./migrations"

# Couleurs pour les logs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Olympiades IA - Migration Database ===${NC}"

# Vérifier la connexion
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Impossible de se connecter à la base de données${NC}"
    exit 1
fi

# Créer la table de migrations si elle n'existe pas
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    version VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied_by VARCHAR(100) DEFAULT CURRENT_USER
);" > /dev/null 2>&1

# Lister les migrations disponibles
MIGRATIONS=($(ls $MIGRATIONS_DIR/V*.sql | sort -V))

echo "Migrations disponibles : ${#MIGRATIONS[@]}"

# Appliquer chaque migration
for migration in "${MIGRATIONS[@]}"; do
    VERSION=$(basename "$migration" | sed 's/V\(.*\)__.*/\1/')
    DESCRIPTION=$(basename "$migration" | sed 's/V.*__\(.*\)\.sql/\1/' | tr '_' ' ')
    
    # Vérifier si déjà appliquée
    ALREADY_APPLIED=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
        SELECT COUNT(*) FROM schema_migrations WHERE version = '$VERSION';
    " | tr -d ' ')
    
    if [ "$ALREADY_APPLIED" -gt 0 ]; then
        echo -e "${YELLOW}⏭️  Migration v$VERSION déjà appliquée${NC}"
        continue
    fi
    
    echo -e "${GREEN}📦 Application de la migration v$VERSION...${NC}"
    
    # Appliquer la migration
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$migration"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Migration v$VERSION appliquée avec succès${NC}"
    else
        echo -e "${RED}❌ Erreur lors de l'application de la migration v$VERSION${NC}"
        exit 1
    fi
done

echo -e "${GREEN}=== Toutes les migrations ont été appliquées ===${NC}"
```

**Rendre le script exécutable :**
```bash
chmod +x migrate.sh
```

**Exécuter les migrations :**
```bash
./migrate.sh
```

---

## 2. Gestion des Versions {#versions}

### Semantic Versioning

**Format : MAJOR.MINOR.PATCH**

- **MAJOR** : Changements incompatibles (breaking changes)
- **MINOR** : Nouvelles fonctionnalités (rétrocompatibles)
- **PATCH** : Corrections de bugs

**Exemples :**
- `1.0.0` : Version initiale en production
- `1.1.0` : Ajout des notifications push
- `1.1.1` : Correction d'un bug dans les notifications
- `2.0.0` : Refonte majeure de la structure QCM

### Changelog

**CHANGELOG.md**
```markdown
# Changelog - Base de données Olympiades IA

## [1.2.0] - 2026-03-01
### Ajouté
- Table `application_mobile_stats` pour tracking analytics mobile
- Colonne `derniere_sync` dans table `candidats`

### Modifié
- Index optimisés sur table `sessions_qcm`
- Trigger `calculer_score_qcm` amélioré pour performances

### Corrigé
- Bug dans calcul du classement régional quand égalité de scores

## [1.1.0] - 2026-02-15
### Ajouté
- Système de notifications push
- Table `notification_tokens`

## [1.0.0] - 2026-01-20
### Ajouté
- Schéma initial complet
- Toutes les tables de base
- Triggers automatiques
- Vues pour dashboards
```

---

## 3. Environnements {#environnements}

### Configuration par environnement

**config/database.dev.js**
```javascript
module.exports = {
  host: 'localhost',
  port: 5432,
  database: 'olympiades_ia_dev',
  username: 'dev_user',
  password: 'dev_password',
  logging: console.log, // Logs SQL activés
  pool: {
    max: 5,
    min: 1
  }
};
```

**config/database.staging.js**
```javascript
module.exports = {
  host: process.env.DB_HOST,
  port: 5432,
  database: 'olympiades_ia_staging',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false,
  ssl: {
    rejectUnauthorized: false
  },
  pool: {
    max: 20,
    min: 5
  }
};
```

**config/database.prod.js**
```javascript
module.exports = {
  host: process.env.DB_HOST,
  port: 5432,
  database: 'olympiades_ia_prod',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('/path/to/ca-certificate.crt').toString()
  },
  pool: {
    max: 50,
    min: 10,
    acquire: 30000,
    idle: 10000
  }
};
```

### Données de test (seeding)

**seeds/01-roles.sql**
```sql
INSERT INTO roles (nom, description) VALUES 
    ('candidat', 'Élève participant aux olympiades'),
    ('administrateur', 'Gestionnaire de la plateforme'),
    ('super_admin', 'Administrateur principal')
ON CONFLICT (nom) DO NOTHING;
```

**seeds/02-etablissements.sql**
```sql
INSERT INTO etablissements (nom, type, ville, departement, region) VALUES
    ('CEG Gbegamey', 'CEG', 'Cotonou', 'Littoral', 'Littoral'),
    ('Lycée Mathieu Bouké', 'Lycée', 'Parakou', 'Borgou', 'Borgou'),
    ('Collège CEG Dantokpa', 'CEG', 'Cotonou', 'Littoral', 'Littoral'),
    ('Lycée Technique Coulibaly', 'Lycée', 'Cotonou', 'Littoral', 'Littoral'),
    ('CEG Abomey-Calavi', 'CEG', 'Abomey-Calavi', 'Atlantique', 'Atlantique')
ON CONFLICT (nom, ville) DO NOTHING;
```

**seeds/03-badges.sql**
```sql
-- Déjà dans le schéma principal via INSERT
```

**seeds/04-questions-test.sql**
```sql
-- Questions de test pour le QCM
INSERT INTO questions (categorie_id, enonce, type_question, niveau_difficulte, options, reponse_correcte, statut)
VALUES
    (1, 'Si tous les A sont des B, et tous les B sont des C, alors tous les A sont des C. Cette affirmation est :', 'qcm', 2, 
     '[{"lettre":"A","texte":"Vraie"},{"lettre":"B","texte":"Fausse"},{"lettre":"C","texte":"Impossible à déterminer"}]'::jsonb,
     'A', 'active'),
    
    (1, 'Quelle est la prochaine lettre de la suite : A, C, F, J, ?', 'qcm', 3,
     '[{"lettre":"A","texte":"M"},{"lettre":"B","texte":"N"},{"lettre":"C","texte":"O"},{"lettre":"D","texte":"P"}]'::jsonb,
     'C', 'active'),
    
    (2, 'Si 5 ouvriers construisent un mur en 10 jours, combien de jours faudra-t-il à 10 ouvriers pour construire le même mur ?', 'qcm', 2,
     '[{"lettre":"A","texte":"5 jours"},{"lettre":"B","texte":"20 jours"},{"lettre":"C","texte":"10 jours"},{"lettre":"D","texte":"15 jours"}]'::jsonb,
     'A', 'active');
```

**Script de seeding**
```bash
#!/bin/bash
# seed.sh

DB_URL="postgresql://olympiades_user:password@localhost:5432/olympiades_ia_dev"

echo "🌱 Seeding de la base de données..."

for seed_file in seeds/*.sql; do
    echo "📝 Application de $(basename $seed_file)"
    psql $DB_URL -f $seed_file
done

echo "✅ Seeding terminé"
```

---

## 4. Déploiement Cloud {#deploiement}

### Option 1 : AWS RDS (PostgreSQL)

**1. Création de l'instance RDS**
```bash
aws rds create-db-instance \
    --db-instance-identifier olympiades-ia-prod \
    --db-instance-class db.t3.medium \
    --engine postgres \
    --engine-version 14.7 \
    --master-username admin_olympiades \
    --master-user-password <STRONG_PASSWORD> \
    --allocated-storage 100 \
    --storage-type gp3 \
    --storage-encrypted \
    --vpc-security-group-ids sg-xxxxxxxx \
    --db-subnet-group-name olympiades-subnet-group \
    --backup-retention-period 7 \
    --preferred-backup-window "03:00-04:00" \
    --preferred-maintenance-window "mon:04:00-mon:05:00" \
    --multi-az \
    --publicly-accessible false
```

**2. Configuration du groupe de sécurité**
```bash
# Autoriser uniquement les serveurs d'application à se connecter
aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxxxxx \
    --protocol tcp \
    --port 5432 \
    --source-group sg-app-servers
```

**3. Connection string**
```
postgresql://admin_olympiades:<PASSWORD>@olympiades-ia-prod.xxxxxxxxx.eu-west-1.rds.amazonaws.com:5432/olympiades_ia
```

### Option 2 : Google Cloud SQL

**1. Création de l'instance**
```bash
gcloud sql instances create olympiades-ia-prod \
    --database-version=POSTGRES_14 \
    --tier=db-custom-4-16384 \
    --region=europe-west1 \
    --backup-start-time=03:00 \
    --enable-bin-log \
    --maintenance-window-day=MON \
    --maintenance-window-hour=4
```

**2. Création de la base de données**
```bash
gcloud sql databases create olympiades_ia \
    --instance=olympiades-ia-prod
```

**3. Création de l'utilisateur**
```bash
gcloud sql users create olympiades_user \
    --instance=olympiades-ia-prod \
    --password=<STRONG_PASSWORD>
```

### Option 3 : Hébergement VPS (DigitalOcean, OVH)

**Installation PostgreSQL sur Ubuntu 22.04**
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de PostgreSQL 14
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install postgresql-14 postgresql-contrib-14 -y

# Sécurisation
sudo -u postgres psql -c "ALTER USER postgres PASSWORD '<STRONG_PASSWORD>';"

# Configuration pour accepter les connexions externes (si besoin)
sudo nano /etc/postgresql/14/main/postgresql.conf
# Modifier : listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Ajouter : host all all 0.0.0.0/0 md5

# Redémarrage
sudo systemctl restart postgresql
```

**Firewall**
```bash
# N'autoriser que les serveurs d'application
sudo ufw allow from <IP_APP_SERVER> to any port 5432
sudo ufw enable
```

### Configuration SSL/TLS

**Générer un certificat auto-signé (dev/staging)**
```bash
sudo openssl req -new -x509 -days 365 -nodes -text \
    -out /etc/postgresql/14/main/server.crt \
    -keyout /etc/postgresql/14/main/server.key \
    -subj "/CN=olympiades-ia.local"

sudo chown postgres:postgres /etc/postgresql/14/main/server.{crt,key}
sudo chmod 600 /etc/postgresql/14/main/server.key
```

**postgresql.conf**
```conf
ssl = on
ssl_cert_file = '/etc/postgresql/14/main/server.crt'
ssl_key_file = '/etc/postgresql/14/main/server.key'
```

---

## 5. Backup et Restauration {#backup}

### Stratégie de backup

**Backup automatique quotidien**

**backup.sh**
```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/var/backups/postgresql"
DB_NAME="olympiades_ia"
DB_USER="olympiades_user"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${DATE}.sql.gz"

# Créer le répertoire si inexistant
mkdir -p $BACKUP_DIR

# Backup
echo "🔄 Démarrage du backup de $DB_NAME..."

pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Backup réussi : $BACKUP_FILE"
    
    # Taille du backup
    SIZE=$(du -h $BACKUP_FILE | cut -f1)
    echo "📦 Taille : $SIZE"
    
    # Supprimer les backups de plus de X jours
    find $BACKUP_DIR -name "${DB_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "🧹 Anciens backups nettoyés (>$RETENTION_DAYS jours)"
else
    echo "❌ Échec du backup"
    exit 1
fi

# Upload vers S3 (optionnel)
if command -v aws &> /dev/null; then
    aws s3 cp $BACKUP_FILE s3://olympiades-ia-backups/postgresql/
    echo "☁️  Backup uploadé vers S3"
fi
```

**Automatisation avec cron**
```bash
# Éditer crontab
crontab -e

# Ajouter (backup quotidien à 3h du matin)
0 3 * * * /path/to/backup.sh >> /var/log/postgresql_backup.log 2>&1
```

### Restauration

**Restaurer depuis un backup**
```bash
#!/bin/bash
# restore.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: ./restore.sh <backup_file.sql.gz>"
    exit 1
fi

DB_NAME="olympiades_ia"
DB_USER="olympiades_user"

echo "⚠️  ATTENTION : Cette opération va écraser la base de données actuelle !"
read -p "Êtes-vous sûr ? (oui/non) : " CONFIRM

if [ "$CONFIRM" != "oui" ]; then
    echo "❌ Restauration annulée"
    exit 0
fi

echo "🔄 Restauration en cours..."

# Décompresser et restaurer
gunzip -c $BACKUP_FILE | psql -U $DB_USER -h localhost $DB_NAME

if [ $? -eq 0 ]; then
    echo "✅ Restauration réussie"
else
    echo "❌ Échec de la restauration"
    exit 1
fi
```

### Backup incrémental avec WAL

**Configuration dans postgresql.conf**
```conf
wal_level = replica
archive_mode = on
archive_command = 'test ! -f /var/lib/postgresql/archive/%f && cp %p /var/lib/postgresql/archive/%f'
max_wal_senders = 3
```

---

## 6. Monitoring {#monitoring}

### Métriques à surveiller

**1. Performances de la base**
```sql
-- Requêtes lentes (> 1 seconde)
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
WHERE mean_time > 1000
ORDER BY total_time DESC
LIMIT 20;
```

**2. Taille des tables**
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;
```

**3. Connexions actives**
```sql
SELECT 
    datname,
    usename,
    application_name,
    client_addr,
    state,
    query_start,
    state_change
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start;
```

**4. Index non utilisés**
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY schemaname, tablename;
```

### Script de monitoring

**monitor.sh**
```bash
#!/bin/bash

DB_NAME="olympiades_ia"
DB_USER="olympiades_user"
ALERT_EMAIL="admin@olympiades-ia-benin.org"

# Vérifier la connexion
psql -U $DB_USER -d $DB_NAME -c "SELECT 1" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ ALERTE : Impossible de se connecter à la base" | mail -s "ALERTE DB" $ALERT_EMAIL
    exit 1
fi

# Vérifier l'espace disque
DISK_USAGE=$(df -h /var/lib/postgresql | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠️  ALERTE : Espace disque à ${DISK_USAGE}%" | mail -s "ALERTE Espace Disque" $ALERT_EMAIL
fi

# Vérifier le nombre de connexions
CONNECTIONS=$(psql -U $DB_USER -d $DB_NAME -t -c "SELECT count(*) FROM pg_stat_activity;")
if [ $CONNECTIONS -gt 80 ]; then
    echo "⚠️  ALERTE : $CONNECTIONS connexions actives" | mail -s "ALERTE Connexions" $ALERT_EMAIL
fi

echo "✅ Monitoring OK - $(date)"
```

### Dashboards avec Grafana + Prometheus

**Installation de postgres_exporter**
```bash
# Télécharger
wget https://github.com/prometheus-community/postgres_exporter/releases/download/v0.11.1/postgres_exporter-0.11.1.linux-amd64.tar.gz
tar xvfz postgres_exporter-*.tar.gz
cd postgres_exporter-*/

# Configuration
export DATA_SOURCE_NAME="postgresql://olympiades_user:password@localhost:5432/olympiades_ia?sslmode=disable"

# Lancer
./postgres_exporter &
```

**prometheus.yml**
```yaml
scrape_configs:
  - job_name: 'postgresql'
    static_configs:
      - targets: ['localhost:9187']
```

---

## 7. Optimisations {#optimisations}

### Paramètres PostgreSQL recommandés

**postgresql.conf (pour serveur 8GB RAM)**
```conf
# Mémoire
shared_buffers = 2GB
effective_cache_size = 6GB
maintenance_work_mem = 512MB
work_mem = 32MB

# Checkpoint
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100

# Parallélisation
max_worker_processes = 4
max_parallel_workers_per_gather = 2
max_parallel_workers = 4

# Planner
random_page_cost = 1.1  # Si SSD
effective_io_concurrency = 200

# Logging
log_min_duration_statement = 1000  # Log requêtes > 1s
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on
```

### VACUUM et ANALYZE

**Configuration auto-vacuum**
```conf
autovacuum = on
autovacuum_max_workers = 3
autovacuum_naptime = 1min
autovacuum_vacuum_threshold = 50
autovacuum_analyze_threshold = 50
```

**VACUUM manuel hebdomadaire**
```bash
#!/bin/bash
# vacuum.sh

psql -U olympiades_user -d olympiades_ia <<EOF
VACUUM VERBOSE ANALYZE candidats;
VACUUM VERBOSE ANALYZE sessions_qcm;
VACUUM VERBOSE ANALYZE sessions_questions;
VACUUM VERBOSE ANALYZE evaluations_phases;
VACUUM VERBOSE ANALYZE notifications;
REINDEX DATABASE olympiades_ia;
EOF
```

### Partitionnement (pour grandes tables)

**Exemple : Partitionner audit_log par mois**
```sql
-- Convertir la table en table partitionnée
BEGIN;

-- Renommer la table existante
ALTER TABLE audit_log RENAME TO audit_log_old;

-- Créer la table partitionnée
CREATE TABLE audit_log (
    id SERIAL,
    utilisateur_id UUID,
    action VARCHAR(100) NOT NULL,
    table_affectee VARCHAR(100),
    enregistrement_id VARCHAR(100),
    anciennes_valeurs JSONB,
    nouvelles_valeurs JSONB,
    adresse_ip INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- Créer les partitions par mois
CREATE TABLE audit_log_2026_01 PARTITION OF audit_log
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE audit_log_2026_02 PARTITION OF audit_log
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- ... créer les autres mois

-- Migrer les données
INSERT INTO audit_log SELECT * FROM audit_log_old;

-- Supprimer l'ancienne table
DROP TABLE audit_log_old;

COMMIT;
```

### Cache avec Redis

**Exemples de données à cacher**
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cacher le classement national (expire après 1 heure)
async function getClassementNational() {
  const cacheKey = 'classement:national';
  
  // Essayer le cache
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Sinon, requête DB
  const classement = await sequelize.query(`
    SELECT * FROM vue_classement_national
    LIMIT 100
  `, { type: sequelize.QueryTypes.SELECT });
  
  // Mettre en cache
  await client.setEx(cacheKey, 3600, JSON.stringify(classement));
  
  return classement;
}
```

---

## Checklist de Déploiement

### Avant le déploiement

- [ ] Tests de migration sur environnement de staging
- [ ] Backup complet de la base de production
- [ ] Tests de performance effectués
- [ ] Documentation à jour
- [ ] Scripts de rollback préparés
- [ ] Équipe prévenue de la maintenance

### Pendant le déploiement

- [ ] Mettre le site en mode maintenance
- [ ] Arrêter les workers et jobs
- [ ] Backup de sécurité
- [ ] Appliquer les migrations
- [ ] Vérifier l'intégrité des données
- [ ] Tests de fumée (smoke tests)
- [ ] Relancer les services

### Après le déploiement

- [ ] Monitoring actif pendant 24h
- [ ] Vérifier les logs d'erreurs
- [ ] Tester les fonctionnalités critiques
- [ ] Communiquer la fin de maintenance
- [ ] Post-mortem si problèmes

---

## Conclusion

Ce guide couvre :
- ✅ Stratégie de migration robuste
- ✅ Gestion des environnements
- ✅ Déploiement sur différents clouds
- ✅ Backup et restauration
- ✅ Monitoring et optimisations

La base de données est maintenant prête pour un déploiement en production sécurisé et performant !
