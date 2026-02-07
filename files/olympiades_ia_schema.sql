-- ============================================================================
-- SCHÉMA DE BASE DE DONNÉES - OLYMPIADES D'IA DU BÉNIN
-- PostgreSQL 14+
-- Version 1.0 - Janvier 2026
-- ============================================================================

-- Extensions utiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. GESTION DES UTILISATEURS ET AUTHENTIFICATION
-- ============================================================================

-- Table des rôles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des rôles de base
INSERT INTO roles (nom, description) VALUES 
    ('candidat', 'Élève participant aux olympiades'),
    ('administrateur', 'Gestionnaire de la plateforme'),
    ('super_admin', 'Administrateur principal avec tous les droits');

-- Table des utilisateurs (base commune)
CREATE TABLE utilisateurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id) NOT NULL,
    statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'suspendu')),
    email_verifie BOOLEAN DEFAULT FALSE,
    code_verification VARCHAR(6),
    code_verification_expire_at TIMESTAMP,
    deux_facteurs_active BOOLEAN DEFAULT FALSE,
    secret_2fa VARCHAR(255),
    derniere_connexion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des établissements scolaires
CREATE TABLE etablissements (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('CEG', 'Lycée', 'Collège', 'Privé', 'Autre')),
    ville VARCHAR(100),
    departement VARCHAR(100),
    region VARCHAR(100),
    adresse TEXT,
    telephone VARCHAR(20),
    email VARCHAR(255),
    statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(nom, ville)
);

