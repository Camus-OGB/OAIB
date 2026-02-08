import React from 'react';
import { ShieldCheck, Lock, Eye, UserCheck, Database } from 'lucide-react';
import { usePageTitle } from '../../shared/hooks/usePageTitle';
import { AnimatedSection, AnimatedCard } from '../../shared/components/layout/AnimatedSection';

const PrivacyPolicy: React.FC = () => {
  usePageTitle('Politique de Confidentialité');

  const principles = [
    {
      icon: Lock,
      title: "Sécurité des données",
      desc: "Vos données sont cryptées et stockées de manière sécurisée"
    },
    {
      icon: Eye,
      title: "Transparence totale",
      desc: "Nous vous informons clairement de l'usage de vos données"
    },
    {
      icon: UserCheck,
      title: "Contrôle utilisateur",
      desc: "Vous gardez le contrôle total sur vos informations"
    },
    {
      icon: Database,
      title: "Minimisation",
      desc: "Nous ne collectons que les données strictement nécessaires"
    }
  ];

  return (
    <div className="w-full bg-background">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary-dark to-primary">
        <div className="px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="text-primary" size={32} />
              </div>
              <h1 className="text-white text-4xl md:text-5xl font-black mb-4">
                Politique de Confidentialité
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Votre vie privée est notre priorité. Découvrez comment nous protégeons vos données.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-16 -mt-10 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.1}>
                <div className="bg-white rounded-2xl p-6 border border-border shadow-sm h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <principle.icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">{principle.title}</h3>
                  <p className="text-text-secondary text-sm">{principle.desc}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-12 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-border p-8 md:p-12 shadow-sm">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-black text-text mb-6">
                1. Données collectées
              </h2>
              <p className="text-text-secondary mb-4">
                Dans le cadre de votre participation aux Olympiades d'Intelligence Artificielle du Bénin, nous collectons les données suivantes :
              </p>
              <ul className="text-text-secondary space-y-2 mb-8">
                <li><strong>Informations d'identification :</strong> nom, prénom, date de naissance, photo</li>
                <li><strong>Coordonnées :</strong> adresse email, numéro de téléphone, adresse postale</li>
                <li><strong>Informations académiques :</strong> établissement scolaire, niveau d'études, diplômes</li>
                <li><strong>Données de participation :</strong> résultats aux épreuves, projets soumis, classements</li>
                <li><strong>Données techniques :</strong> adresse IP, cookies, logs de connexion</li>
              </ul>

              <h2 className="text-2xl font-black text-text mb-6 mt-12">
                2. Finalités du traitement
              </h2>
              <p className="text-text-secondary mb-4">
                Vos données personnelles sont utilisées pour :
              </p>
              <ul className="text-text-secondary space-y-2 mb-8">
                <li>Gérer votre inscription et votre participation aux Olympiades</li>
                <li>Organiser les épreuves et établir les classements</li>
                <li>Vous informer des actualités et événements de l'OAIB</li>
                <li>Améliorer nos services et notre plateforme</li>
                <li>Respecter nos obligations légales et réglementaires</li>
                <li>Produire des statistiques anonymisées</li>
              </ul>

              <h2 className="text-2xl font-black text-text mb-6 mt-12">
                3. Vos droits
              </h2>
              <p className="text-text-secondary mb-4">
                Conformément au RGPD et à la loi béninoise, vous disposez des droits suivants :
              </p>
              <ul className="text-text-secondary space-y-2 mb-8">
                <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              </ul>
              <p className="text-text-secondary mb-8">
                Pour exercer vos droits, contactez-nous à : <a href="mailto:dpo@oaib.bj" className="text-primary font-bold hover:underline">dpo@oaib.bj</a>
              </p>

              <h2 className="text-2xl font-black text-text mb-6 mt-12">
                4. Contact
              </h2>
              <div className="bg-primary/10 rounded-2xl p-6 mb-8">
                <p className="text-text-secondary mb-2">
                  <strong>Email :</strong> <a href="mailto:dpo@oaib.bj" className="text-primary hover:underline">dpo@oaib.bj</a>
                </p>
                <p className="text-text-secondary mb-2">
                  <strong>Adresse :</strong> Cotonou Digital Hub, Avenue Jean-Paul II, Cotonou, Bénin
                </p>
                <p className="text-text-secondary">
                  <strong>Téléphone :</strong> +229 21 00 00 00
                </p>
              </div>

              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-text-muted text-sm">
                  Dernière mise à jour : 6 février 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
