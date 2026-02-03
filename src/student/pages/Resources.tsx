import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Download,
  ExternalLink,
  Search,
  Filter,
  Clock,
  Star,
  Play,
  File,
  Folder
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'article' | 'exercise';
  category: string;
  phase: number;
  duration?: string;
  size?: string;
  url: string;
  isNew?: boolean;
  isRecommended?: boolean;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Introduction à l\'Intelligence Artificielle',
    description: 'Cours complet sur les fondamentaux de l\'IA et ses applications.',
    type: 'pdf',
    category: 'Fondamentaux',
    phase: 1,
    size: '2.4 MB',
    url: '#',
    isNew: true,
  },
  {
    id: '2',
    title: 'Les bases de Python pour l\'IA',
    description: 'Tutoriel vidéo sur la programmation Python orientée Data Science.',
    type: 'video',
    category: 'Programmation',
    phase: 2,
    duration: '45 min',
    url: '#',
    isRecommended: true,
  },
  {
    id: '3',
    title: 'Algèbre linéaire - Matrices et vecteurs',
    description: 'Les concepts mathématiques essentiels pour le Machine Learning.',
    type: 'pdf',
    category: 'Mathématiques',
    phase: 2,
    size: '1.8 MB',
    url: '#',
  },
  {
    id: '4',
    title: 'Exercices de logique - Niveau 1',
    description: 'Série d\'exercices pour préparer le test de logique.',
    type: 'exercise',
    category: 'Logique',
    phase: 1,
    url: '#',
    isRecommended: true,
  },
  {
    id: '5',
    title: 'Introduction au Machine Learning',
    description: 'Comprendre les algorithmes d\'apprentissage supervisé et non supervisé.',
    type: 'video',
    category: 'Machine Learning',
    phase: 3,
    duration: '1h 20min',
    url: '#',
  },
  {
    id: '6',
    title: 'Probabilités et Statistiques',
    description: 'Les bases statistiques pour l\'analyse de données.',
    type: 'article',
    category: 'Mathématiques',
    phase: 2,
    duration: '15 min de lecture',
    url: '#',
  },
  {
    id: '7',
    title: 'Deep Learning - Réseaux de neurones',
    description: 'Architecture et fonctionnement des réseaux de neurones artificiels.',
    type: 'pdf',
    category: 'Deep Learning',
    phase: 4,
    size: '3.2 MB',
    url: '#',
    isNew: true,
  },
  {
    id: '8',
    title: 'Exercices pratiques Python',
    description: 'Mise en pratique avec des exercices de programmation.',
    type: 'exercise',
    category: 'Programmation',
    phase: 2,
    url: '#',
  },
];

const categories = ['Tous', 'Fondamentaux', 'Mathématiques', 'Programmation', 'Logique', 'Machine Learning', 'Deep Learning'];
const types = ['Tous', 'pdf', 'video', 'article', 'exercise'];

const typeConfig = {
  pdf: { icon: FileText, label: 'PDF', color: 'text-red-500', bg: 'bg-red-100' },
  video: { icon: Video, label: 'Vidéo', color: 'text-blue-500', bg: 'bg-blue-100' },
  article: { icon: BookOpen, label: 'Article', color: 'text-green-500', bg: 'bg-green-100' },
  exercise: { icon: File, label: 'Exercice', color: 'text-purple-500', bg: 'bg-purple-100' },
};

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
  const config = typeConfig[resource.type];
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all group">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {resource.isNew && (
              <span className="px-2 py-0.5 bg-accent text-primary text-xs font-bold rounded-full">
                Nouveau
              </span>
            )}
            {resource.isRecommended && (
              <span className="px-2 py-0.5 bg-benin-yellow/20 text-benin-yellow text-xs font-bold rounded-full flex items-center gap-1">
                <Star size={10} fill="currentColor" />
                Recommandé
              </span>
            )}
          </div>
          <h3 className="font-bold text-text group-hover:text-primary transition-colors truncate">
            {resource.title}
          </h3>
          <p className="text-sm text-text-secondary mt-1 line-clamp-2">
            {resource.description}
          </p>
          
          <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
            <span className="px-2 py-1 bg-background rounded-lg">{resource.category}</span>
            <span className="px-2 py-1 bg-background rounded-lg">Phase {resource.phase}</span>
            {resource.duration && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {resource.duration}
              </span>
            )}
            {resource.size && (
              <span className="flex items-center gap-1">
                <Download size={12} />
                {resource.size}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className={`text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
        <a 
          href={resource.url}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-white transition-all"
        >
          {resource.type === 'video' ? (
            <>
              <Play size={16} />
              Regarder
            </>
          ) : resource.type === 'pdf' ? (
            <>
              <Download size={16} />
              Télécharger
            </>
          ) : resource.type === 'exercise' ? (
            <>
              <ExternalLink size={16} />
              Commencer
            </>
          ) : (
            <>
              <ExternalLink size={16} />
              Lire
            </>
          )}
        </a>
      </div>
    </div>
  );
};

const StudentResources: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || resource.category === selectedCategory;
    const matchesType = selectedType === 'Tous' || resource.type === selectedType;
    const matchesPhase = selectedPhase === null || resource.phase === selectedPhase;
    
    return matchesSearch && matchesCategory && matchesType && matchesPhase;
  });

  const recommendedResources = resources.filter(r => r.isRecommended);

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-text">Ressources</h1>
        <p className="text-text-secondary mt-1">Préparez-vous avec nos supports pédagogiques</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Folder className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-black text-text">{resources.length}</p>
              <p className="text-xs text-text-secondary">Ressources</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xl font-black text-text">{resources.filter(r => r.type === 'pdf').length}</p>
              <p className="text-xs text-text-secondary">Documents PDF</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-black text-text">{resources.filter(r => r.type === 'video').length}</p>
              <p className="text-xs text-text-secondary">Vidéos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <File className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xl font-black text-text">{resources.filter(r => r.type === 'exercise').length}</p>
              <p className="text-xs text-text-secondary">Exercices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended section */}
      {recommendedResources.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-benin-yellow" fill="currentColor" />
            Recommandés pour vous
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recommendedResources.slice(0, 2).map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="bg-white rounded-2xl border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Rechercher une ressource..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          {/* Type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary"
          >
            <option value="Tous">Tous les types</option>
            <option value="pdf">PDF</option>
            <option value="video">Vidéos</option>
            <option value="article">Articles</option>
            <option value="exercise">Exercices</option>
          </select>

          {/* Phase filter */}
          <select
            value={selectedPhase || ''}
            onChange={(e) => setSelectedPhase(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary"
          >
            <option value="">Toutes les phases</option>
            {[1, 2, 3, 4, 5, 6].map(phase => (
              <option key={phase} value={phase}>Phase {phase}</option>
            ))}
          </select>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-background text-text-secondary hover:bg-background-alt'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Resources grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text">
            {filteredResources.length} ressource{filteredResources.length > 1 ? 's' : ''} trouvée{filteredResources.length > 1 ? 's' : ''}
          </h2>
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">Aucune ressource trouvée</h3>
            <p className="text-text-secondary">
              Essayez de modifier vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentResources;
