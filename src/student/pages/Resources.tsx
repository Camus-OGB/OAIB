import React, { useState, useEffect } from 'react';
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
  Folder,
  Loader2
} from 'lucide-react';
import { listResources } from '../../services/resourceService';
import type { Resource, ResourceType } from '../../shared/types';

const typeConfig: Record<string, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  pdf: { icon: FileText, label: 'PDF', color: 'text-red-500', bg: 'bg-red-100' },
  video: { icon: Video, label: 'Vidéo', color: 'text-blue-500', bg: 'bg-blue-100' },
  article: { icon: BookOpen, label: 'Article', color: 'text-green-500', bg: 'bg-green-100' },
  exercise: { icon: File, label: 'Exercice', color: 'text-purple-500', bg: 'bg-purple-100' },
  link: { icon: ExternalLink, label: 'Lien', color: 'text-orange-500', bg: 'bg-orange-100' },
};

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
  const config = typeConfig[resource.resource_type] || typeConfig.link;
  const Icon = config.icon;
  const isNew = new Date().getTime() - new Date(resource.created_at).getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="bg-white/80 rounded-2xl border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all group">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isNew && (
              <span className="px-2 py-0.5 bg-accent text-white text-xs font-bold rounded-full">
                Nouveau
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
            {resource.phase && (
              <span className="px-2 py-1 bg-background rounded-lg">Phase {resource.phase}</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className={`text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
        <a 
          href={resource.file || resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-white transition-all"
        >
          {resource.resource_type === 'video' ? (
            <>
              <Play size={16} />
              Regarder
            </>
          ) : resource.resource_type === 'pdf' ? (
            <>
              <Download size={16} />
              Télécharger
            </>
          ) : resource.resource_type === 'exercise' ? (
            <>
              <ExternalLink size={16} />
              Commencer
            </>
          ) : (
            <>
              <ExternalLink size={16} />
              Ouvrir
            </>
          )}
        </a>
      </div>
    </div>
  );
};

const StudentResources: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedType, setSelectedType] = useState('Tous');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await listResources('is_active=true');
        if (res.ok) setResources(res.data.results ?? []);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const categories = ['Tous', ...Array.from(new Set(resources.map(r => r.category).filter(Boolean)))];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || resource.category === selectedCategory;
    const matchesType = selectedType === 'Tous' || resource.resource_type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

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
              <p className="text-xl font-black text-text">{resources.filter(r => r.resource_type === 'pdf').length}</p>
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
              <p className="text-xl font-black text-text">{resources.filter(r => r.resource_type === 'video').length}</p>
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
              <p className="text-xl font-black text-text">{resources.filter(r => r.resource_type === 'exercise').length}</p>
              <p className="text-xs text-text-secondary">Exercices</p>
            </div>
          </div>
        </div>
      </div>

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