-- Table des candidats (profil détaillé)
CREATE TABLE candidats (
    id UUID PRIMARY KEY REFERENCES utilisateurs(id) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    prenoms VARCHAR(150) NOT NULL,
    date_naissance DATE NOT NULL,
    genre VARCHAR(10) CHECK (genre IN ('M', 'F', 'Autre')),
    photo_url VARCHAR(500),
    telephone VARCHAR(20),
    adresse TEXT,
    
    -- Informations parent/tuteur
    nom_parent VARCHAR(100),
    prenoms_parent VARCHAR(150),
    telephone_parent VARCHAR(20) NOT NULL,
    email_parent VARCHAR(255),
    
    -- Informations scolaires
    etablissement_id INTEGER REFERENCES etablissements(id),
    classe VARCHAR(50) NOT NULL,
    niveau_etudes VARCHAR(50) CHECK (niveau_etudes IN ('3ème', '2nde', '1ère', 'Tle')),
    moyenne_generale DECIMAL(4,2) CHECK (moyenne_generale >= 0 AND moyenne_generale <= 20),
    note_mathematiques DECIMAL(4,2) CHECK (note_mathematiques >= 0 AND note_mathematiques <= 20),
    note_sciences DECIMAL(4,2) CHECK (note_sciences >= 0 AND note_sciences <= 20),
    
    -- Documents
    bulletin_1_url VARCHAR(500),
    bulletin_2_url VARCHAR(500),
    bulletin_3_url VARCHAR(500),
    
    -- Statut de candidature
    statut_candidature VARCHAR(30) DEFAULT 'inscription' 
        CHECK (statut_candidature IN ('inscription', 'en_attente', 'valide', 'rejete', 'selectionne', 'elimine')),
    commentaire_admin TEXT,
    
    -- Métadonnées
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des administrateurs
CREATE TABLE administrateurs (
    id UUID PRIMARY KEY REFERENCES utilisateurs(id) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    prenoms VARCHAR(150) NOT NULL,
    fonction VARCHAR(100),
    telephone VARCHAR(20),
    permissions JSONB, -- Permissions spécifiques en JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. GESTION DES ÉDITIONS ET PHASES
-- ============================================================================

-- Table des éditions
CREATE TABLE editions (
    id SERIAL PRIMARY KEY,
    annee INTEGER UNIQUE NOT NULL,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    pays_hote VARCHAR(100),
    date_debut DATE,
    date_fin DATE,
    statut VARCHAR(20) DEFAULT 'planifiee' 
        CHECK (statut IN ('planifiee', 'en_cours', 'terminee', 'archivee')),
    nombre_participants_cible INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des phases de sélection
CREATE TABLE phases (
    id SERIAL PRIMARY KEY,
    edition_id INTEGER REFERENCES editions(id) ON DELETE CASCADE,
    numero_phase SMALLINT NOT NULL CHECK (numero_phase BETWEEN 1 AND 6),
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    criteres_selection JSONB, -- Critères détaillés en JSON
    nombre_selectiones INTEGER,
    statut VARCHAR(20) DEFAULT 'a_venir' 
        CHECK (statut IN ('a_venir', 'en_cours', 'terminee')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(edition_id, numero_phase)
);

-- ============================================================================
-- 3. SYSTÈME DE QCM
-- ============================================================================

-- Table des catégories de questions
CREATE TABLE categories_questions (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des catégories de base
INSERT INTO categories_questions (nom, description) VALUES 
    ('Logique', 'Questions de raisonnement logique'),
    ('Mathématiques', 'Questions mathématiques'),
    ('Algorithmique', 'Questions sur les algorithmes de base'),
    ('Raisonnement spatial', 'Questions de visualisation spatiale');

-- Table des questions
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    categorie_id INTEGER REFERENCES categories_questions(id),
    enonce TEXT NOT NULL,
    type_question VARCHAR(20) DEFAULT 'qcm' CHECK (type_question IN ('qcm', 'vrai_faux')),
    niveau_difficulte SMALLINT CHECK (niveau_difficulte BETWEEN 1 AND 5),
    
    -- Options de réponse (stockées en JSON)
    options JSONB NOT NULL, -- Ex: [{"lettre": "A", "texte": "..."}, {"lettre": "B", "texte": "..."}]
    reponse_correcte VARCHAR(5) NOT NULL, -- Ex: "A", "B", "C", "D"
    
    -- Médias
    image_url VARCHAR(500),
    
    -- Statistiques
    fois_utilisee INTEGER DEFAULT 0,
    taux_reussite DECIMAL(5,2),
    
    -- Métadonnées
    statut VARCHAR(20) DEFAULT 'active' CHECK (statut IN ('active', 'inactive', 'archivee')),
    creee_par UUID REFERENCES utilisateurs(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configuration du QCM
CREATE TABLE configuration_qcm (
    id SERIAL PRIMARY KEY,
    edition_id INTEGER REFERENCES editions(id),
    duree_minutes INTEGER NOT NULL DEFAULT 30,
    nombre_questions INTEGER NOT NULL DEFAULT 5,
    score_minimum DECIMAL(4,2),
    mode_plein_ecran BOOLEAN DEFAULT TRUE,
    detection_triche BOOLEAN DEFAULT TRUE,
    autoriser_reprise BOOLEAN DEFAULT FALSE,
    delai_reprise_minutes INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des sessions de QCM
CREATE TABLE sessions_qcm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidat_id UUID REFERENCES candidats(id) ON DELETE CASCADE,
    edition_id INTEGER REFERENCES editions(id),
    date_debut TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_fin TIMESTAMP,
    duree_effective_secondes INTEGER,
    score DECIMAL(5,2),
    note_sur_20 DECIMAL(4,2),
    statut VARCHAR(20) DEFAULT 'en_cours' 
        CHECK (statut IN ('en_cours', 'termine', 'abandonne', 'invalide')),
    
    -- Détection de triche
    changements_onglet INTEGER DEFAULT 0,
    sorties_plein_ecran INTEGER DEFAULT 0,
    adresse_ip INET,
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison : questions tirées pour chaque session
CREATE TABLE sessions_questions (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES sessions_qcm(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id),
    ordre_affichage SMALLINT NOT NULL,
    reponse_donnee VARCHAR(5),
    est_correcte BOOLEAN,
    temps_reponse_secondes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, question_id)
);

-- ============================================================================
-- 4. ÉVALUATIONS PAR PHASE
-- ============================================================================

-- Table des évaluations des candidats par phase
CREATE TABLE evaluations_phases (
    id SERIAL PRIMARY KEY,
    candidat_id UUID REFERENCES candidats(id) ON DELETE CASCADE,
    phase_id INTEGER REFERENCES phases(id) ON DELETE CASCADE,
    session_qcm_id UUID REFERENCES sessions_qcm(id),
    
    -- Scores et critères
    score_qcm DECIMAL(5,2),
    score_dossier DECIMAL(5,2), -- Basé sur bulletins, notes
    score_total DECIMAL(5,2),
    
    -- Résultat
    statut VARCHAR(20) DEFAULT 'en_attente' 
        CHECK (statut IN ('en_attente', 'qualifie', 'elimine', 'liste_attente')),
    rang INTEGER,
    commentaire TEXT,
    evaluateur_id UUID REFERENCES administrateurs(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(candidat_id, phase_id)
);

-- ============================================================================
-- 5. GAMIFICATION
-- ============================================================================

-- Table des badges
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icone_url VARCHAR(500),
    critere_obtention TEXT, -- Description du critère
    points_xp INTEGER DEFAULT 0,
    ordre_affichage INTEGER,
    statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des badges prédéfinis
INSERT INTO badges (nom, description, points_xp, ordre_affichage) VALUES 
    ('Bienvenue', 'Inscription complétée sur la plateforme', 10, 1),
    ('Premier pas', 'QCM complété', 50, 2),
    ('Top 10%', 'Classé dans les 10% meilleurs', 100, 3),
    ('Perfectionniste', 'Score parfait au QCM', 200, 4),
    ('Rapide', 'QCM terminé en moins de 15 minutes', 75, 5),
    ('Persévérant', 'Connexion pendant 7 jours consécutifs', 150, 6);

-- Table de liaison : badges obtenus par les candidats
CREATE TABLE candidats_badges (
    id SERIAL PRIMARY KEY,
    candidat_id UUID REFERENCES candidats(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id),
    date_obtention TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(candidat_id, badge_id)
);

-- Table des points d'expérience (XP) des candidats
CREATE TABLE candidats_xp (
    candidat_id UUID PRIMARY KEY REFERENCES candidats(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    niveau INTEGER DEFAULT 1,
    derniere_activite TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table du classement par région
CREATE TABLE classement_regional (
    id SERIAL PRIMARY KEY,
    candidat_id UUID REFERENCES candidats(id) ON DELETE CASCADE,
    edition_id INTEGER REFERENCES editions(id),
    region VARCHAR(100),
    score_total DECIMAL(5,2),
    rang_regional INTEGER,
    rang_national INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(candidat_id, edition_id)
);

-- ============================================================================
-- 6. CONTENU ET COMMUNICATION
-- ============================================================================

-- Table des actualités
CREATE TABLE actualites (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    contenu TEXT NOT NULL,
    resume TEXT,
    image_principale_url VARCHAR(500),
    categorie VARCHAR(50),
    statut VARCHAR(20) DEFAULT 'brouillon' 
        CHECK (statut IN ('brouillon', 'publie', 'archive')),
    auteur_id UUID REFERENCES administrateurs(id),
    date_publication TIMESTAMP,
    vues INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des FAQ
CREATE TABLE faq (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    reponse TEXT NOT NULL,
    categorie VARCHAR(100),
    ordre_affichage INTEGER,
    statut VARCHAR(20) DEFAULT 'active' CHECK (statut IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des partenaires
CREATE TABLE partenaires (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('institutionnel', 'financier', 'technique', 'media')),
    logo_url VARCHAR(500),
    description TEXT,
    site_web VARCHAR(255),
    ordre_affichage INTEGER,
    statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des médias (photos, vidéos, documents)
CREATE TABLE medias (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255),
    description TEXT,
    type VARCHAR(20) CHECK (type IN ('image', 'video', 'document', 'autre')),
    url VARCHAR(500) NOT NULL,
    taille_octets BIGINT,
    mime_type VARCHAR(100),
    edition_id INTEGER REFERENCES editions(id),
    uploaded_by UUID REFERENCES utilisateurs(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des témoignages
CREATE TABLE témoignages (
    id SERIAL PRIMARY KEY,
    candidat_id UUID REFERENCES candidats(id),
    edition_id INTEGER REFERENCES editions(id),
    type VARCHAR(20) CHECK (type IN ('texte', 'video')),
    contenu TEXT,
    video_url VARCHAR(500),
    photo_url VARCHAR(500),
    statut VARCHAR(20) DEFAULT 'en_attente' 
        CHECK (statut IN ('en_attente', 'approuve', 'rejete')),
    ordre_affichage INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 7. NOTIFICATIONS ET MESSAGES
-- ============================================================================

-- Table des notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    destinataire_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    lien VARCHAR(500),
    lue BOOLEAN DEFAULT FALSE,
    date_lecture TIMESTAMP,
    priorite VARCHAR(20) DEFAULT 'normale' 
        CHECK (priorite IN ('basse', 'normale', 'haute', 'urgente')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour performances
CREATE INDEX idx_notifications_destinataire ON notifications(destinataire_id, lue);

-- Table des messages officiels
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    expediteur_id UUID REFERENCES administrateurs(id),
    destinataire_id UUID REFERENCES candidats(id),
    sujet VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    date_lecture TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des templates d'emails
CREATE TABLE templates_emails (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL, -- Ex: 'bienvenue', 'selection', 'rejet'
    nom VARCHAR(200) NOT NULL,
    sujet VARCHAR(255) NOT NULL,
    corps_html TEXT NOT NULL,
    corps_texte TEXT,
    variables JSONB, -- Liste des variables disponibles
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 8. HISTORIQUE ET AUDIT
-- ============================================================================

-- Table d'audit des actions
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    utilisateur_id UUID REFERENCES utilisateurs(id),
    action VARCHAR(100) NOT NULL,
    table_affectee VARCHAR(100),
    enregistrement_id VARCHAR(100),
    anciennes_valeurs JSONB,
    nouvelles_valeurs JSONB,
    adresse_ip INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour performances
CREATE INDEX idx_audit_log_utilisateur ON audit_log(utilisateur_id, created_at DESC);
CREATE INDEX idx_audit_log_table ON audit_log(table_affectee, created_at DESC);

-- ============================================================================
-- 9. STATISTIQUES ET KPI
-- ============================================================================

-- Table des statistiques agrégées (calculées périodiquement)
CREATE TABLE statistiques_globales (
    id SERIAL PRIMARY KEY,
    edition_id INTEGER REFERENCES editions(id),
    date_calcul DATE NOT NULL,
    
    -- Inscriptions
    total_candidats INTEGER,
    candidats_hommes INTEGER,
    candidats_femmes INTEGER,
    candidats_par_region JSONB,
    candidats_par_departement JSONB,
    candidats_par_classe JSONB,
    
    -- QCM
    total_qcm_passes INTEGER,
    score_moyen DECIMAL(5,2),
    score_median DECIMAL(5,2),
    taux_reussite DECIMAL(5,2),
    
    -- Autres métriques
    taux_completion_profil DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(edition_id, date_calcul)
);

-- ============================================================================
-- 10. PARAMÈTRES ET CONFIGURATION
-- ============================================================================

-- Table de configuration générale
CREATE TABLE configuration_systeme (
    id SERIAL PRIMARY KEY,
    cle VARCHAR(100) UNIQUE NOT NULL,
    valeur TEXT,
    type_donnee VARCHAR(20) CHECK (type_donnee IN ('string', 'integer', 'boolean', 'json')),
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des configurations de base
INSERT INTO configuration_systeme (cle, valeur, type_donnee, description) VALUES 
    ('inscriptions_ouvertes', 'true', 'boolean', 'Les inscriptions sont-elles ouvertes ?'),
    ('edition_active', '2026', 'integer', 'Année de l\'édition en cours'),
    ('email_contact', 'contact@olympiades-ia-benin.org', 'string', 'Email de contact principal'),
    ('maintenance_mode', 'false', 'boolean', 'Mode maintenance activé'),
    ('max_taille_fichier_mo', '5', 'integer', 'Taille maximale des fichiers uploadés (Mo)');

-- ============================================================================
-- 11. TRIGGERS ET FONCTIONS
-- ============================================================================

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Application du trigger sur toutes les tables concernées
CREATE TRIGGER update_utilisateurs_updated_at BEFORE UPDATE ON utilisateurs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidats_updated_at BEFORE UPDATE ON candidats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_etablissements_updated_at BEFORE UPDATE ON etablissements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_editions_updated_at BEFORE UPDATE ON editions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_phases_updated_at BEFORE UPDATE ON phases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actualites_updated_at BEFORE UPDATE ON actualites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour attribuer le badge "Bienvenue" à l'inscription
CREATE OR REPLACE FUNCTION attribuer_badge_bienvenue()
RETURNS TRIGGER AS $$
BEGIN
    -- Attribuer le badge "Bienvenue" (id = 1)
    INSERT INTO candidats_badges (candidat_id, badge_id)
    VALUES (NEW.id, 1);
    
    -- Initialiser les XP
    INSERT INTO candidats_xp (candidat_id, total_xp, niveau)
    VALUES (NEW.id, 10, 1);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_badge_bienvenue AFTER INSERT ON candidats
    FOR EACH ROW EXECUTE FUNCTION attribuer_badge_bienvenue();

-- Fonction pour calculer le score du QCM
CREATE OR REPLACE FUNCTION calculer_score_qcm()
RETURNS TRIGGER AS $$
DECLARE
    total_questions INTEGER;
    reponses_correctes INTEGER;
    score_calcule DECIMAL(5,2);
    note_calcule DECIMAL(4,2);
BEGIN
    IF NEW.statut = 'termine' THEN
        -- Compter le total de questions
        SELECT COUNT(*) INTO total_questions
        FROM sessions_questions
        WHERE session_id = NEW.id;
        
        -- Compter les réponses correctes
        SELECT COUNT(*) INTO reponses_correctes
        FROM sessions_questions
        WHERE session_id = NEW.id AND est_correcte = TRUE;
        
        -- Calculer le score en pourcentage
        IF total_questions > 0 THEN
            score_calcule := (reponses_correctes::DECIMAL / total_questions) * 100;
            note_calcule := (reponses_correctes::DECIMAL / total_questions) * 20;
            
            NEW.score := score_calcule;
            NEW.note_sur_20 := note_calcule;
        END IF;
        
        -- Attribuer le badge "Premier pas" (id = 2) si pas déjà obtenu
        INSERT INTO candidats_badges (candidat_id, badge_id)
        VALUES (NEW.candidat_id, 2)
        ON CONFLICT (candidat_id, badge_id) DO NOTHING;
        
        -- Ajouter 50 XP
        UPDATE candidats_xp 
        SET total_xp = total_xp + 50,
            derniere_activite = CURRENT_TIMESTAMP
        WHERE candidat_id = NEW.candidat_id;
        
        -- Badge "Perfectionniste" si score parfait
        IF note_calcule = 20 THEN
            INSERT INTO candidats_badges (candidat_id, badge_id)
            VALUES (NEW.candidat_id, 4)
            ON CONFLICT (candidat_id, badge_id) DO NOTHING;
            
            UPDATE candidats_xp 
            SET total_xp = total_xp + 200
            WHERE candidat_id = NEW.candidat_id;
        END IF;
        
        -- Badge "Rapide" si terminé en moins de 15 minutes
        IF NEW.duree_effective_secondes < 900 THEN
            INSERT INTO candidats_badges (candidat_id, badge_id)
            VALUES (NEW.candidat_id, 5)
            ON CONFLICT (candidat_id, badge_id) DO NOTHING;
            
            UPDATE candidats_xp 
            SET total_xp = total_xp + 75
            WHERE candidat_id = NEW.candidat_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculer_score_qcm BEFORE UPDATE ON sessions_qcm
    FOR EACH ROW EXECUTE FUNCTION calculer_score_qcm();

-- ============================================================================
-- 12. VUES UTILES
-- ============================================================================

-- Vue pour le tableau de bord candidat
CREATE OR REPLACE VIEW vue_tableau_bord_candidat AS
SELECT 
    c.id,
    c.nom,
    c.prenoms,
    c.statut_candidature,
    e.nom AS etablissement,
    e.region,
    sq.score,
    sq.note_sur_20,
    sq.statut AS statut_qcm,
    cx.total_xp,
    cx.niveau,
    COUNT(DISTINCT cb.badge_id) AS nombre_badges
FROM candidats c
LEFT JOIN etablissements e ON c.etablissement_id = e.id
LEFT JOIN sessions_qcm sq ON c.id = sq.candidat_id
LEFT JOIN candidats_xp cx ON c.id = cx.candidat_id
LEFT JOIN candidats_badges cb ON c.id = cb.candidat_id
GROUP BY c.id, c.nom, c.prenoms, c.statut_candidature, e.nom, e.region, 
         sq.score, sq.note_sur_20, sq.statut, cx.total_xp, cx.niveau;

-- Vue pour les statistiques par région
CREATE OR REPLACE VIEW vue_stats_par_region AS
SELECT 
    e.region,
    COUNT(DISTINCT c.id) AS nombre_candidats,
    COUNT(DISTINCT CASE WHEN c.genre = 'M' THEN c.id END) AS nombre_hommes,
    COUNT(DISTINCT CASE WHEN c.genre = 'F' THEN c.id END) AS nombre_femmes,
    AVG(sq.note_sur_20) AS moyenne_notes_qcm,
    COUNT(DISTINCT CASE WHEN sq.statut = 'termine' THEN sq.id END) AS qcm_termines
FROM candidats c
LEFT JOIN etablissements e ON c.etablissement_id = e.id
LEFT JOIN sessions_qcm sq ON c.id = sq.candidat_id
GROUP BY e.region;

-- Vue pour le classement national
CREATE OR REPLACE VIEW vue_classement_national AS
SELECT 
    c.id,
    c.nom,
    c.prenoms,
    e.region,
    sq.note_sur_20,
    RANK() OVER (ORDER BY sq.note_sur_20 DESC NULLS LAST) AS rang_national,
    RANK() OVER (PARTITION BY e.region ORDER BY sq.note_sur_20 DESC NULLS LAST) AS rang_regional
FROM candidats c
LEFT JOIN etablissements e ON c.etablissement_id = e.id
LEFT JOIN sessions_qcm sq ON c.id = sq.candidat_id
WHERE sq.statut = 'termine';

-- ============================================================================
-- 13. INDEX POUR OPTIMISATION DES PERFORMANCES
-- ============================================================================

-- Index sur les candidats
CREATE INDEX idx_candidats_statut ON candidats(statut_candidature);
CREATE INDEX idx_candidats_etablissement ON candidats(etablissement_id);
CREATE INDEX idx_candidats_niveau ON candidats(niveau_etudes);

-- Index sur les établissements
CREATE INDEX idx_etablissements_region ON etablissements(region);
CREATE INDEX idx_etablissements_ville ON etablissements(ville);

-- Index sur les sessions QCM
CREATE INDEX idx_sessions_candidat ON sessions_qcm(candidat_id);
CREATE INDEX idx_sessions_statut ON sessions_qcm(statut);
CREATE INDEX idx_sessions_date ON sessions_qcm(date_debut);

-- Index sur les questions
CREATE INDEX idx_questions_categorie ON questions(categorie_id);
CREATE INDEX idx_questions_difficulte ON questions(niveau_difficulte);
CREATE INDEX idx_questions_statut ON questions(statut);

-- Index sur les évaluations
CREATE INDEX idx_evaluations_candidat ON evaluations_phases(candidat_id);
CREATE INDEX idx_evaluations_phase ON evaluations_phases(phase_id);
CREATE INDEX idx_evaluations_statut ON evaluations_phases(statut);

-- Index sur les actualités
CREATE INDEX idx_actualites_statut ON actualites(statut);
CREATE INDEX idx_actualites_date_pub ON actualites(date_publication);

-- Index full-text search pour recherche
CREATE INDEX idx_candidats_nom_prenoms ON candidats USING gin(to_tsvector('french', nom || ' ' || prenoms));
CREATE INDEX idx_etablissements_nom ON etablissements USING gin(to_tsvector('french', nom));

-- ============================================================================
-- FIN DU SCHÉMA
-- ============================================================================

-- Commentaires sur les tables principales
COMMENT ON TABLE candidats IS 'Profils détaillés des candidats aux Olympiades';
COMMENT ON TABLE sessions_qcm IS 'Sessions de passage du QCM de logique';
COMMENT ON TABLE evaluations_phases IS 'Évaluations des candidats pour chaque phase de sélection';
COMMENT ON TABLE badges IS 'Système de badges pour la gamification';
COMMENT ON TABLE audit_log IS 'Journal d''audit de toutes les actions critiques';
