import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy relative overflow-hidden" role="contentinfo">
      {/* Benin flag colors - subtle decorative blurs */}
      <div className="absolute top-10 right-[20%] w-[200px] h-[200px] bg-benin-yellow/8 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-20 left-[15%] w-[150px] h-[150px] bg-benin-red/6 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute top-1/2 right-[10%] w-[100px] h-[100px] bg-benin-green/5 rounded-full blur-[50px] pointer-events-none" />

      {/* CTA Banner */}
{/*       <div className="relative overflow-hidden bg-primary/20">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative w-full px-6 md:px-8 lg:px-12 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
              Pret a relever le defi ?
            </h3>
            <p className="text-accent/80 mb-6 max-w-lg mx-auto">
              Rejoignez la prochaine edition des Olympiades d'Intelligence Artificielle du Benin.
            </p>
            <Link
              to="/programme"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-primary font-bold rounded-full hover:bg-accent-light hover:shadow-lg transition-all"
            >
              S'inscrire maintenant
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div> */}

      {/* Main Footer */}
      <div className="w-full px-6 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-primary" strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-black tracking-tight text-white text-lg block">OAIB</span>
                <span className="text-[10px] text-text-muted font-medium tracking-wider">OLYMPIADES IA BENIN</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-text-muted">
              Plateforme officielle des Olympiades nationales pour la promotion de l'Intelligence Artificielle au Benin.
            </p>
            <div className="flex gap-3 mt-2">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Instagram, label: 'Instagram' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-benin-yellow rounded-full"></span>
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', to: '/' },
                { label: 'Programme', to: '/programme' },
                { label: 'Resultats', to: '/resultats' },
                { label: 'A propos', to: '/a-propos' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-text-muted hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-benin-red rounded-full"></span>
              Legal
            </h3>
            <ul className="space-y-3">
              <li><Link to="/mentions-legales" className="text-sm text-text-muted hover:text-accent transition-colors">Mentions Legales</Link></li>
              <li><Link to="/politique-confidentialite" className="text-sm text-text-muted hover:text-accent transition-colors">Politique de Confidentialite</Link></li>
              <li><Link to="/actualites" className="text-sm text-text-muted hover:text-accent transition-colors">Actualites</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full"></span>
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-text-muted">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-accent" />
                </div>
                <span className="pt-1">Cotonou Digital Hub, Cotonou, Benin</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-text-muted">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-accent" />
                </div>
                contact@oia-benin.org
              </li>
              <li className="flex items-center gap-3 text-sm text-text-muted">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-accent" />
                </div>
                +229 21 00 00 00
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10 px-6 md:px-8 lg:px-12 py-6">
        {/* Benin flag stripe */}
        <div className="absolute top-0 left-0 right-0 h-[2px] flex">
          <div className="flex-1 bg-benin-green/40"></div>
          <div className="flex-1 bg-benin-yellow/40"></div>
          <div className="flex-1 bg-benin-red/40"></div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">
            &copy; {new Date().getFullYear()} Olympiades d'IA du Benin. Tous droits reserves.
          </p>
          <div className="flex items-center gap-6 text-xs text-text-muted">
            <a href="#" className="hover:text-accent transition-colors">Politique de confidentialite</a>
            <a href="#" className="hover:text-accent transition-colors">Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
