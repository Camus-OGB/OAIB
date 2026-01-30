import React from 'react';
import { Share2, Globe, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer class="bg-tech-blue text-white/60 py-10 px-6 md:px-8 lg:px-12">
      <div class="w-full flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex flex-col items-center md:items-start gap-4">
          <div class="flex items-center gap-2 text-white">
            <Shield className="text-primary" />
            <span class="font-black tracking-tight text-white text-lg">Olympiades IA Bénin</span>
          </div>
          <p class="text-xs max-w-xs text-center md:text-left">
            Plateforme officielle des Olympiades nationales pour la promotion de l'Intelligence Artificielle au Bénin.
          </p>
        </div>
        
        <div class="flex gap-8">
          <a href="#" class="text-xs hover:text-primary transition-colors">Mentions Légales</a>
          <a href="#" class="text-xs hover:text-primary transition-colors">Confidentialité</a>
          <a href="#" class="text-xs hover:text-primary transition-colors">Contact</a>
        </div>
        
        <div class="flex gap-4">
          <button class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
            <Share2 size={18} />
          </button>
          <button class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
            <Globe size={18} />
          </button>
        </div>
      </div>
      
      <div class="text-center mt-10 pt-8 border-t border-white/5 text-[10px] uppercase tracking-[0.2em]">
        © 2024 Benin AI Olympiads. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;