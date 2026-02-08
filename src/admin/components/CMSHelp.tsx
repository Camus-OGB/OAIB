import React from 'react';
import { Info, FileText, Globe, HelpCircle, Image, Calendar, Users, Quote } from 'lucide-react';

type ContentType = 'pages' | 'news' | 'faq' | 'media' | 'timeline' | 'partners' | 'testimonials';

interface CMSHelpProps {
  type: ContentType;
}

const helpContent: Record<ContentType, { icon: React.ElementType; title: string; description: string; tips: string[] }> = {
  pages: {
    icon: FileText,
    title: 'Pages statiques',
    description: 'Gérez les pages du site comme "À propos", "Programme", etc.',
    tips: [
      'Le slug est généré automatiquement à partir du titre',
      'Utilisez le statut "Brouillon" pour préparer vos pages',
      'Publiez uniquement quand le contenu est finalisé',
    ],
  },
  news: {
    icon: Globe,
    title: 'Actualités',
    description: 'Créez et publiez des articles d\'actualité qui apparaissent sur la page d\'accueil.',
    tips: [
      'L\'extrait apparaît dans la liste des actualités',
      'Ajoutez une image attractive pour plus de visibilité',
      'Remplissez le champ "Auteur" pour signer l\'article',
      'Les actualités publiées apparaissent immédiatement sur le site',
    ],
  },
  faq: {
    icon: HelpCircle,
    title: 'Questions fréquentes',
    description: 'Répondez aux questions les plus courantes des participants.',
    tips: [
      'Utilisez des catégories pour organiser vos FAQs',
      'Soyez clair et concis dans les réponses',
      'Mettez à jour régulièrement selon les retours',
    ],
  },
  media: {
    icon: Image,
    title: 'Bibliothèque média',
    description: 'Gérez vos images, vidéos et documents.',
    tips: [
      'Formats supportés : JPG, PNG, GIF, PDF, MP4',
      'Taille max : 10 MB par fichier',
      'Nommez vos fichiers de manière descriptive',
    ],
  },
  timeline: {
    icon: Calendar,
    title: 'Timeline / Phases',
    description: 'Planifiez les différentes phases de la compétition.',
    tips: [
      'Les dates sont au format DD/MM/YYYY',
      'Les phases s\'affichent dans l\'ordre chronologique',
      'Assurez-vous que les dates ne se chevauchent pas',
    ],
  },
  partners: {
    icon: Users,
    title: 'Partenaires',
    description: 'Affichez vos partenaires et sponsors sur le site.',
    tips: [
      'Uploadez le logo du partenaire (format PNG recommandé)',
      'Les tiers : Or, Argent, Bronze déterminent l\'affichage',
      'Ajoutez le site web pour créer un lien',
    ],
  },
  testimonials: {
    icon: Quote,
    title: 'Témoignages',
    description: 'Partagez les témoignages des anciens participants.',
    tips: [
      'Ajoutez une photo ou une vidéo pour plus d\'impact',
      'Le rôle doit être descriptif (ex: "Gagnant 2024 - Data Scientist")',
      'Les vidéos YouTube doivent être au format embed',
      'Ordre d\'affichage : 1 = premier témoignage',
    ],
  },
};

const CMSHelp: React.FC<CMSHelpProps> = ({ type }) => {
  const help = helpContent[type];
  const Icon = help.icon;

  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold mb-1 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            {help.title}
          </h3>
          <p className="text-slate-300 text-sm mb-3">{help.description}</p>
          <div className="space-y-1">
            {help.tips.map((tip, index) => (
              <p key={index} className="text-slate-400 text-xs flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{tip}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSHelp;
