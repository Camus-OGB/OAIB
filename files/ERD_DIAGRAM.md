```mermaid
erDiagram
    %% ============================================================================
    %% DIAGRAMME ENTITY-RELATIONSHIP - OLYMPIADES D'IA DU BÉNIN
    %% ============================================================================
    
    %% Module 1: Utilisateurs et Authentification
    roles ||--o{ utilisateurs : "a"
    utilisateurs ||--o| candidats : "est"
    utilisateurs ||--o| administrateurs : "est"
    etablissements ||--o{ candidats : "accueille"
    
    %% Module 2: Éditions et Phases
    editions ||--o{ phases : "contient"
    editions ||--o{ sessions_qcm : "organise"
    editions ||--o{ evaluations_phases : "évalue"
    editions ||--o{ medias : "illustre"
    editions ||--o{ temoignages : "documente"
    
    %% Module 3: QCM
    categories_questions ||--o{ questions : "categorise"
    questions ||--o{ sessions_questions : "utilisée_dans"
    utilisateurs ||--o{ questions : "crée"
    candidats ||--o{ sessions_qcm : "passe"
    sessions_qcm ||--o{ sessions_questions : "contient"
    configuration_qcm }o--|| editions : "configure"
    
    %% Module 4: Évaluations
    candidats ||--o{ evaluations_phases : "est_évalué"
    phases ||--o{ evaluations_phases : "évalue_dans"
    sessions_qcm ||--o| evaluations_phases : "contribue_à"
    administrateurs ||--o{ evaluations_phases : "évalue"
    
    %% Module 5: Gamification
    badges ||--o{ candidats_badges : "obtenu_par"
    candidats ||--o{ candidats_badges : "obtient"
    candidats ||--|| candidats_xp : "possède"
    candidats ||--o{ classement_regional : "classé"
    editions ||--o{ classement_regional : "classe_pour"
    
    %% Module 6: Contenu
    administrateurs ||--o{ actualites : "publie"
    utilisateurs ||--o{ medias : "upload"
    candidats ||--o{ temoignages : "témoigne"
    
    %% Module 7: Communication
    utilisateurs ||--o{ notifications : "reçoit"
    administrateurs ||--o{ messages : "envoie"
    candidats ||--o{ messages : "reçoit"
    
    %% Module 8: Audit
    utilisateurs ||--o{ audit_log : "effectue"
    
    %% Module 9: Statistiques
    editions ||--o{ statistiques_globales : "génère"
    
    %% ============================================================================
    %% DÉFINITIONS DES ENTITÉS
    %% ============================================================================
    
    roles {
        int id PK
        varchar nom UK
        text description
        timestamp created_at
    }
    
    utilisateurs {
        uuid id PK
        varchar email UK
        varchar mot_de_passe_hash
        int role_id FK
        varchar statut
        boolean email_verifie
        varchar code_verification
        timestamp code_verification_expire_at
        boolean deux_facteurs_active
        varchar secret_2fa
        timestamp derniere_connexion
        timestamp created_at
        timestamp updated_at
    }
    
    etablissements {
        int id PK
        varchar nom
        varchar type
        varchar ville
        varchar departement
        varchar region
        text adresse
        varchar telephone
        varchar email
        varchar statut
        timestamp created_at
        timestamp updated_at
    }
    
    candidats {
        uuid id PK_FK
        varchar nom
        varchar prenoms
        date date_naissance
        varchar genre
        varchar photo_url
        varchar telephone
        text adresse
        varchar nom_parent
        varchar prenoms_parent
        varchar telephone_parent
        varchar email_parent
        int etablissement_id FK
        varchar classe
        varchar niveau_etudes
        decimal moyenne_generale
        decimal note_mathematiques
        decimal note_sciences
        varchar bulletin_1_url
        varchar bulletin_2_url
        varchar bulletin_3_url
        varchar statut_candidature
        text commentaire_admin
        timestamp created_at
        timestamp updated_at
    }
    
    administrateurs {
        uuid id PK_FK
        varchar nom
        varchar prenoms
        varchar fonction
        varchar telephone
        jsonb permissions
        timestamp created_at
        timestamp updated_at
    }
    
    editions {
        int id PK
        int annee UK
        varchar titre
        text description
        varchar pays_hote
        date date_debut
        date date_fin
        varchar statut
        int nombre_participants_cible
        timestamp created_at
        timestamp updated_at
    }
    
    phases {
        int id PK
        int edition_id FK
        smallint numero_phase
        varchar nom
        text description
        date date_debut
        date date_fin
        jsonb criteres_selection
        int nombre_selectiones
        varchar statut
        timestamp created_at
        timestamp updated_at
    }
    
    categories_questions {
        int id PK
        varchar nom UK
        text description
        timestamp created_at
    }
    
    questions {
        int id PK
        int categorie_id FK
        text enonce
        varchar type_question
        smallint niveau_difficulte
        jsonb options
        varchar reponse_correcte
        varchar image_url
        int fois_utilisee
        decimal taux_reussite
        varchar statut
        uuid creee_par FK
        timestamp created_at
        timestamp updated_at
    }
    
    configuration_qcm {
        int id PK
        int edition_id FK
        int duree_minutes
        int nombre_questions
        decimal score_minimum
        boolean mode_plein_ecran
        boolean detection_triche
        boolean autoriser_reprise
        int delai_reprise_minutes
        timestamp created_at
        timestamp updated_at
    }
    
    sessions_qcm {
        uuid id PK
        uuid candidat_id FK
        int edition_id FK
        timestamp date_debut
        timestamp date_fin
        int duree_effective_secondes
        decimal score
        decimal note_sur_20
        varchar statut
        int changements_onglet
        int sorties_plein_ecran
        inet adresse_ip
        text user_agent
        timestamp created_at
        timestamp updated_at
    }
    
    sessions_questions {
        int id PK
        uuid session_id FK
        int question_id FK
        smallint ordre_affichage
        varchar reponse_donnee
        boolean est_correcte
        int temps_reponse_secondes
        timestamp created_at
    }
    
    evaluations_phases {
        int id PK
        uuid candidat_id FK
        int phase_id FK
        uuid session_qcm_id FK
        decimal score_qcm
        decimal score_dossier
        decimal score_total
        varchar statut
        int rang
        text commentaire
        uuid evaluateur_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    badges {
        int id PK
        varchar nom UK
        text description
        varchar icone_url
        text critere_obtention
        int points_xp
        int ordre_affichage
        varchar statut
        timestamp created_at
    }
    
    candidats_badges {
        int id PK
        uuid candidat_id FK
        int badge_id FK
        timestamp date_obtention
    }
    
    candidats_xp {
        uuid candidat_id PK_FK
        int total_xp
        int niveau
        timestamp derniere_activite
        timestamp updated_at
    }
    
    classement_regional {
        int id PK
        uuid candidat_id FK
        int edition_id FK
        varchar region
        decimal score_total
        int rang_regional
        int rang_national
        timestamp updated_at
    }
    
    actualites {
        int id PK
        varchar titre
        varchar slug UK
        text contenu
        text resume
        varchar image_principale_url
        varchar categorie
        varchar statut
        uuid auteur_id FK
        timestamp date_publication
        int vues
        timestamp created_at
        timestamp updated_at
    }
    
    faq {
        int id PK
        text question
        text reponse
        varchar categorie
        int ordre_affichage
        varchar statut
        timestamp created_at
        timestamp updated_at
    }
    
    partenaires {
        int id PK
        varchar nom
        varchar type
        varchar logo_url
        text description
        varchar site_web
        int ordre_affichage
        varchar statut
        timestamp created_at
        timestamp updated_at
    }
    
    medias {
        int id PK
        varchar titre
        text description
        varchar type
        varchar url
        bigint taille_octets
        varchar mime_type
        int edition_id FK
        uuid uploaded_by FK
        timestamp created_at
    }
    
    temoignages {
        int id PK
        uuid candidat_id FK
        int edition_id FK
        varchar type
        text contenu
        varchar video_url
        varchar photo_url
        varchar statut
        int ordre_affichage
        timestamp created_at
        timestamp updated_at
    }
    
    notifications {
        int id PK
        uuid destinataire_id FK
        varchar type
        varchar titre
        text message
        varchar lien
        boolean lue
        timestamp date_lecture
        varchar priorite
        timestamp created_at
    }
    
    messages {
        int id PK
        uuid expediteur_id FK
        uuid destinataire_id FK
        varchar sujet
        text contenu
        boolean lu
        timestamp date_lecture
        timestamp created_at
    }
    
    templates_emails {
        int id PK
        varchar code UK
        varchar nom
        varchar sujet
        text corps_html
        text corps_texte
        jsonb variables
        timestamp created_at
        timestamp updated_at
    }
    
    audit_log {
        int id PK
        uuid utilisateur_id FK
        varchar action
        varchar table_affectee
        varchar enregistrement_id
        jsonb anciennes_valeurs
        jsonb nouvelles_valeurs
        inet adresse_ip
        text user_agent
        timestamp created_at
    }
    
    statistiques_globales {
        int id PK
        int edition_id FK
        date date_calcul
        int total_candidats
        int candidats_hommes
        int candidats_femmes
        jsonb candidats_par_region
        jsonb candidats_par_departement
        jsonb candidats_par_classe
        int total_qcm_passes
        decimal score_moyen
        decimal score_median
        decimal taux_reussite
        decimal taux_completion_profil
        timestamp created_at
    }
    
    configuration_systeme {
        int id PK
        varchar cle UK
        text valeur
        varchar type_donnee
        text description
        timestamp updated_at
    }
```
