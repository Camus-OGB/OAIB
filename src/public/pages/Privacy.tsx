import React from 'react';
import { usePageTitle } from '../../shared/hooks/usePageTitle';
import { AnimatedSection } from '../../shared/components/layout/AnimatedSection';
import { ShieldCheck, Lock, Eye, Database, UserX, Bell } from 'lucide-react';

const Privacy: React.FC = () => {
  usePageTitle('Politique de Confidentialité');

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Hero */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-20 py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent rounded-xl">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <span className="px-4 py-1.5 bg-accent text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                Protection des Données
              </span>
            </div>
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
              Politique de Confidentialité
            </h1>
            <p className="text-white/80 text-lg">
              Nous nous engageons à protéger vos données personnelles et à respecter votre vie privée.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-border p-8 md:p-12 space-y-12">
            
            {/* Introduction */}
            <div>
              <p className="text-text-secondary leading-relaxed text-lg">
                Cette politique de confidentialité décrit comment l'OAIB collecte, utilise et protège vos données personnelles lorsque vous utilisez notre site web et participez à nos programmes.
              </p>
            </div>

            {/* Données collectées */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-black text-text">Données que nous collectons</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-background p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-text mb-3">Informations d'inscription</h3>
                  <ul className="list-disc list-inside space-y-2 text-text-secondary">
                    <li>Nom et prénom</li>
                    <li>Date de naissance</li>
                    <li>Adresse email</li>
                    <li>Numéro de téléphone</li>
                    <li>Établissement scolaire</li>
                    <li>Niveau d'études</li>
                  </ul>
                </div>

                <div className="bg-background p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-text mb-3">Données de navigation</h3>
                  <ul className="list-disc list-inside space-y-2 text-text-secondary">
                    <li>Adresse IP</li>
                    <li>Type de navigateur</li>
                    <li>Pages visitées</li>
                    <li>Durée des visites</li>
                    <li>Cookies techniques</li>
                  </ul>
                </div>

                <div className="bg-background p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-text mb-3">Données de participation</h3>
                  <ul className="list-disc list-inside space-y-2 text-text-secondary">
                    <li>Résultats aux épreuves</li>
                    <li>Projets soumis</li>
                    <li>Code source (avec votre consentement)</li>
                    <li>Feedback et évaluations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Utilisation des données */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-black text-text">Utilisation de vos données</h2>
              </div>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>Nous utilisons vos données personnelles pour :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Gérer votre inscription et participation aux Olympiades</li>
                  <li>Vous communiquer les informations relatives à la compétition</li>
                  <li>Évaluer vos performances et établir les classements</li>
                  <li>Améliorer nos programmes et services</li>
                  <li>Vous envoyer des newsletters (avec votre consentement)</li>
                  <li>Établir des statistiques anonymisées</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </div>
            </div>

            {/* Base légale */}
            <div>
              <h2 className="text-2xl font-black text-text mb-4">Base Légale du Traitement</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>Nous traitons vos données sur la base de :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-text">Votre consentement</strong> : pour l'envoi de newsletters et communications marketing</li>
                  <li><strong className="text-text">L'exécution du contrat</strong> : pour gérer votre participation aux Olympiades</li>
                  <li><strong className="text-text">Notre intérêt légitime</strong> : pour améliorer nos services et établir des statistiques</li>
                  <li><strong className="text-text">Obligations légales</strong> : pour respecter la réglementation en vigueur</li>
                </ul>
              </div>
            </div>

            {/* Protection des données */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-black text-text">Sécurité de vos données</h2>
              </div>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                    <p className="font-bold text-text mb-2">Accès non autorisés</p>
                    <p className="text-sm">Authentification sécurisée et contrôle d'accès</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                    <p className="font-bold text-text mb-2">Perte de données</p>
                    <p className="text-sm">Sauvegardes régulières et redondance</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                    <p className="font-bold text-text mb-2">Altération</p>
                    <p className="text-sm">Chiffrement et intégrité des données</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                    <p className="font-bold text-text mb-2">Divulgation</p>
                    <p className="text-sm">Protocoles HTTPS et accès limité</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Partage des données */}
            <div>
              <h2 className="text-2xl font-black text-text mb-4">Partage de vos données</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Nous ne vendons jamais vos données personnelles. Nous pouvons les partager avec :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-text">Nos partenaires institutionnels</strong> : pour l'organisation des événements (avec votre consentement)</li>
                  <li><strong className="text-text">Prestataires de services</strong> : hébergement, emailing (sous contrat de confidentialité)</li>
                  <li><strong className="text-text">Autorités légales</strong> : si requis par la loi</li>
                </ul>
              </div>
            </div>

            {/* Droits */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <UserX className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-black text-text">Vos droits</h2>
              </div>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>Conformément à la législation, vous disposez des droits suivants :</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-background p-5 rounded-xl">
                    <h4 className="font-bold text-text mb-2">Droit d'accès</h4>
                    <p className="text-sm">Consulter les données que nous détenons sur vous</p>
                  </div>
                  <div className="bg-background p-5 rounded-xl">
                    <h4 className="font-bold text-text mb-2">Droit de rectification</h4>
                    <p className="text-sm">Corriger vos données inexactes ou incomplètes</p>
                  </div>
                  <div className="bg-background p-5 rounded-xl">
                    <h4 className="font-bold text-text mb-2">Droit à l'effacement</h4>
                    <p className="text-sm">Demander la suppression de vos données</p>
                  </div>
                  <div className="bg-background p-5 rounded-xl">
                    <h4 className="font-bold text-text mb-2">Droit d'opposition</h4>
                    <p className="text-sm">Refuser le traitement de vos données</p>
                  </div>
                  <div className="bg-background p-5 rounded-xl">
                    <h4 className="font-bold text-text mb-2">Droit à la portabilité</h4>
                    <p className="text-sm">Récupérer vos données dans un format structuré</p>
                  </div>
                  <div className="bg-background p-5 rounded-xl">
                    <h4 className="font-bold text-text mb-2">Droit de limitation</h4>
                    <p className="text-sm">Limiter le traitement dans certains cas</p>
                  </div>
                </div>

                <div className="bg-accent/10 p-6 rounded-xl border border-accent/30 mt-6">
                  <p className="font-bold text-text mb-2">Pour exercer vos droits :</p>
                  <p>Contactez-nous à : <strong className="text-primary">privacy@oia-benin.org</strong></p>
                  <p className="text-sm mt-2">Nous répondrons à votre demande dans un délai de 30 jours.</p>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-black text-text">Cookies et technologies similaires</h2>
              </div>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez configurer vos préférences à tout moment.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-background rounded-xl">
                    <div className="mt-1">✓</div>
                    <div>
                      <h4 className="font-bold text-text">Cookies essentiels</h4>
                      <p className="text-sm">Nécessaires au fonctionnement du site (toujours actifs)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-background rounded-xl">
                    <div className="mt-1">◯</div>
                    <div>
                      <h4 className="font-bold text-text">Cookies analytiques</h4>
                      <p className="text-sm">Pour comprendre comment vous utilisez le site</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-background rounded-xl">
                    <div className="mt-1">◯</div>
                    <div>
                      <h4 className="font-bold text-text">Cookies marketing</h4>
                      <p className="text-sm">Pour personnaliser le contenu et les publicités</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conservation */}
            <div>
              <h2 className="text-2xl font-black text-text mb-4">Durée de Conservation</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>Nous conservons vos données personnelles :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-text">Données d'inscription</strong> : Pendant la durée de votre participation + 3 ans</li>
                  <li><strong className="text-text">Résultats et projets</strong> : 5 ans pour archives historiques</li>
                  <li><strong className="text-text">Cookies</strong> : Maximum 13 mois</li>
                  <li><strong className="text-text">Données marketing</strong> : Jusqu'à retrait du consentement</li>
                </ul>
              </div>
            </div>

            {/* Modifications */}
            <div>
              <h2 className="text-2xl font-black text-text mb-4">Modifications de cette Politique</h2>
              <p className="text-text-secondary leading-relaxed">
                Nous pouvons modifier cette politique de confidentialité. Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour. Nous vous encourageons à consulter régulièrement cette page.
              </p>
            </div>

            {/* Contact */}
            <div className="pt-8 border-t border-border">
              <h2 className="text-2xl font-black text-text mb-4">Nous Contacter</h2>
              <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                <p className="text-text-secondary mb-4">
                  Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
                </p>
                <div className="space-y-2">
                  <p className="text-text"><strong>Email :</strong> privacy@oia-benin.org</p>
                  <p className="text-text"><strong>Courrier :</strong> OAIB - Data Protection Officer, Cotonou Digital Hub, Avenue Jean-Paul II, Cotonou, Bénin</p>
                </div>
              </div>
            </div>

            {/* Dernière mise à jour */}
            <div className="text-center pt-8 border-t border-border">
              <p className="text-sm text-text-muted">
                Dernière mise à jour : 6 février 2026
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
