# Guide d'Implémentation - Olympiades d'IA du Bénin

## Table des matières
1. [Installation et Configuration](#installation)
2. [Exemples d'API Backend](#api-backend)
3. [Requêtes Courantes](#requetes-courantes)
4. [Gestion du QCM](#gestion-qcm)
5. [Système de Gamification](#gamification)
6. [Scripts d'Administration](#scripts-admin)
7. [Sécurité](#securite)

---

## 1. Installation et Configuration {#installation}

### Prérequis
```bash
# PostgreSQL 14+
sudo apt install postgresql-14 postgresql-contrib

# Extensions nécessaires
sudo -u postgres psql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Création de la base de données
```bash
# Créer la base
sudo -u postgres createdb olympiades_ia

# Créer l'utilisateur
sudo -u postgres psql
CREATE USER olympiades_user WITH PASSWORD 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE olympiades_ia TO olympiades_user;
```

### Exécution du schéma
```bash
# Depuis le fichier SQL
psql -U olympiades_user -d olympiades_ia -f olympiades_ia_schema.sql
```

### Configuration pour le développement
```bash
# .env file
DATABASE_URL=postgresql://olympiades_user:password@localhost:5432/olympiades_ia
JWT_SECRET=votre_secret_jwt_tres_securise
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_app
```

---

## 2. Exemples d'API Backend {#api-backend}

### Exemple avec Node.js + Express + Sequelize

#### Configuration de la connexion
```javascript
// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
```

#### Modèle Candidat
```javascript
// models/Candidat.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Etablissement = require('./Etablissement');

const Candidat = sequelize.define('candidat', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: Utilisateur,
      key: 'id'
    }
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  prenoms: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  dateNaissance: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'date_naissance'
  },
  genre: {
    type: DataTypes.ENUM('M', 'F', 'Autre'),
    allowNull: true
  },
  photoUrl: {
    type: DataTypes.STRING(500),
    field: 'photo_url'
  },
  telephone: DataTypes.STRING(20),
  adresse: DataTypes.TEXT,
  
  // Parent/Tuteur
  nomParent: {
    type: DataTypes.STRING(100),
    field: 'nom_parent'
  },
  prenomsParent: {
    type: DataTypes.STRING(150),
    field: 'prenoms_parent'
  },
  telephoneParent: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'telephone_parent'
  },
  emailParent: {
    type: DataTypes.STRING(255),
    field: 'email_parent'
  },
  
  // Informations scolaires
  etablissementId: {
    type: DataTypes.INTEGER,
    references: {
      model: Etablissement,
      key: 'id'
    },
    field: 'etablissement_id'
  },
  classe: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  niveauEtudes: {
    type: DataTypes.ENUM('3ème', '2nde', '1ère', 'Tle'),
    field: 'niveau_etudes'
  },
  moyenneGenerale: {
    type: DataTypes.DECIMAL(4, 2),
    field: 'moyenne_generale',
    validate: {
      min: 0,
      max: 20
    }
  },
  noteMathematiques: {
    type: DataTypes.DECIMAL(4, 2),
    field: 'note_mathematiques',
    validate: {
      min: 0,
      max: 20
    }
  },
  noteSciences: {
    type: DataTypes.DECIMAL(4, 2),
    field: 'note_sciences',
    validate: {
      min: 0,
      max: 20
    }
  },
  
  // Documents
  bulletin1Url: {
    type: DataTypes.STRING(500),
    field: 'bulletin_1_url'
  },
  bulletin2Url: {
    type: DataTypes.STRING(500),
    field: 'bulletin_2_url'
  },
  bulletin3Url: {
    type: DataTypes.STRING(500),
    field: 'bulletin_3_url'
  },
  
  // Statut
  statutCandidature: {
    type: DataTypes.ENUM('inscription', 'en_attente', 'valide', 'rejete', 'selectionne', 'elimine'),
    defaultValue: 'inscription',
    field: 'statut_candidature'
  },
  commentaireAdmin: {
    type: DataTypes.TEXT,
    field: 'commentaire_admin'
  }
}, {
  tableName: 'candidats',
  underscored: true,
  timestamps: true
});

module.exports = Candidat;
```

#### Route d'inscription
```javascript
// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const sequelize = require('../config/database');
const Utilisateur = require('../models/Utilisateur');
const Candidat = require('../models/Candidat');
const { sendVerificationEmail } = require('../utils/email');

router.post('/inscription', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      email,
      motDePasse,
      nom,
      prenoms,
      dateNaissance,
      genre,
      telephone,
      telephoneParent,
      nomParent,
      prenomsParent,
      etablissementId,
      classe,
      niveauEtudes
    } = req.body;
    
    // Validation
    if (!email || !motDePasse || !nom || !prenoms) {
      return res.status(400).json({ 
        error: 'Champs obligatoires manquants' 
      });
    }
    
    // Vérifier si email existe déjà
    const existingUser = await Utilisateur.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Cet email est déjà utilisé' 
      });
    }
    
    // Hasher le mot de passe
    const motDePasseHash = await bcrypt.hash(motDePasse, 10);
    
    // Générer code de vérification
    const codeVerification = Math.floor(100000 + Math.random() * 900000).toString();
    const codeVerificationExpireAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    // Créer l'utilisateur
    const userId = uuidv4();
    const utilisateur = await Utilisateur.create({
      id: userId,
      email,
      motDePasseHash,
      roleId: 1, // Role candidat
      codeVerification,
      codeVerificationExpireAt
    }, { transaction });
    
    // Créer le profil candidat
    const candidat = await Candidat.create({
      id: userId,
      nom,
      prenoms,
      dateNaissance,
      genre,
      telephone,
      telephoneParent,
      nomParent,
      prenomsParent,
      etablissementId,
      classe,
      niveauEtudes
    }, { transaction });
    
    await transaction.commit();
    
    // Envoyer l'email de vérification
    await sendVerificationEmail(email, codeVerification, nom, prenoms);
    
    res.status(201).json({
      message: 'Inscription réussie. Vérifiez votre email.',
      candidatId: candidat.id
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur inscription:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'inscription' 
    });
  }
});

