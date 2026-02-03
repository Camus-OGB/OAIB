import React, { useState } from 'react';
import {
  FileText,
  Image,
  Calendar,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Save,
  X,
  Upload,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  AlignLeft,
  Clock,
  CheckCircle,
  Globe,
  Users,
  ChevronRight
} from 'lucide-react';

type ContentType = 'pages' | 'news' | 'faq' | 'media' | 'timeline' | 'partners';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  lastModified: string;
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  status: 'published' | 'draft';
  publishedAt: string;
  author: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: string;
  uploadedAt: string;
}

interface TimelinePhase {
  id: string;
  phase: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
}

interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  category: 'gold' | 'silver' | 'bronze';
}

const mockPages: Page[] = [
  { id: '1', title: 'Accueil', slug: '/', content: 'Contenu de la page d\'accueil...', status: 'published', lastModified: '2026-01-30' },
  { id: '2', title: 'À propos', slug: '/a-propos', content: 'Contenu de la page à propos...', status: 'published', lastModified: '2026-01-28' },
  { id: '3', title: 'Programme', slug: '/programme', content: 'Contenu du programme...', status: 'published', lastModified: '2026-01-25' },
  { id: '4', title: 'Mentions légales', slug: '/mentions-legales', content: 'Mentions légales...', status: 'draft', lastModified: '2026-01-20' },
];

const mockNews: NewsItem[] = [
  { id: '1', title: 'Lancement des inscriptions 2026', excerpt: 'Les inscriptions pour l\'édition 2026 sont ouvertes...', content: 'Contenu complet...', status: 'published', publishedAt: '2026-01-15', author: 'Admin' },
  { id: '2', title: 'Nouveau partenariat avec l\'UAC', excerpt: 'L\'OAIB annonce un partenariat stratégique...', content: 'Contenu complet...', status: 'published', publishedAt: '2026-01-20', author: 'Admin' },
  { id: '3', title: 'Calendrier des épreuves', excerpt: 'Découvrez le calendrier complet des épreuves...', content: 'Contenu complet...', status: 'draft', publishedAt: '2026-01-25', author: 'Admin' },
];

const mockFAQ: FAQItem[] = [
  { id: '1', question: 'Qui peut participer aux Olympiades ?', answer: 'Les élèves du secondaire (de la seconde à la terminale) peuvent participer.', category: 'Inscription', order: 1 },
  { id: '2', question: 'Comment s\'inscrire ?', answer: 'Créez un compte sur notre plateforme et complétez votre dossier.', category: 'Inscription', order: 2 },
  { id: '3', question: 'Quand auront lieu les épreuves ?', answer: 'Les épreuves se déroulent de mars à juin 2026.', category: 'Épreuves', order: 3 },
];

const mockTimeline: TimelinePhase[] = [
  { id: '1', phase: 1, title: 'Inscriptions', description: 'Ouverture des inscriptions en ligne', startDate: '2026-01-15', endDate: '2026-02-28', status: 'active' },
  { id: '2', phase: 2, title: 'Test de logique', description: 'QCM en ligne pour tous les candidats', startDate: '2026-03-01', endDate: '2026-03-15', status: 'upcoming' },
  { id: '3', phase: 3, title: 'Phase éliminatoire', description: 'Épreuve de programmation', startDate: '2026-03-20', endDate: '2026-04-10', status: 'upcoming' },
  { id: '4', phase: 4, title: 'Demi-finale', description: 'Projet IA individuel', startDate: '2026-04-15', endDate: '2026-05-01', status: 'upcoming' },
  { id: '5', phase: 5, title: 'Finale nationale', description: 'Compétition finale', startDate: '2026-05-10', endDate: '2026-05-15', status: 'upcoming' },
  { id: '6', phase: 6, title: 'Préparation IOAI', description: 'Formation de l\'équipe nationale', startDate: '2026-06-01', endDate: '2026-08-01', status: 'upcoming' },
];

const mockPartners: Partner[] = [
  { id: '1', name: 'Université d\'Abomey-Calavi', logo: '/partners/uac.png', website: 'https://uac.bj', category: 'gold' },
  { id: '2', name: 'EPITECH Bénin', logo: '/partners/epitech.png', website: 'https://epitech.bj', category: 'gold' },
  { id: '3', name: 'MTN Bénin', logo: '/partners/mtn.png', website: 'https://mtn.bj', category: 'silver' },
];

const tabs = [
  { id: 'pages', label: 'Pages', icon: FileText },
  { id: 'news', label: 'Actualités', icon: Globe },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'media', label: 'Médias', icon: Image },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'partners', label: 'Partenaires', icon: Users },
];

