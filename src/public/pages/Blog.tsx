import React, { useState } from 'react';
import { Calendar, Clock, Tag, Search, ArrowRight } from 'lucide-react';
import { usePageTitle } from '../../shared/hooks/usePageTitle';
import { AnimatedSection, AnimatedCard } from '../../shared/components/layout/AnimatedSection';
import { OptimizedImage } from '../../shared/components/ui/OptimizedImage';
import { ConstellationPattern, CircuitPattern } from '../../shared/components/patterns/AIPatterns';

const categories = ['Tous', 'Annonces', 'Événements', 'Résultats', 'Partenaires', 'Innovation'];

const blogPosts = [
  {
    id: 1,
    title: "Lancement officiel de l'édition 2026",
    excerpt: "Découvrez les nouveautés de cette 5ème édition des Olympiades d'Intelligence Artificielle du Bénin.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75",
    category: "Annonces",
    date: "15 Jan 2026",
    readTime: "5 min",
    author: "Équipe OAIB"
  },
  {
    id: 2,
    title: "Nouveau partenariat avec Google AI",
    excerpt: "Google AI rejoint l'aventure OAIB pour soutenir les talents béninois en intelligence artificielle.",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75",
    category: "Partenaires",
    date: "10 Jan 2026",
    readTime: "4 min",
    author: "Direction OAIB"
  },
  {
    id: 3,
    title: "Retour sur l'édition 2025 : 450 participants",
    excerpt: "Bilan de la 4ème édition avec des chiffres record et des projets innovants qui marquent l'histoire.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75",
    category: "Résultats",
    date: "20 Déc 2025",
    readTime: "8 min",
    author: "Équipe OAIB"
  },
  {
    id: 4,
    title: "Workshop IA : Machine Learning pour débutants",
    excerpt: "Participez à notre atelier gratuit sur les fondamentaux du Machine Learning le 25 février.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75",
    category: "Événements",
    date: "5 Jan 2026",
    readTime: "3 min",
    author: "Équipe Formation"
  },
  {
    id: 5,
    title: "Innovation : Une IA pour l'agriculture béninoise",
    excerpt: "Comment les lauréats 2025 ont développé une solution IA pour optimiser les rendements agricoles.",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75",
    category: "Innovation",
    date: "28 Déc 2025",
    readTime: "6 min",
    author: "Lauréats 2025"
  },
  {
    id: 6,
    title: "Inscriptions ouvertes : Ne manquez pas la deadline",
    excerpt: "Les inscriptions pour l'édition 2026 sont ouvertes jusqu'au 15 mars. Tous les détails ici.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75",
    category: "Annonces",
    date: "2 Jan 2026",
    readTime: "4 min",
    author: "Direction OAIB"
  }
];

const Blog: React.FC = () => {
  usePageTitle('Actualités');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'Tous' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts[0];

  return (
    <div className="w-full bg-background">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        <CircuitPattern className="w-[500px] h-[500px] text-pattern absolute top-0 right-0 opacity-40" />
        <ConstellationPattern className="w-[400px] h-[400px] text-pattern absolute bottom-0 left-0 opacity-30" />
        
        <div className="relative z-10 w-full px-6 sm:px-10 md:px-16 lg:px-20 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <span className="inline-block px-4 py-1.5 bg-accent text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                Blog & Actualités
              </span>
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
                Suivez l'actualité de l'OAIB
              </h1>
              <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
                Découvrez nos dernières annonces, événements et success stories
              </p>
              
              {/* Search */}
              <div className="max-w-xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="sticky top-20 z-40 bg-white border-b border-border shadow-sm">
        <div className="px-6 sm:px-10 md:px-16 lg:px-20 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-background text-text-secondary hover:bg-background-alt'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-16">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <p className="text-sm font-bold uppercase tracking-wider text-accent mb-4">À la une</p>
            <article className="group relative overflow-hidden rounded-3xl border border-border bg-white shadow-xl hover:shadow-2xl transition-all">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="relative h-96 lg:h-full overflow-hidden">
                  <OptimizedImage 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="h-full group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-accent text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12">
                  <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-text mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-text-secondary text-lg leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all">
                    Lire l'article
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </article>
          </AnimatedSection>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-12 pb-20">
        <div className="max-w-6xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-secondary text-lg">Aucun article trouvé pour cette recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(1).map((post, idx) => (
                <AnimatedCard key={post.id} delay={idx * 0.1}>
                  <article className="group h-full bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all">
                    <div className="relative h-48 overflow-hidden">
                      <OptimizedImage 
                        src={post.image} 
                        alt={post.title}
                        className="h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold rounded-lg flex items-center gap-1">
                          <Tag size={12} /> {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-text mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-xs font-semibold text-text-muted">{post.author}</span>
                        <button className="text-primary font-bold text-sm hover:underline">
                          Lire plus →
                        </button>
                      </div>
                    </div>
                  </article>
                </AnimatedCard>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