module.exports = router;
```

#### Vérification de l'email
```javascript
// routes/auth.js (suite)
router.post('/verifier-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    const utilisateur = await Utilisateur.findOne({ where: { email } });
    
    if (!utilisateur) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    if (utilisateur.emailVerifie) {
      return res.status(400).json({ error: 'Email déjà vérifié' });
    }
    
    // Vérifier le code et l'expiration
    if (utilisateur.codeVerification !== code) {
      return res.status(400).json({ error: 'Code de vérification incorrect' });
    }
    
    if (new Date() > utilisateur.codeVerificationExpireAt) {
      return res.status(400).json({ error: 'Code de vérification expiré' });
    }
    
    // Marquer l'email comme vérifié
    utilisateur.emailVerifie = true;
    utilisateur.codeVerification = null;
    utilisateur.codeVerificationExpireAt = null;
    await utilisateur.save();
    
    res.json({ message: 'Email vérifié avec succès' });
    
  } catch (error) {
    console.error('Erreur vérification:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification' });
  }
});
```

---

## 3. Requêtes Courantes {#requetes-courantes}

### Récupérer le profil complet d'un candidat
```javascript
// controllers/candidat.controller.js
async function getProfilComplet(req, res) {
  try {
    const { candidatId } = req.params;
    
    const profil = await sequelize.query(`
      SELECT 
        c.id,
        c.nom,
        c.prenoms,
        c.date_naissance,
        c.genre,
        c.photo_url,
        c.statut_candidature,
        e.nom as etablissement_nom,
        e.ville as etablissement_ville,
        e.region,
        sq.score as score_qcm,
        sq.note_sur_20,
        sq.statut as statut_qcm,
        cx.total_xp,
        cx.niveau,
        COUNT(DISTINCT cb.badge_id) as nombre_badges,
        json_agg(DISTINCT jsonb_build_object(
          'id', b.id,
          'nom', b.nom,
          'icone_url', b.icone_url,
          'date_obtention', cb.date_obtention
        )) FILTER (WHERE b.id IS NOT NULL) as badges
      FROM candidats c
      LEFT JOIN etablissements e ON c.etablissement_id = e.id
      LEFT JOIN sessions_qcm sq ON c.id = sq.candidat_id AND sq.statut = 'termine'
      LEFT JOIN candidats_xp cx ON c.id = cx.candidat_id
      LEFT JOIN candidats_badges cb ON c.id = cb.candidat_id
      LEFT JOIN badges b ON cb.badge_id = b.id
      WHERE c.id = :candidatId
      GROUP BY c.id, e.nom, e.ville, e.region, sq.score, sq.note_sur_20, 
               sq.statut, cx.total_xp, cx.niveau
    `, {
      replacements: { candidatId },
      type: sequelize.QueryTypes.SELECT
    });
    
    if (profil.length === 0) {
      return res.status(404).json({ error: 'Candidat non trouvé' });
    }
    
    res.json(profil[0]);
    
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
```

### Liste des candidats avec filtres
```javascript
async function getListeCandidats(req, res) {
  try {
    const { 
      region, 
      statut, 
      niveau, 
      page = 1, 
      limit = 20,
      search 
    } = req.query;
    
    let whereClause = [];
    let replacements = {};
    
    if (region) {
      whereClause.push('e.region = :region');
      replacements.region = region;
    }
    
    if (statut) {
      whereClause.push('c.statut_candidature = :statut');
      replacements.statut = statut;
    }
    
    if (niveau) {
      whereClause.push('c.niveau_etudes = :niveau');
      replacements.niveau = niveau;
    }
    
    if (search) {
      whereClause.push(`(
        to_tsvector('french', c.nom || ' ' || c.prenoms) @@ 
        plainto_tsquery('french', :search)
      )`);
      replacements.search = search;
    }
    
    const offset = (page - 1) * limit;
    replacements.limit = parseInt(limit);
    replacements.offset = offset;
    
    const query = `
      SELECT 
        c.id,
        c.nom,
        c.prenoms,
        c.statut_candidature,
        c.classe,
        c.niveau_etudes,
        e.nom as etablissement,
        e.region,
        sq.note_sur_20,
        cx.total_xp
      FROM candidats c
      LEFT JOIN etablissements e ON c.etablissement_id = e.id
      LEFT JOIN sessions_qcm sq ON c.id = sq.candidat_id AND sq.statut = 'termine'
      LEFT JOIN candidats_xp cx ON c.id = cx.candidat_id
      ${whereClause.length > 0 ? 'WHERE ' + whereClause.join(' AND ') : ''}
      ORDER BY c.created_at DESC
      LIMIT :limit OFFSET :offset
    `;
    
    const candidats = await sequelize.query(query, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });
    
    // Compter le total pour la pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM candidats c
      LEFT JOIN etablissements e ON c.etablissement_id = e.id
      ${whereClause.length > 0 ? 'WHERE ' + whereClause.join(' AND ') : ''}
    `;
    
    const [{ total }] = await sequelize.query(countQuery, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });
    
    res.json({
      candidats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total),
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Erreur liste candidats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
```

---

## 4. Gestion du QCM {#gestion-qcm}

### Démarrer une session QCM
```javascript
// controllers/qcm.controller.js
async function demarrerSessionQcm(req, res) {
  const transaction = await sequelize.transaction();
  
  try {
    const { candidatId } = req.user; // Depuis le JWT
    const editionId = 1; // Édition en cours
    
    // Vérifier si candidat a déjà passé le QCM
    const sessionExistante = await sequelize.query(`
      SELECT id FROM sessions_qcm 
      WHERE candidat_id = :candidatId 
        AND edition_id = :editionId
        AND statut IN ('termine', 'en_cours')
    `, {
      replacements: { candidatId, editionId },
      type: sequelize.QueryTypes.SELECT,
      transaction
    });
    
    if (sessionExistante.length > 0) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'Vous avez déjà passé le QCM' 
      });
    }
    
    // Récupérer la configuration
    const [config] = await sequelize.query(`
      SELECT * FROM configuration_qcm 
      WHERE edition_id = :editionId
    `, {
      replacements: { editionId },
      type: sequelize.QueryTypes.SELECT,
      transaction
    });
    
    const nombreQuestions = config.nombre_questions || 5;
    
    // Créer la session
    const sessionId = uuidv4();
    await sequelize.query(`
      INSERT INTO sessions_qcm (
        id, candidat_id, edition_id, date_debut, statut, adresse_ip, user_agent
      ) VALUES (
        :sessionId, :candidatId, :editionId, NOW(), 'en_cours', :ip, :userAgent
      )
    `, {
      replacements: {
        sessionId,
        candidatId,
        editionId,
        ip: req.ip,
        userAgent: req.get('user-agent')
      },
      transaction
    });
    
    // Tirer aléatoirement les questions
    const questions = await sequelize.query(`
      SELECT id, enonce, options, image_url, niveau_difficulte
      FROM questions
      WHERE statut = 'active'
      ORDER BY RANDOM()
      LIMIT :nombreQuestions
    `, {
      replacements: { nombreQuestions },
      type: sequelize.QueryTypes.SELECT,
      transaction
    });
    
    // Insérer les questions dans la session
    for (let i = 0; i < questions.length; i++) {
      await sequelize.query(`
        INSERT INTO sessions_questions (
          session_id, question_id, ordre_affichage
        ) VALUES (
          :sessionId, :questionId, :ordre
        )
      `, {
        replacements: {
          sessionId,
          questionId: questions[i].id,
          ordre: i + 1
        },
        transaction
      });
      
      // Incrémenter le compteur d'utilisation
      await sequelize.query(`
        UPDATE questions 
        SET fois_utilisee = fois_utilisee + 1
        WHERE id = :questionId
      `, {
        replacements: { questionId: questions[i].id },
        transaction
      });
    }
    
    await transaction.commit();
    
    // Retourner les questions (sans les réponses!)
    const questionsFormatees = questions.map((q, index) => ({
      id: q.id,
      ordre: index + 1,
      enonce: q.enonce,
      options: q.options,
      imageUrl: q.image_url
      // PAS DE reponse_correcte !
    }));
    
    res.json({
      sessionId,
      dureeMinutes: config.duree_minutes,
      dateDebut: new Date(),
      questions: questionsFormatees
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur démarrage QCM:', error);
    res.status(500).json({ error: 'Erreur lors du démarrage du QCM' });
  }
}
```

### Soumettre une réponse
```javascript
async function soumettreReponse(req, res) {
  try {
    const { sessionId, questionId, reponse, tempsReponseSecondes } = req.body;
    const { candidatId } = req.user;
    
    // Vérifier que la session appartient au candidat
    const [session] = await sequelize.query(`
      SELECT statut FROM sessions_qcm 
      WHERE id = :sessionId AND candidat_id = :candidatId
    `, {
      replacements: { sessionId, candidatId },
      type: sequelize.QueryTypes.SELECT
    });
    
    if (!session) {
      return res.status(403).json({ error: 'Session non trouvée' });
    }
    
    if (session.statut !== 'en_cours') {
      return res.status(400).json({ error: 'Session déjà terminée' });
    }
    
    // Récupérer la réponse correcte
    const [question] = await sequelize.query(`
      SELECT reponse_correcte FROM questions WHERE id = :questionId
    `, {
      replacements: { questionId },
      type: sequelize.QueryTypes.SELECT
    });
    
    const estCorrecte = question.reponse_correcte === reponse;
    
    // Enregistrer la réponse
    await sequelize.query(`
      UPDATE sessions_questions
      SET reponse_donnee = :reponse,
          est_correcte = :estCorrecte,
          temps_reponse_secondes = :tempsReponse
      WHERE session_id = :sessionId AND question_id = :questionId
    `, {
      replacements: {
        reponse,
        estCorrecte,
        tempsReponse: tempsReponseSecondes,
        sessionId,
        questionId
      }
    });
    
    res.json({ 
      success: true,
      // Ne pas révéler si c'est correct pendant le QCM
      message: 'Réponse enregistrée' 
    });
    
  } catch (error) {
    console.error('Erreur soumission réponse:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
```

### Terminer le QCM
```javascript
async function terminerSessionQcm(req, res) {
  const transaction = await sequelize.transaction();
  
  try {
    const { sessionId } = req.body;
    const { candidatId } = req.user;
    
    // Récupérer la session
    const [session] = await sequelize.query(`
      SELECT date_debut FROM sessions_qcm 
      WHERE id = :sessionId AND candidat_id = :candidatId AND statut = 'en_cours'
    `, {
      replacements: { sessionId, candidatId },
      type: sequelize.QueryTypes.SELECT,
      transaction
    });
    
    if (!session) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Session non trouvée' });
    }
    
    // Calculer la durée
    const dureeSecondes = Math.floor((new Date() - new Date(session.date_debut)) / 1000);
    
    // Mettre à jour la session (le trigger calculera automatiquement le score)
    await sequelize.query(`
      UPDATE sessions_qcm
      SET statut = 'termine',
          date_fin = NOW(),
          duree_effective_secondes = :duree
      WHERE id = :sessionId
    `, {
      replacements: { sessionId, duree: dureeSecondes },
      transaction
    });
    
    await transaction.commit();
    
    // Récupérer les résultats
    const [resultats] = await sequelize.query(`
      SELECT score, note_sur_20, duree_effective_secondes
      FROM sessions_qcm
      WHERE id = :sessionId
    `, {
      replacements: { sessionId },
      type: sequelize.QueryTypes.SELECT
    });
    
    // Récupérer les détails des réponses
    const details = await sequelize.query(`
      SELECT 
        q.enonce,
        q.options,
        q.reponse_correcte,
        sq.reponse_donnee,
        sq.est_correcte,
        sq.temps_reponse_secondes
      FROM sessions_questions sq
      JOIN questions q ON sq.question_id = q.id
      WHERE sq.session_id = :sessionId
      ORDER BY sq.ordre_affichage
    `, {
      replacements: { sessionId },
      type: sequelize.QueryTypes.SELECT
    });
    
    res.json({
      score: resultats.score,
      noteSur20: resultats.note_sur_20,
      dureeSecondes: resultats.duree_effective_secondes,
      details
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur fin QCM:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
```

---

## 5. Système de Gamification {#gamification}

### Fonction d'attribution manuelle de badges
```javascript
async function attribuerBadge(candidatId, badgeId) {
  const transaction = await sequelize.transaction();
  
  try {
    // Vérifier si badge déjà obtenu
    const [existing] = await sequelize.query(`
      SELECT id FROM candidats_badges
      WHERE candidat_id = :candidatId AND badge_id = :badgeId
    `, {
      replacements: { candidatId, badgeId },
      type: sequelize.QueryTypes.SELECT,
      transaction
    });
    
    if (existing) {
      await transaction.rollback();
      return { success: false, message: 'Badge déjà obtenu' };
    }
    
    // Récupérer les infos du badge
    const [badge] = await sequelize.query(`
      SELECT points_xp FROM badges WHERE id = :badgeId
    `, {
      replacements: { badgeId },
      type: sequelize.QueryTypes.SELECT,
      transaction
    });
    
    // Attribuer le badge
    await sequelize.query(`
      INSERT INTO candidats_badges (candidat_id, badge_id)
      VALUES (:candidatId, :badgeId)
    `, {
      replacements: { candidatId, badgeId },
      transaction
    });
    
    // Ajouter les XP
    await sequelize.query(`
      UPDATE candidats_xp
      SET total_xp = total_xp + :xp,
          derniere_activite = NOW()
      WHERE candidat_id = :candidatId
    `, {
      replacements: { candidatId, xp: badge.points_xp },
      transaction
    });
    
    await transaction.commit();
    
    return { 
      success: true, 
      message: 'Badge attribué',
      xpGagnes: badge.points_xp 
    };
    
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

### Calculer et attribuer le badge "Top 10%"
```javascript
async function attribuerBadgeTop10Pourcent() {
  try {
    // Identifier les candidats dans le top 10%
    const top10 = await sequelize.query(`
      WITH classement AS (
        SELECT 
          c.id,
          sq.note_sur_20,
          PERCENT_RANK() OVER (ORDER BY sq.note_sur_20 DESC) as percentile
        FROM candidats c
        JOIN sessions_qcm sq ON c.id = sq.candidat_id
        WHERE sq.statut = 'termine'
      )
      SELECT id 
      FROM classement
      WHERE percentile <= 0.1
        AND id NOT IN (
          SELECT candidat_id 
          FROM candidats_badges 
          WHERE badge_id = 3 -- Badge "Top 10%"
        )
    `, {
      type: sequelize.QueryTypes.SELECT
    });
    
    // Attribuer le badge à chacun
    for (const { id } of top10) {
      await attribuerBadge(id, 3); // Badge id=3 = "Top 10%"
    }
    
    console.log(`Badge Top 10% attribué à ${top10.length} candidats`);
    
  } catch (error) {
    console.error('Erreur attribution badge Top 10%:', error);
  }
}
```

### Mettre à jour le classement régional
```javascript
async function mettreAJourClassement(editionId) {
  try {
    await sequelize.query(`
      -- Supprimer les anciens classements pour cette édition
      DELETE FROM classement_regional WHERE edition_id = :editionId;
      
      -- Insérer les nouveaux classements
      INSERT INTO classement_regional (
        candidat_id, edition_id, region, score_total, rang_regional, rang_national
      )
      SELECT 
        c.id,
        :editionId,
        e.region,
        sq.note_sur_20 as score_total,
        RANK() OVER (PARTITION BY e.region ORDER BY sq.note_sur_20 DESC NULLS LAST) as rang_regional,
        RANK() OVER (ORDER BY sq.note_sur_20 DESC NULLS LAST) as rang_national
      FROM candidats c
      LEFT JOIN etablissements e ON c.etablissement_id = e.id
      LEFT JOIN sessions_qcm sq ON c.id = sq.candidat_id
      WHERE sq.statut = 'termine';
    `, {
      replacements: { editionId }
    });
    
    console.log('Classement mis à jour avec succès');
    
  } catch (error) {
    console.error('Erreur mise à jour classement:', error);
  }
}
```

---

## 6. Scripts d'Administration {#scripts-admin}

### Script de génération de statistiques quotidiennes
```javascript
// scripts/generer-statistiques.js
const sequelize = require('../config/database');

async function genererStatistiquesQuotidiennes() {
  const editionId = 1; // Édition en cours
  const dateCalcul = new Date().toISOString().split('T')[0];
  
  try {
    await sequelize.query(`
      INSERT INTO statistiques_globales (
        edition_id,
        date_calcul,
        total_candidats,
        candidats_hommes,
        candidats_femmes,
        candidats_par_region,
        candidats_par_classe,
        total_qcm_passes,
        score_moyen,
        score_median,
        taux_reussite
      )
      SELECT
        :editionId,
        :dateCalcul,
        COUNT(DISTINCT c.id) as total_candidats,
        COUNT(DISTINCT CASE WHEN c.genre = 'M' THEN c.id END) as candidats_hommes,
        COUNT(DISTINCT CASE WHEN c.genre = 'F' THEN c.id END) as candidats_femmes,
        (
          SELECT json_object_agg(region, nb)
          FROM (
            SELECT e.region, COUNT(*) as nb
            FROM candidats c2
            JOIN etablissements e ON c2.etablissement_id = e.id
            GROUP BY e.region
          ) r
        ) as candidats_par_region,
        (
          SELECT json_object_agg(niveau_etudes, nb)
          FROM (
            SELECT niveau_etudes, COUNT(*) as nb
            FROM candidats
            GROUP BY niveau_etudes
          ) n
        ) as candidats_par_classe,
        COUNT(DISTINCT sq.id) as total_qcm_passes,
        AVG(sq.note_sur_20) as score_moyen,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY sq.note_sur_20) as score_median,
        AVG(CASE WHEN sq.note_sur_20 >= 10 THEN 1 ELSE 0 END) * 100 as taux_reussite
      FROM candidats c
      LEFT JOIN sessions_qcm sq ON c.id = sq.candidat_id AND sq.statut = 'termine'
      ON CONFLICT (edition_id, date_calcul) 
      DO UPDATE SET
        total_candidats = EXCLUDED.total_candidats,
        candidats_hommes = EXCLUDED.candidats_hommes,
        candidats_femmes = EXCLUDED.candidats_femmes,
        candidats_par_region = EXCLUDED.candidats_par_region,
        candidats_par_classe = EXCLUDED.candidats_par_classe,
        total_qcm_passes = EXCLUDED.total_qcm_passes,
        score_moyen = EXCLUDED.score_moyen,
        score_median = EXCLUDED.score_median,
        taux_reussite = EXCLUDED.taux_reussite,
        created_at = NOW()
    `, {
      replacements: { editionId, dateCalcul }
    });
    
    console.log('Statistiques générées avec succès');
    
  } catch (error) {
    console.error('Erreur génération stats:', error);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  genererStatistiquesQuotidiennes()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { genererStatistiquesQuotidiennes };
```

### Script de nettoyage des sessions expirées
```javascript
// scripts/nettoyer-sessions.js
async function nettoyerSessionsExpirees() {
  try {
    // Sessions QCM commencées il y a plus de 2 heures et toujours "en_cours"
    const result = await sequelize.query(`
      UPDATE sessions_qcm
      SET statut = 'abandonne'
      WHERE statut = 'en_cours'
        AND date_debut < NOW() - INTERVAL '2 hours'
    `);
    
    console.log(`${result[0].rowCount} sessions expirées nettoyées`);
    
  } catch (error) {
    console.error('Erreur nettoyage sessions:', error);
  }
}
```

---

## 7. Sécurité {#securite}

### Middleware d'authentification JWT
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

function authentifier(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
}

function estAdmin(req, res, next) {
  if (req.user.role !== 'administrateur' && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Accès refusé' });
  }
  next();
}

module.exports = { authentifier, estAdmin };
```

### Protection contre les injections SQL
```javascript
// ✅ BON - Utilisation de paramètres
await sequelize.query(`
  SELECT * FROM candidats WHERE id = :id
`, {
  replacements: { id: candidatId },
  type: sequelize.QueryTypes.SELECT
});

// ❌ MAUVAIS - Concaténation (vulnérable aux injections)
await sequelize.query(`
  SELECT * FROM candidats WHERE id = '${candidatId}'
`);
```

### Rate limiting
```javascript
// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const limiterInscription = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: 'Trop de tentatives, réessayez plus tard'
});

const limiterConnexion = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Trop de tentatives de connexion'
});

module.exports = { limiterInscription, limiterConnexion };

// Dans routes/auth.js
router.post('/inscription', limiterInscription, inscriptionHandler);
router.post('/connexion', limiterConnexion, connexionHandler);
```

### Validation des données
```javascript
// utils/validation.js
const Joi = require('joi');

const schemaInscription = Joi.object({
  email: Joi.string().email().required(),
  motDePasse: Joi.string().min(8).required(),
  nom: Joi.string().min(2).max(100).required(),
  prenoms: Joi.string().min(2).max(150).required(),
  dateNaissance: Joi.date().max('now').required(),
  genre: Joi.string().valid('M', 'F', 'Autre'),
  telephoneParent: Joi.string().pattern(/^[0-9]{8,15}$/).required(),
  classe: Joi.string().required(),
  niveauEtudes: Joi.string().valid('3ème', '2nde', '1ère', 'Tle').required()
});

function validerInscription(req, res, next) {
  const { error } = schemaInscription.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Données invalides', 
      details: error.details 
    });
  }
  next();
}

module.exports = { validerInscription };
```

---

## Conclusion

Ce guide d'implémentation fournit :
- ✅ Configuration complète de la base de données
- ✅ Exemples de code backend (Node.js/Express)
- ✅ Requêtes SQL optimisées
- ✅ Gestion complète du système QCM
- ✅ Implémentation de la gamification
- ✅ Scripts d'administration
- ✅ Mesures de sécurité

### Prochaines étapes
1. Adapter le code à votre stack technique (Python/Django, PHP/Laravel, etc.)
2. Implémenter le frontend (React, Vue.js, etc.)
3. Configurer les environnements (dev, staging, prod)
4. Mettre en place les tests automatisés
5. Déployer sur le cloud (AWS, Azure, GCP)
