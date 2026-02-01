import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-tech-blue text-white/60" role="contentinfo">
      <div className="w-full px-6 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white">
              <Shield className="text-primary" size={24} />
              <span className="font-black tracking-tight text-white text-lg">OAIB</span>
            </div>
            <p className="text-sm leading-relaxed">
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
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', to: '/' },
                { label: 'Programme', to: '/programme' },
                { label: 'Resultats', to: '/resultats' },
                { label: 'A propos', to: '/a-propos' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Mentions Legales</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Confidentialite</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Conditions d'utilisation</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin size={16} className="shrink-0 mt-0.5 text-primary" />
                Cotonou Digital Hub, Cotonou, Benin
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail size={16} className="shrink-0 text-primary" />
                contact@oia-benin.org
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone size={16} className="shrink-0 text-primary" />
                +229 21 00 00 00
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 px-6 md:px-8 lg:px-12 py-6">
        <p className="text-center text-xs uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Olympiades d'IA du Benin. Tous droits reserves.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
