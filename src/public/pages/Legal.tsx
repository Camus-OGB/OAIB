import React from 'react';
import { usePageTitle } from '../../shared/hooks/usePageTitle';
import { AnimatedSection } from '../../shared/components/layout/AnimatedSection';
import { Shield, FileText, Scale } from 'lucide-react';

const Legal: React.FC = () => {
  usePageTitle('Mentions Légales');

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Hero */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-20 py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent rounded-xl">
                <Scale className="w-8 h-8 text-primary" />
              </div>
              <span className="px-4 py-1.5 bg-accent text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                Informations Légales
              </span>
            </div>
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
              Mentions Légales
            </h1>
            <p className="text-white/80 text-lg">
              Informations juridiques et conditions d'utilisation du site des Olympiades d'Intelligence Artificielle du Bénin.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-border p-8 md:p-12 space-y-12">
            
            {/* Éditeur */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-black text-text">Éditeur du Site</h2>
              </div>
              <div className="prose max-w-none">
                <p className="text-text-secondary leading-relaxed mb-4">
                  Le site web <strong>www.oia-benin.org</strong> est édité par :
                </p>
                <div className="bg-background p-6 rounded-xl">
                  <p className="text-text mb-2"><strong>Organisation des Olympiades d'Intelligence Artificielle du Bénin (OAIB)</strong></p>
                  <p className="text-text-secondary text-sm">Cotonou Digital Hub</p>
                  <p className="text-text-secondary text-sm">Avenue Jean-Paul II, Cotonou, Bénin</p>
                  <p className="text-text-secondary text-sm mt-3">Email : contact@oia-benin.org</p>
                  <p className="text-text-secondary text-sm">Téléphone : +229 21 00 00 00</p>
                </div>
              </div>
            </div>

            {/* Directeur de publication */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-black text-text">Directeur de la Publication</h2>
              </div>
              <p className="text-text-secondary leading-relaxed">
                Dr. Koffi Mensah, Président de l'OAIB
              </p>
            </div>

            {/* Hébergement */}
            <div>
              <h2 className="text-2xl font-black text-text mb-4">Hébergement</h2>
              <div className="prose max-w-none">
                <p className="text-text-secondary leading-relaxed mb-4">
                  Le site est hébergé par :
                </p>
                <div className="bg-background p-6 rounded-xl">
                  <p className="text-text mb-2"><strong>Vercel Inc.</strong></p>
                  <p className="text-text-secondary text-sm">440 N Barranca Ave #4133</p>
                  <p className="text-text-secondary text-sm">Covina, CA 91723, États-Unis</p>
                </div>
              </div>
            </div>

            {/* Propriété intellectuelle */}
            <div>
              <h2 className="text-2xl font-black text-text mb-4">Propriété Intellectuelle</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, mise en page) est la propriété exclusive de l'OAIB, sauf mention contraire.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de l'OAIB.
                </p>
                <p>
                  Les marques, logos et autres signes distinctifs reproduits sur ce site sont la propriété de l'OAIB ou de ses partenaires. Toute reproduction ou utilisation non autorisée de ces éléments constitue une contrefaçon.
                </p>
              </div>
            </div>

            {/* Données personnelles */}
            <div>
              <h2 className="text-2xl font-black text-text mb-4">Protection des Données Personnelles</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Conformément à la loi béninoise sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
                </p>
                <p>
                  Pour exercer ce droit, vous pouvez nous contacter à l'adresse : <strong className="text-primary">privacy@oia-benin.org</strong>
                </p>
                <p>
                  Pour plus d'informations, consultez notre <a href="/confidentialite" className="text-primary font-bold hover:underline">Politique de Confidentialité</a>.
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-2xl font-black text-text mb-4">Cookies</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Ce site utilise des cookies pour améliorer votre expérience de navigation et pour réaliser des statistiques de visites.
                </p>
                <p>
                  Vous pouvez configurer votre navigateur pour refuser les cookies. Cependant, certaines fonctionnalités du site pourraient ne pas fonctionner correctement.
                </p>
              </div>
            </div>

            {/* Responsabilité */}
            <div>
              <h2 className="text-2xl font-black text-text mb-4">Limitation de Responsabilité</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  L'OAIB s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
                </p>
                <p>
                  L'OAIB ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation de ce site ou de l'impossibilité d'y accéder.
                </p>
              </div>
            </div>

            {/* Liens externes */}
            <div>
              <h2 className="text-2xl font-black text-text mb-4">Liens Externes</h2>
              <p className="text-text-secondary leading-relaxed">
                Ce site peut contenir des liens vers des sites externes. L'OAIB n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
              </p>
            </div>

            {/* Droit applicable */}
            <div className="pt-8 border-t border-border">
              <h2 className="text-2xl font-black text-text mb-4">Droit Applicable</h2>
              <p className="text-text-secondary leading-relaxed">
                Les présentes mentions légales sont régies par le droit béninois. Tout litige relatif à l'utilisation de ce site sera soumis à la compétence exclusive des tribunaux du Bénin.
              </p>
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

export default Legal;
