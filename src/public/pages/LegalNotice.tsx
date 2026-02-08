import React from 'react';
import { Shield, Scale, FileText } from 'lucide-react';
import { usePageTitle } from '../../shared/hooks/usePageTitle';
import { AnimatedSection } from '../../shared/components/layout/AnimatedSection';

const LegalNotice: React.FC = () => {
  usePageTitle('Mentions Légales');

  return (
    <div className="w-full bg-background">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-accent to-blue">
        <div className="px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Scale className="text-primary" size={32} />
              </div>
              <h1 className="text-white text-4xl md:text-5xl font-black mb-4">
                Mentions Légales
              </h1>
              <p className="text-white/80 text-lg">
                Informations légales relatives au site OAIB
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-border p-8 md:p-12 shadow-sm">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-black text-text mb-6 flex items-center gap-3">
                <FileText className="text-primary" size={28} />
                Éditeur du site
              </h2>
              <p className="text-text-secondary mb-4">
                Le site <strong>www.oaib.bj</strong> est édité par :
              </p>
              <ul className="text-text-secondary space-y-2 mb-8">
                <li><strong>Organisation :</strong> Olympiades d'Intelligence Artificielle du Bénin (OAIB)</li>
                <li><strong>Statut juridique :</strong> Association à but non lucratif</li>
                <li><strong>Siège social :</strong> Cotonou Digital Hub, Avenue Jean-Paul II, Cotonou, Bénin</li>
                <li><strong>Email :</strong> contact@oaib.bj</li>
                <li><strong>Téléphone :</strong> +229 21 00 00 00</li>
              </ul>

              <h2 className="text-2xl font-black text-text mb-6 mt-12 flex items-center gap-3">
                <Shield className="text-primary" size={28} />
                Directeur de publication
              </h2>
              <p className="text-text-secondary mb-8">
                <strong>Dr. Koffi Mensah</strong>, Président de l'OAIB
              </p>

              <h2 className="text-2xl font-black text-text mb-6 mt-12">
                Hébergement
              </h2>
              <p className="text-text-secondary mb-4">
                Le site est hébergé par :
              </p>
              <ul className="text-text-secondary space-y-2 mb-8">
                <li><strong>Hébergeur :</strong> Vercel Inc.</li>
                <li><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
                <li><strong>Site web :</strong> <a href="https://vercel.com" className="text-primary hover:underline">vercel.com</a></li>
              </ul>

              <h2 className="text-2xl font-black text-text mb-6 mt-12">
                Propriété intellectuelle
              </h2>
              <p className="text-text-secondary mb-4">
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est la propriété exclusive de l'OAIB ou de ses partenaires, sauf mention contraire.
              </p>
              <p className="text-text-secondary mb-8">
                Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de l'OAIB.
              </p>

              <h2 className="text-2xl font-black text-text mb-6 mt-12">
                Données personnelles
              </h2>
              <p className="text-text-secondary mb-4">
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi béninoise sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
              </p>
              <p className="text-text-secondary mb-8">
                Pour exercer ces droits, veuillez nous contacter à l'adresse : <a href="mailto:dpo@oaib.bj" className="text-primary hover:underline">dpo@oaib.bj</a>
              </p>
              <p className="text-text-secondary mb-8">
                Pour plus d'informations, consultez notre <a href="/politique-confidentialite" className="text-primary font-bold hover:underline">Politique de Confidentialité</a>.
              </p>

              <h2 className="text-2xl font-black text-text mb-6 mt-12">
                Cookies
              </h2>
              <p className="text-text-secondary mb-8">
                Ce site utilise des cookies pour améliorer votre expérience de navigation et analyser le trafic. En poursuivant votre navigation, vous acceptez l'utilisation de ces cookies. Vous pouvez les désactiver à tout moment dans les paramètres de votre navigateur.
              </p>

              <h2 className="text-2xl font-black text-text mb-6 mt-12">
                Limitation de responsabilité
              </h2>
              <p className="text-text-secondary mb-4">
                L'OAIB s'efforce de maintenir les informations du site à jour et exactes. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
              </p>
              <p className="text-text-secondary mb-8">
                L'OAIB ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site ou de l'impossibilité d'y accéder.
              </p>

              <h2 className="text-2xl font-black text-text mb-6 mt-12">
                Liens hypertextes
              </h2>
              <p className="text-text-secondary mb-8">
                Ce site peut contenir des liens vers des sites externes. L'OAIB n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
              </p>

              <h2 className="text-2xl font-black text-text mb-6 mt-12">
                Droit applicable
              </h2>
              <p className="text-text-secondary mb-4">
                Les présentes mentions légales sont régies par le droit béninois. Tout litige relatif à l'utilisation de ce site sera soumis à la compétence exclusive des tribunaux de Cotonou, Bénin.
              </p>

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

export default LegalNotice;
