"""
Commande de seed — Remplit la base de données avec des données réalistes
pour les Olympiades d'Intelligence Artificielle du Bénin (OAIB).
"""
import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.cms.models import Page, NewsArticle, FAQItem, Partner
from apps.exams.models import (
    Edition, Phase, QuestionCategory, Question, QuestionOption, Exam, ExamQuestion,
)
from apps.resources.models import Resource
from apps.platform_settings.models import PlatformSettings


class Command(BaseCommand):
    help = "Peuple la BDD avec des données réalistes OAIB (idempotent)"

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("🌱 Seed OAIB — Début"))
        self._seed_settings()
        self._seed_pages()
        self._seed_news()
        self._seed_faq()
        self._seed_partners()
        self._seed_editions_phases()
        self._seed_categories_questions()
        self._seed_resources()
        self.stdout.write(self.style.SUCCESS("✅ Seed terminé avec succès !"))

    # ── Platform Settings ─────────────────────────────────────
    def _seed_settings(self):
        obj, created = PlatformSettings.objects.update_or_create(
            pk=1,
            defaults={
                "site_name": "OAIB — Olympiades d'Intelligence Artificielle du Bénin",
                "site_description": "Compétition nationale visant à découvrir et former la prochaine génération de talents en IA au Bénin.",
                "contact_email": "contact@oaib.bj",
                "support_email": "support@oaib.bj",
                "registration_open": True,
                "maintenance_mode": False,
                "max_file_size_mb": 10,
                "allowed_file_types": "pdf,jpg,png,jpeg",
                "security_settings": {
                    "two_factor_required": False,
                    "session_timeout": 30,
                    "max_login_attempts": 5,
                    "password_min_length": 8,
                },
            },
        )
        self.stdout.write(f"  PlatformSettings : {'créé' if created else 'mis à jour'}")

    # ── Pages CMS ─────────────────────────────────────────────
    def _seed_pages(self):
        pages = [
            {
                "title": "Accueil",
                "slug": "accueil",
                "content": """
# Bienvenue aux Olympiades d'Intelligence Artificielle du Bénin

Les OAIB sont la première compétition nationale dédiée à l'intelligence artificielle pour les jeunes béninois.
Notre mission : identifier, former et accompagner les talents de demain dans les domaines de l'IA,
du Machine Learning et de la Data Science.

## Pourquoi participer ?
- Développez vos compétences en IA et programmation
- Rencontrez des experts et mentors du domaine
- Gagnez des bourses d'études et des opportunités professionnelles
- Représentez le Bénin dans des compétitions internationales
                """.strip(),
                "status": "published",
            },
            {
                "title": "À propos",
                "slug": "a-propos",
                "content": """
# À propos des OAIB

Les Olympiades d'Intelligence Artificielle du Bénin (OAIB) sont une initiative nationale
visant à promouvoir l'enseignement de l'IA auprès des jeunes lycéens et étudiants du Bénin.

## Notre Vision
Faire du Bénin un pôle d'excellence africain en Intelligence Artificielle d'ici 2030.

## Notre Mission
Démocratiser l'accès aux connaissances en IA et offrir une plateforme compétitive
permettant aux jeunes talents de se révéler et de se former.

## Nos Valeurs
- **Excellence** : Viser les plus hauts standards académiques
- **Inclusion** : Garantir l'accès à tous, partout au Bénin
- **Innovation** : Encourager la créativité et l'esprit d'entreprise
- **Collaboration** : Travailler ensemble pour un avenir meilleur
                """.strip(),
                "status": "published",
            },
            {
                "title": "Mentions légales",
                "slug": "mentions-legales",
                "content": """
# Mentions Légales

## Éditeur du site
Olympiades d'Intelligence Artificielle du Bénin (OAIB)
Cotonou, Bénin
Email : contact@oaib.bj

## Hébergement
Le site est hébergé sur une infrastructure cloud sécurisée.

## Propriété intellectuelle
L'ensemble du contenu de ce site (textes, images, logos) est protégé par le droit d'auteur.
Toute reproduction sans autorisation écrite est interdite.

## Protection des données
Les données personnelles collectées sont traitées conformément à la réglementation
en vigueur au Bénin et aux principes du RGPD.
                """.strip(),
                "status": "published",
            },
            {
                "title": "Politique de confidentialité",
                "slug": "politique-confidentialite",
                "content": """
# Politique de Confidentialité

## Collecte des données
Nous collectons uniquement les données nécessaires au bon fonctionnement de la plateforme :
nom, prénom, email, établissement scolaire, notes académiques.

## Utilisation des données
Vos données sont utilisées exclusivement pour la gestion de votre inscription,
le suivi de votre parcours dans les OAIB et la communication d'informations relatives à la compétition.

## Protection des mineurs
Pour les candidats de moins de 18 ans, les informations du tuteur légal sont obligatoires.
Aucune donnée n'est partagée sans consentement.

## Vos droits
Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
Contactez-nous à : support@oaib.bj
                """.strip(),
                "status": "published",
            },
        ]
        for p in pages:
            _, created = Page.objects.update_or_create(slug=p["slug"], defaults=p)
        self.stdout.write(f"  Pages : {len(pages)} pages")

    # ── Actualités ────────────────────────────────────────────
    def _seed_news(self):
        now = timezone.now()
        articles = [
            {
                "title": "Lancement officiel des OAIB 2026 !",
                "excerpt": "La première édition des Olympiades d'Intelligence Artificielle du Bénin est officiellement lancée. Inscrivez-vous dès maintenant !",
                "content": """
Les Olympiades d'Intelligence Artificielle du Bénin (OAIB) 2026 sont officiellement lancées !

Cette compétition inédite au Bénin vise à identifier et former les meilleurs talents en IA parmi les lycéens
et étudiants du pays. Les inscriptions sont ouvertes du 1er mars au 30 juin 2026.

**Ce qui vous attend :**
- Un QCM en ligne pour la phase de sélection
- Des épreuves pratiques de programmation
- Un hackathon final avec des projets concrets
- Des prix et bourses pour les meilleurs candidats

**Comment s'inscrire ?**
Rendez-vous sur notre plateforme, créez votre compte et complétez votre profil candidat.
Les inscriptions sont gratuites et ouvertes à tous les jeunes béninois de 15 à 25 ans.

Nous comptons sur votre participation pour faire de cette première édition un succès historique !
                """.strip(),
                "author": "Comité OAIB",
                "status": "published",
                "published_at": now - timedelta(days=2),
            },
            {
                "title": "Partenariat stratégique avec l'Université d'Abomey-Calavi",
                "excerpt": "L'UAC rejoint les OAIB en tant que partenaire académique principal pour accompagner les candidats.",
                "content": """
Nous sommes ravis d'annoncer un partenariat stratégique avec l'Université d'Abomey-Calavi (UAC),
la première université publique du Bénin.

Ce partenariat comprend :
- La mise à disposition de salles pour les épreuves en présentiel
- L'accès à des laboratoires informatiques pour les phases pratiques
- Le mentorat par des professeurs du département d'informatique
- Des bourses d'études pour les meilleurs candidats souhaitant poursuivre en IA

Le Professeur Dr. Kokou Amouzou, directeur du département informatique de l'UAC, a déclaré :
"Nous sommes fiers de soutenir cette initiative qui va contribuer à former la prochaine génération
de chercheurs et ingénieurs en IA au Bénin."
                """.strip(),
                "author": "Communication OAIB",
                "status": "published",
                "published_at": now - timedelta(days=7),
            },
            {
                "title": "Programme de formation gratuit en Python et IA",
                "excerpt": "Préparez-vous aux OAIB avec notre programme de formation en ligne gratuit : Python, Machine Learning et Data Science.",
                "content": """
Pour aider tous les candidats à se préparer au mieux, les OAIB mettent à disposition un programme
de formation en ligne entièrement gratuit.

**Module 1 — Python pour l'IA** (2 semaines)
- Bases de Python : variables, boucles, fonctions
- Bibliothèques essentielles : NumPy, Pandas
- Exercices pratiques guidés

**Module 2 — Machine Learning** (3 semaines)
- Introduction aux algorithmes supervisés et non supervisés
- Régression, classification, clustering
- Scikit-learn en pratique

**Module 3 — Deep Learning & Vision** (2 semaines)
- Introduction aux réseaux de neurones
- CNN pour la classification d'images
- Projets pratiques avec TensorFlow/PyTorch

Tous les contenus sont accessibles depuis l'espace Ressources de votre compte candidat.
                """.strip(),
                "author": "Équipe pédagogique OAIB",
                "status": "published",
                "published_at": now - timedelta(days=14),
            },
            {
                "title": "Les OAIB reçoivent le soutien du Ministère du Numérique",
                "excerpt": "Le Ministère du Numérique et de la Digitalisation apporte son soutien officiel aux Olympiades d'IA du Bénin.",
                "content": """
Le Ministère du Numérique et de la Digitalisation du Bénin a officiellement apporté son soutien
aux Olympiades d'Intelligence Artificielle du Bénin (OAIB) 2026.

Ce soutien se traduit par :
- Un financement pour l'organisation de la finale nationale
- La promotion de l'événement dans les établissements scolaires
- L'intégration des OAIB dans la stratégie nationale de développement du numérique
- La reconnaissance officielle des lauréats

La Ministre a souligné l'importance de "préparer la jeunesse béninoise aux métiers de demain
et de positionner le Bénin comme un acteur majeur de l'IA en Afrique de l'Ouest."
                """.strip(),
                "author": "Relations institutionnelles",
                "status": "published",
                "published_at": now - timedelta(days=21),
            },
            {
                "title": "Calendrier détaillé des phases de compétition",
                "excerpt": "Découvrez le calendrier complet des 6 phases des OAIB 2026, du QCM en ligne à la finale nationale.",
                "content": """
Le calendrier officiel des OAIB 2026 est désormais disponible :

**Phase 1 — Inscriptions** (1er Mars — 30 Juin)
Créez votre compte et complétez votre dossier de candidature.

**Phase 2 — QCM en ligne** (1er — 15 Juillet)
Épreuve de sélection : 60 questions en 90 minutes (logique, maths, programmation, culture IA).

**Phase 3 — Épreuves pratiques** (1er — 31 Août)
Les 200 meilleurs candidats passent des épreuves de programmation Python.

**Phase 4 — Formation intensive** (Septembre)
Les 50 finalistes bénéficient d'une formation accélérée en IA et Machine Learning.

**Phase 5 — Hackathon final** (Octobre)
Projet en équipe à réaliser en 48h sur une problématique IA réelle.

**Phase 6 — Cérémonie et prix** (Novembre)
Remise des prix, bourses et certificats lors d'une cérémonie officielle à Cotonou.

Préparez-vous dès maintenant !
                """.strip(),
                "author": "Organisation OAIB",
                "status": "published",
                "published_at": now - timedelta(days=30),
            },
            {
                "title": "Témoignage : pourquoi l'IA est l'avenir du Bénin",
                "excerpt": "Dr. Fatoumata Diallo, chercheuse en IA, partage sa vision sur le potentiel de l'IA pour le développement du Bénin.",
                "content": """
Dr. Fatoumata Diallo, chercheuse en Intelligence Artificielle à l'Institut de Recherche pour le Développement,
est l'une des marraines des OAIB 2026. Elle nous partage sa vision.

"L'intelligence artificielle n'est pas une mode passagère. C'est une révolution technologique qui va
transformer tous les secteurs : agriculture, santé, éducation, finance. Le Bénin a tout le potentiel
pour devenir un leader africain dans ce domaine."

"Ce qui me passionne dans les OAIB, c'est la démocratisation de l'accès à ces connaissances.
Un lycéen de Natitingou a autant le droit d'apprendre le Machine Learning qu'un étudiant de Cotonou.
C'est cette vision inclusive qui fait la force de cette initiative."

"Mon conseil aux candidats : n'ayez pas peur de l'échec. L'IA s'apprend par la pratique,
par l'expérimentation. Participez, testez, codez. C'est en faisant qu'on apprend le mieux."
                """.strip(),
                "author": "Dr. Fatoumata Diallo",
                "status": "published",
                "published_at": now - timedelta(days=45),
            },
        ]
        for a in articles:
            _, created = NewsArticle.objects.update_or_create(title=a["title"], defaults=a)
        self.stdout.write(f"  Actualités : {len(articles)} articles")

    # ── FAQ ───────────────────────────────────────────────────
    def _seed_faq(self):
        faqs = [
            ("Qui peut participer aux OAIB ?", "Tous les jeunes béninois âgés de 15 à 25 ans, qu'ils soient lycéens ou étudiants. La compétition est ouverte à tous les niveaux, de la Seconde à la Licence.", "Inscription", 1),
            ("L'inscription est-elle payante ?", "Non, l'inscription aux OAIB est entièrement gratuite. Nous croyons que l'accès au savoir en IA doit être ouvert à tous.", "Inscription", 2),
            ("Quels documents fournir pour s'inscrire ?", "Vous devez fournir : une pièce d'identité, un bulletin scolaire récent, et les coordonnées de votre tuteur si vous avez moins de 18 ans.", "Inscription", 3),
            ("Faut-il savoir programmer pour participer ?", "Pas nécessairement pour la phase QCM. Les questions couvrent la logique, les mathématiques et la culture générale en IA. Les phases suivantes requièrent des bases en Python.", "Compétition", 4),
            ("Comment se déroule le QCM en ligne ?", "Le QCM comprend 60 questions à choix multiples réparties en 4 catégories : Logique, Mathématiques, Programmation et Culture IA. Durée : 90 minutes. Un système anti-triche est en place.", "Compétition", 5),
            ("Quels sont les prix à gagner ?", "Les lauréats reçoivent des bourses d'études (jusqu'à 2 millions FCFA), du matériel informatique, des certifications reconnues, et des opportunités de stage dans des entreprises tech.", "Prix", 6),
            ("Comment me préparer aux épreuves ?", "Consultez notre espace Ressources pour accéder à des cours gratuits en Python, Machine Learning et Data Science. Des exercices d'entraînement sont également disponibles.", "Préparation", 7),
            ("Puis-je participer depuis n'importe quelle ville du Bénin ?", "Oui ! Les phases en ligne (QCM, formations) sont accessibles de partout. Pour les épreuves en présentiel, des centres sont prévus dans les 12 départements.", "Logistique", 8),
            ("Comment contacter l'équipe OAIB ?", "Envoyez-nous un email à contact@oaib.bj ou utilisez le formulaire de contact sur la page À propos. Nous répondons sous 48h.", "Contact", 9),
            ("Les résultats sont-ils publiés en ligne ?", "Oui, les résultats de chaque phase sont publiés sur la plateforme dans votre espace candidat, et les classements généraux sont affichés sur la page Résultats.", "Résultats", 10),
        ]
        for q, a, cat, order in faqs:
            FAQItem.objects.update_or_create(
                question=q,
                defaults={"answer": a, "category": cat, "display_order": order, "is_active": True},
            )
        self.stdout.write(f"  FAQ : {len(faqs)} entrées")

    # ── Partenaires ───────────────────────────────────────────
    def _seed_partners(self):
        partners = [
            ("Université d'Abomey-Calavi", "https://www.uac.bj", "gold", 1),
            ("Ministère du Numérique du Bénin", "https://numerique.gouv.bj", "gold", 2),
            ("Google Developer Group Cotonou", "https://gdg.community.dev/gdg-cotonou/", "silver", 3),
            ("Epitech Bénin", "https://www.epitech.eu/fr/ecole-informatique-benin/", "silver", 4),
            ("Sèmè City", "https://www.semecity.bj", "silver", 5),
            ("Blolab Cotonou", "https://blolab.org", "bronze", 6),
            ("SBEE Tech Innovation", "", "bronze", 7),
            ("Fondation Zinsou", "https://www.fondationzinsou.org", "bronze", 8),
        ]
        for name, website, tier, order in partners:
            Partner.objects.update_or_create(
                name=name,
                defaults={
                    "website": website,
                    "tier": tier,
                    "display_order": order,
                    "is_active": True,
                    # logo is an ImageField — left blank (no file upload in seeds)
                },
            )
        self.stdout.write(f"  Partenaires : {len(partners)}")

    # ── Éditions & Phases ─────────────────────────────────────
    def _seed_editions_phases(self):
        # Édition 2026 (active)
        ed26, _ = Edition.objects.update_or_create(
            year=2026,
            defaults={
                "title": "OAIB 2026 — Première Édition",
                "description": "Première édition historique des Olympiades d'Intelligence Artificielle du Bénin. Plus de 1000 candidats attendus dans les 12 départements.",
                "is_active": True,
            },
        )
        phases_2026 = [
            (1, "Inscriptions", "Ouverture des inscriptions en ligne et constitution des dossiers de candidature.", "2026-03-01", "2026-06-30", "active"),
            (2, "QCM en ligne", "Épreuve de sélection : 60 questions (logique, maths, programmation, culture IA) en 90 minutes.", "2026-07-01", "2026-07-15", "upcoming"),
            (3, "Épreuves pratiques", "Les 200 meilleurs candidats passent des épreuves de programmation Python et résolution de problèmes.", "2026-08-01", "2026-08-31", "upcoming"),
            (4, "Formation intensive", "Les 50 finalistes suivent une formation accélérée en IA, ML et Data Science avec des experts.", "2026-09-01", "2026-09-30", "upcoming"),
            (5, "Hackathon final", "Projet en équipe de 48h sur une problématique IA concrète (santé, agriculture, éducation).", "2026-10-15", "2026-10-17", "upcoming"),
            (6, "Cérémonie & Prix", "Remise des prix, bourses et certificats lors d'une cérémonie officielle à Cotonou.", "2026-11-15", "2026-11-15", "upcoming"),
        ]
        for num, title, desc, start, end, status in phases_2026:
            Phase.objects.update_or_create(
                edition=ed26, phase_number=num,
                defaults={"title": title, "description": desc, "start_date": start, "end_date": end, "status": status},
            )

        # Édition 2025 (historique pour la page Résultats)
        ed25, _ = Edition.objects.update_or_create(
            year=2025,
            defaults={
                "title": "OAIB 2025 — Édition Pilote",
                "description": "Édition pilote organisée dans 3 départements (Littoral, Ouémé, Atlantique). 250 participants, 15 lauréats.",
                "is_active": False,
            },
        )

        self.stdout.write(f"  Éditions : 2 (2025 pilote + 2026 active) — 6 phases")

    # ── Catégories & Questions ────────────────────────────────
    def _seed_categories_questions(self):
        cats = {
            "Logique": "logique",
            "Mathématiques": "mathematiques",
            "Programmation": "programmation",
            "Machine Learning": "machine-learning",
            "Culture IA": "culture-ia",
        }
        cat_objs = {}
        for name, slug in cats.items():
            obj, _ = QuestionCategory.objects.update_or_create(name=name, defaults={"slug": slug})
            cat_objs[name] = obj

        # ── Questions complètes avec options ──
        questions_data = [
            # ─── Logique ──────────────────────────────────────
            {
                "text": "Si tous les chats sont des animaux et que certains animaux sont noirs, que peut-on conclure ?",
                "category": "Logique", "difficulty": "easy", "points": 1, "time_limit_seconds": 45,
                "options": [
                    ("Tous les chats sont noirs", False),
                    ("Certains chats peuvent être noirs", True),
                    ("Aucun chat n'est noir", False),
                    ("Tous les animaux noirs sont des chats", False),
                ],
            },
            {
                "text": "Quelle est la prochaine valeur de la suite : 2, 6, 12, 20, 30, ... ?",
                "category": "Logique", "difficulty": "medium", "points": 2, "time_limit_seconds": 60,
                "options": [
                    ("40", False),
                    ("42", True),
                    ("36", False),
                    ("44", False),
                ],
            },
            {
                "text": "Un algorithme de recherche binaire a une complexité de O(log n). Si n = 1 000 000, combien d'itérations au maximum ?",
                "category": "Logique", "difficulty": "hard", "points": 3, "time_limit_seconds": 90,
                "options": [
                    ("10", False),
                    ("20", True),
                    ("100", False),
                    ("1000", False),
                ],
            },
            {
                "text": "Dans un tournoi à élimination directe avec 16 joueurs, combien de matchs au total ?",
                "category": "Logique", "difficulty": "easy", "points": 1, "time_limit_seconds": 45,
                "options": [
                    ("15", True),
                    ("16", False),
                    ("8", False),
                    ("32", False),
                ],
            },

            # ─── Mathématiques ────────────────────────────────
            {
                "text": "Quelle est la dérivée de f(x) = x³ + 2x² - 5x + 3 ?",
                "category": "Mathématiques", "difficulty": "easy", "points": 1, "time_limit_seconds": 45,
                "options": [
                    ("3x² + 4x - 5", True),
                    ("3x² + 2x - 5", False),
                    ("x² + 4x - 5", False),
                    ("3x² + 4x + 3", False),
                ],
            },
            {
                "text": "Quelle est la probabilité d'obtenir au moins un 6 en lançant deux dés ?",
                "category": "Mathématiques", "difficulty": "medium", "points": 2, "time_limit_seconds": 60,
                "options": [
                    ("1/6", False),
                    ("11/36", True),
                    ("1/3", False),
                    ("2/6", False),
                ],
            },
            {
                "text": "Quel est le déterminant de la matrice [[3, 1], [2, 4]] ?",
                "category": "Mathématiques", "difficulty": "easy", "points": 1, "time_limit_seconds": 45,
                "options": [
                    ("10", True),
                    ("14", False),
                    ("12", False),
                    ("5", False),
                ],
            },
            {
                "text": "Combien de façons peut-on choisir 3 éléments parmi 10 (combinaison C(10,3)) ?",
                "category": "Mathématiques", "difficulty": "medium", "points": 2, "time_limit_seconds": 60,
                "options": [
                    ("120", True),
                    ("720", False),
                    ("210", False),
                    ("30", False),
                ],
            },

            # ─── Programmation ────────────────────────────────
            {
                "text": "En Python, que retourne len([1, [2, 3], 4]) ?",
                "category": "Programmation", "difficulty": "easy", "points": 1, "time_limit_seconds": 30,
                "options": [
                    ("3", True),
                    ("4", False),
                    ("5", False),
                    ("Erreur", False),
                ],
            },
            {
                "text": "Quelle est la sortie de : print(list(range(0, 10, 3))) ?",
                "category": "Programmation", "difficulty": "easy", "points": 1, "time_limit_seconds": 30,
                "options": [
                    ("[0, 3, 6, 9]", True),
                    ("[0, 3, 6]", False),
                    ("[3, 6, 9]", False),
                    ("[0, 1, 2, 3]", False),
                ],
            },
            {
                "text": "Quelle structure de données utiliser pour vérifier en O(1) si un élément existe ?",
                "category": "Programmation", "difficulty": "medium", "points": 2, "time_limit_seconds": 45,
                "options": [
                    ("Liste", False),
                    ("Ensemble (set)", True),
                    ("Tuple", False),
                    ("File (queue)", False),
                ],
            },
            {
                "text": "Quelle est la complexité temporelle du tri par fusion (merge sort) ?",
                "category": "Programmation", "difficulty": "hard", "points": 3, "time_limit_seconds": 60,
                "options": [
                    ("O(n²)", False),
                    ("O(n log n)", True),
                    ("O(n)", False),
                    ("O(log n)", False),
                ],
            },
            {
                "text": "En Python, que fait la méthode .get() sur un dictionnaire ?",
                "category": "Programmation", "difficulty": "easy", "points": 1, "time_limit_seconds": 30,
                "options": [
                    ("Retourne la valeur ou None si la clé n'existe pas", True),
                    ("Lève une KeyError si la clé n'existe pas", False),
                    ("Ajoute une nouvelle clé", False),
                    ("Supprime la clé du dictionnaire", False),
                ],
            },

            # ─── Machine Learning ─────────────────────────────
            {
                "text": "Qu'est-ce que le surapprentissage (overfitting) ?",
                "category": "Machine Learning", "difficulty": "easy", "points": 1, "time_limit_seconds": 45,
                "options": [
                    ("Le modèle apprend trop bien les données d'entraînement et généralise mal", True),
                    ("Le modèle ne converge jamais", False),
                    ("Le modèle est trop simple pour capturer les patterns", False),
                    ("Le modèle utilise trop de mémoire", False),
                ],
            },
            {
                "text": "Quelle métrique utiliser pour un problème de classification avec classes déséquilibrées ?",
                "category": "Machine Learning", "difficulty": "medium", "points": 2, "time_limit_seconds": 60,
                "options": [
                    ("Accuracy seule", False),
                    ("F1-Score", True),
                    ("MSE (Mean Squared Error)", False),
                    ("R²", False),
                ],
            },
            {
                "text": "Quel algorithme est utilisé pour réduire la dimensionnalité des données ?",
                "category": "Machine Learning", "difficulty": "medium", "points": 2, "time_limit_seconds": 60,
                "options": [
                    ("K-Means", False),
                    ("PCA (Analyse en Composantes Principales)", True),
                    ("Random Forest", False),
                    ("Gradient Descent", False),
                ],
            },
            {
                "text": "Dans un réseau de neurones, quel est le rôle de la fonction d'activation ?",
                "category": "Machine Learning", "difficulty": "medium", "points": 2, "time_limit_seconds": 60,
                "options": [
                    ("Introduire de la non-linéarité dans le modèle", True),
                    ("Réduire le nombre de paramètres", False),
                    ("Normaliser les données d'entrée", False),
                    ("Calculer la loss function", False),
                ],
            },
            {
                "text": "Quel est l'avantage principal d'un CNN par rapport à un réseau fully-connected pour les images ?",
                "category": "Machine Learning", "difficulty": "hard", "points": 3, "time_limit_seconds": 90,
                "options": [
                    ("Moins de paramètres grâce au partage de poids (convolutions)", True),
                    ("Convergence plus rapide systématiquement", False),
                    ("Ne nécessite pas de GPU", False),
                    ("Fonctionne sans données d'entraînement", False),
                ],
            },

            # ─── Culture IA ───────────────────────────────────
            {
                "text": "Qui est considéré comme le 'père de l'intelligence artificielle' ?",
                "category": "Culture IA", "difficulty": "easy", "points": 1, "time_limit_seconds": 30,
                "options": [
                    ("Alan Turing", True),
                    ("Steve Jobs", False),
                    ("Mark Zuckerberg", False),
                    ("Elon Musk", False),
                ],
            },
            {
                "text": "En quelle année le programme AlphaGo a-t-il battu Lee Sedol au jeu de Go ?",
                "category": "Culture IA", "difficulty": "easy", "points": 1, "time_limit_seconds": 30,
                "options": [
                    ("2012", False),
                    ("2016", True),
                    ("2018", False),
                    ("2020", False),
                ],
            },
            {
                "text": "Quel modèle de langage a marqué un tournant en 2022 en démocratisant l'IA conversationnelle ?",
                "category": "Culture IA", "difficulty": "easy", "points": 1, "time_limit_seconds": 30,
                "options": [
                    ("GPT-2", False),
                    ("ChatGPT (GPT-3.5)", True),
                    ("BERT", False),
                    ("AlexNet", False),
                ],
            },
            {
                "text": "Qu'est-ce que le test de Turing ?",
                "category": "Culture IA", "difficulty": "medium", "points": 2, "time_limit_seconds": 60,
                "options": [
                    ("Un test pour vérifier si une machine peut se faire passer pour un humain", True),
                    ("Un test de performance GPU", False),
                    ("Un benchmark de vitesse d'algorithme", False),
                    ("Un test d'intrusion informatique", False),
                ],
            },
            {
                "text": "Quelle entreprise a développé le framework TensorFlow ?",
                "category": "Culture IA", "difficulty": "easy", "points": 1, "time_limit_seconds": 30,
                "options": [
                    ("Facebook (Meta)", False),
                    ("Google", True),
                    ("Microsoft", False),
                    ("Amazon", False),
                ],
            },
        ]

        created_count = 0
        for qd in questions_data:
            q, created = Question.objects.update_or_create(
                text=qd["text"],
                defaults={
                    "category": cat_objs[qd["category"]],
                    "difficulty": qd["difficulty"],
                    "points": qd["points"],
                    "time_limit_seconds": qd["time_limit_seconds"],
                    "is_active": True,
                },
            )
            if created:
                created_count += 1
            # Always recreate options
            q.options.all().delete()
            for i, (text, correct) in enumerate(qd["options"]):
                QuestionOption.objects.create(question=q, text=text, is_correct=correct, order=i + 1)

        self.stdout.write(f"  Questions : {len(questions_data)} questions (5 catégories)")

    # ── Ressources ────────────────────────────────────────────
    def _seed_resources(self):
        resources = [
            ("Introduction à Python pour débutants", "Cours complet pour apprendre les bases de Python : variables, types, boucles, fonctions et classes.", "article", "", "Python", 1),
            ("NumPy & Pandas — Manipulation de données", "Tutoriel pratique sur les bibliothèques essentielles pour la data science en Python.", "article", "", "Data Science", 2),
            ("Vidéo : Comprendre le Machine Learning en 30 min", "Introduction accessible aux concepts de base du ML : supervisé, non supervisé, renforcement.", "video", "https://www.youtube.com/watch?v=example_ml", "Machine Learning", 2),
            ("Exercices de logique algorithmique", "50 exercices progressifs pour entraîner votre raisonnement logique et algorithmique.", "exercise", "", "Logique", 1),
            ("Introduction aux réseaux de neurones", "Guide illustré pour comprendre le fonctionnement des réseaux de neurones artificiels.", "article", "", "Deep Learning", 3),
            ("Scikit-learn : Guide pratique", "Apprenez à utiliser scikit-learn pour la classification, la régression et le clustering.", "article", "", "Machine Learning", 3),
            ("Vidéo : Python en 1h — Crash Course", "Formation accélérée en Python pour les candidats OAIB.", "video", "https://www.youtube.com/watch?v=example_python", "Python", 1),
            ("QCM d'entraînement — Logique", "Testez vos connaissances avec ce QCM d'entraînement de 20 questions.", "exercise", "", "Logique", 1),
            ("QCM d'entraînement — Culture IA", "30 questions pour tester votre culture générale en intelligence artificielle.", "exercise", "", "Culture IA", 1),
            ("Guide : Préparer les OAIB efficacement", "Conseils méthodologiques et planning de révision pour maximiser vos chances.", "article", "", "Préparation", 1),
            ("TensorFlow pour débutants", "Premiers pas avec TensorFlow : installation, tenseurs, modèles simples.", "article", "", "Deep Learning", 4),
            ("Mathématiques pour le Machine Learning", "Rappels essentiels : algèbre linéaire, probabilités, statistiques et calcul différentiel.", "article", "", "Mathématiques", 2),
        ]
        for title, desc, rtype, url, cat, phase in resources:
            Resource.objects.update_or_create(
                title=title,
                defaults={
                    "description": desc,
                    "resource_type": rtype,
                    "url": url,
                    "category": cat,
                    "phase": phase,
                    "is_active": True,
                },
            )
        self.stdout.write(f"  Ressources : {len(resources)}")