const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentType>('pages');
  const [pages] = useState<Page[]>(mockPages);
  const [news] = useState<NewsItem[]>(mockNews);
  const [faq] = useState<FAQItem[]>(mockFAQ);
  const [timeline] = useState<TimelinePhase[]>(mockTimeline);
  const [partners] = useState<Partner[]>(mockPartners);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const openEditor = (item?: any) => {
    setEditingItem(item || null);
    setShowEditor(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestion de Contenu</h1>
          <p className="text-slate-400 mt-1">Éditez les pages, actualités et FAQ du site</p>
        </div>
        <button
          onClick={() => openEditor()}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors"
        >
          <Plus size={18} />
          {activeTab === 'pages' && 'Nouvelle page'}
          {activeTab === 'news' && 'Nouvelle actualité'}
          {activeTab === 'faq' && 'Nouvelle question'}
          {activeTab === 'media' && 'Uploader'}
          {activeTab === 'timeline' && 'Nouvelle phase'}
          {activeTab === 'partners' && 'Nouveau partenaire'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-2">
        <div className="flex overflow-x-auto gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ContentType)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent text-primary'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Page</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">URL</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Statut</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Modifié</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="text-white font-medium">{page.title}</p>
                  </td>
                  <td className="py-4 px-6">
                    <code className="text-accent text-sm">{page.slug}</code>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      page.status === 'published' 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {page.status === 'published' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {page.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 text-sm">{page.lastModified}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white">
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => openEditor(page)}
                        className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* News Tab */}
      {activeTab === 'news' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {news.map((item) => (
            <div key={item.id} className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  item.status === 'published' 
                    ? 'bg-green-500/10 text-green-400' 
                    : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {item.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => openEditor(item)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{item.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Par {item.author}</span>
                <span>{item.publishedAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-3">
          {faq.map((item) => (
            <div key={item.id} className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-xs text-accent font-bold mb-2 block">{item.category}</span>
                  <h3 className="text-white font-bold mb-2">{item.question}</h3>
                  <p className="text-slate-400 text-sm">{item.answer}</p>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button 
                    onClick={() => openEditor(item)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div>
          {/* Upload zone */}
          <div className="bg-slate-800 rounded-2xl border-2 border-dashed border-slate-600 p-12 text-center mb-6 hover:border-accent transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-white font-medium mb-1">Glissez-déposez vos fichiers ici</p>
            <p className="text-slate-500 text-sm">ou cliquez pour sélectionner (images, vidéos, PDF)</p>
          </div>

          {/* Media grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden group">
                <div className="aspect-square bg-slate-700 flex items-center justify-center">
                  <Image className="w-8 h-8 text-slate-500" />
                </div>
                <div className="p-3">
                  <p className="text-white text-sm truncate">image_{i}.jpg</p>
                  <p className="text-slate-500 text-xs">1.2 MB</p>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 bg-red-500/50 rounded-lg text-white hover:bg-red-500/70">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <div className="relative">
            {timeline.map((phase, index) => (
              <div key={phase.id} className="flex gap-6 pb-8 last:pb-0">
                {/* Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                    phase.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    phase.status === 'active' ? 'bg-accent text-primary' :
                    'bg-slate-700 text-slate-400'
                  }`}>
                    {phase.phase}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className={`w-0.5 flex-1 mt-2 ${
                      phase.status === 'completed' ? 'bg-green-500/30' : 'bg-slate-700'
                    }`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold mb-2 ${
                        phase.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                        phase.status === 'active' ? 'bg-accent/20 text-accent' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {phase.status === 'completed' ? 'Terminé' : phase.status === 'active' ? 'En cours' : 'À venir'}
                      </span>
                      <h3 className="text-white font-bold text-lg">{phase.title}</h3>
                      <p className="text-slate-400 mt-1">{phase.description}</p>
                      <p className="text-slate-500 text-sm mt-2">
                        {phase.startDate} → {phase.endDate}
                      </p>
                    </div>
                    <button 
                      onClick={() => openEditor(phase)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partners Tab */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          {['gold', 'silver', 'bronze'].map((category) => {
            const categoryPartners = partners.filter(p => p.category === category);
            if (categoryPartners.length === 0) return null;
            
            return (
              <div key={category}>
                <h3 className={`text-lg font-bold mb-4 ${
                  category === 'gold' ? 'text-yellow-400' :
                  category === 'silver' ? 'text-slate-300' :
                  'text-orange-400'
                }`}>
                  Partenaires {category === 'gold' ? 'Or' : category === 'silver' ? 'Argent' : 'Bronze'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryPartners.map((partner) => (
                    <div key={partner.id} className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center">
                        <Image className="w-8 h-8 text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold">{partner.name}</h4>
                        <a href={partner.website} className="text-accent text-sm hover:underline flex items-center gap-1">
                          <LinkIcon size={12} />
                          Site web
                        </a>
                      </div>
                      <button 
                        onClick={() => openEditor(partner)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingItem ? 'Modifier' : 'Créer'} {
                  activeTab === 'pages' ? 'une page' :
                  activeTab === 'news' ? 'une actualité' :
                  activeTab === 'faq' ? 'une FAQ' :
                  activeTab === 'timeline' ? 'une phase' :
                  'un partenaire'
                }
              </h2>
              <button
                onClick={() => setShowEditor(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title/Question input */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  {activeTab === 'faq' ? 'Question' : 'Titre'}
                </label>
                <input
                  type="text"
                  defaultValue={editingItem?.title || editingItem?.question || editingItem?.name || ''}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
                  placeholder="Entrez le titre..."
                />
              </div>

              {/* Content editor */}
              {(activeTab === 'pages' || activeTab === 'news' || activeTab === 'faq') && (
                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    {activeTab === 'faq' ? 'Réponse' : 'Contenu'}
                  </label>
                  {/* Simple toolbar */}
                  <div className="flex items-center gap-1 p-2 bg-slate-700 border border-slate-600 rounded-t-xl border-b-0">
                    <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white">
                      <Bold size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white">
                      <Italic size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white">
                      <List size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white">
                      <AlignLeft size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white">
                      <LinkIcon size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white">
                      <Image size={16} />
                    </button>
                  </div>
                  <textarea
                    defaultValue={editingItem?.content || editingItem?.answer || ''}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-b-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent resize-none"
                    rows={10}
                    placeholder="Entrez le contenu..."
                  />
                </div>
              )}

              {/* Status */}
              {(activeTab === 'pages' || activeTab === 'news') && (
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Statut</label>
                  <select
                    defaultValue={editingItem?.status || 'draft'}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                  </select>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setShowEditor(false)}
                  className="flex-1 py-3 border border-slate-600 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowEditor(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors"
                >
                  <Save size={18} />
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
