import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, Play, FileText, ArrowUpRight, MapPin, Rocket } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { usePageTitle } from '../../shared/hooks/usePageTitle';
import { chartData, regionData, innovations, galleryImages, documents } from '../data/results';
import { listEditionsPublic } from '../../services/examService';
import type { Edition } from '../../shared/types';
import { AnimatedSection, AnimatedCard } from '../../shared/components/layout/AnimatedSection';
import { OptimizedImage } from '../../shared/components/ui/OptimizedImage';
import { MatrixGridPattern, BinaryRainPattern, ConstellationPattern, HexagonPattern, CircuitPattern } from '../../shared/components/patterns/AIPatterns';

const Results: React.FC = () => {
  usePageTitle('Resultats');

  const [editions, setEditions] = useState<Edition[]>([]);

  useEffect(() => {
    listEditionsPublic('ordering=year')
      .then(r => { if (r.data) setEditions(r.data.results ?? []); })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full bg-background relative">
      {/* Hero - Tech & Data Driven */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Binary matrix overlay - digital effect */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none font-mono text-[10px] text-white leading-relaxed select-none overflow-hidden z-10">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap animate-pulse" style={{ animationDelay: `${i * 0.1}s`, animationDuration: '3.5s' }}>
              {Array.from({ length: 200 }).map(() => Math.random() > 0.5 ? '1' : '0').join(' ')}
            </div>
          ))}
        </div>

        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none z-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="results-circuit" x="0" y="0" width="115" height="115" patternUnits="userSpaceOnUse">
                <circle cx="57" cy="57" r="3" fill="currentColor" className="text-accent" />
                <line x1="57" y1="57" x2="115" y2="57" stroke="currentColor" strokeWidth="0.8" className="text-white" />
                <line x1="57" y1="57" x2="57" y2="0" stroke="currentColor" strokeWidth="0.8" className="text-accent" />
                <circle cx="0" cy="57" r="2" fill="currentColor" className="text-white" />
                <circle cx="57" cy="0" r="2" fill="currentColor" className="text-accent" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#results-circuit)" />
          </svg>
        </div>

        {/* Background with tech overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-dark via-primary-dark to-primary">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        {/* Patterns - strong presence */}
        <MatrixGridPattern className="w-full h-[350px] text-pattern absolute bottom-0 left-0 opacity-60" />
        <ConstellationPattern className="w-[450px] h-[450px] text-pattern absolute top-5 right-10 opacity-50" />
        <CircuitPattern className="w-[320px] h-[320px] text-pattern absolute top-[40%] left-10 opacity-40" />
        {/* Benin flag colors - Plus visibles */}
        <div className="absolute top-[25%] right-[12%] w-[320px] h-[320px] bg-benin-yellow/32 rounded-full blur-[90px]" />
        <div className="absolute bottom-[35%] left-[15%] w-[250px] h-[250px] bg-benin-red/28 rounded-full blur-[75px]" />
        <div className="absolute top-[55%] right-[35%] w-[200px] h-[200px] bg-benin-green/25 rounded-full blur-[65px]" />
        {/* Tricolor line - Plus visible */}
        <div className="absolute bottom-0 right-0 top-0 w-2 flex flex-col">
          <div className="flex-1 bg-benin-green/55" />
          <div className="flex-1 bg-benin-yellow/65" />
          <div className="flex-1 bg-benin-red/55" />
        </div>
        
        <div className="relative z-10 px-6 sm:px-10 md:px-16 lg:px-20 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <AnimatedSection>
                <span className="inline-block px-4 py-1.5 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-full mb-8">
                  Bilan 2022 - 2025
                </span>
                <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-8">
                  Resultats &<br />
                  <span className="text-accent">Impact Mesurable</span>
                </h1>
                <p className="text-white/80 text-xl leading-relaxed mb-10">
                  Quatre ans d'excellence, des centaines de talents reveles, et un ecosysteme IA en pleine croissance au Benin.
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  {[
                    { value: '1,247', label: 'Participants' },
                    { value: '96%', label: 'Satisfaction' },
                    { value: '45+', label: 'Projets IA' },
                  ].map((stat, i) => (
                    <div key={i}>
                      <p className="text-accent text-4xl font-black">{stat.value}</p>
                      <p className="text-white/70 text-sm font-bold uppercase tracking-wider mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline - Style horizontal moderne */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-16 -mt-10 relative z-10 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 opacity-[0.02]">
          <img 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="bg-white rounded-3xl border border-border p-8 md:p-12 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                <h2 className="text-text text-2xl font-black">Evolution des Editions</h2>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-background rounded-xl text-sm font-bold text-text-secondary hover:bg-gradient-to-r hover:from-primary hover:via-accent hover:to-blue hover:text-white transition-all">
                  <Download size={16} />
                  Rapport PDF
                </button>
              </div>
              
              {/* Timeline horizontale */}
              <div className="relative">
                <div className="hidden md:block absolute top-6 left-0 right-0 h-1 bg-border" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {editions.map((edition, idx) => (
                    <div key={edition.id} className="relative flex flex-col items-center text-center group">
                      <div className={`relative z-10 size-12 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${edition.is_active ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-background text-text-secondary group-hover:bg-primary/20 group-hover:text-primary'}`}>
                        <Rocket size={20} />
                      </div>
                      <h3 className={`font-bold text-lg mb-2 ${edition.is_active ? 'text-primary' : 'text-text'}`}>{edition.year} {edition.title}</h3>
                      <p className="text-sm text-text-secondary mb-2">{edition.description}</p>
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${edition.is_active ? 'bg-accent/10 text-accent' : 'bg-background text-text-muted'}`}>
                        {edition.is_active ? 'Active' : 'Terminée'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Analytics Dashboard */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-12 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 opacity-[0.03]">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {/* Patterns */}
        <CircuitPattern className="w-[300px] h-[300px] text-pattern absolute top-10 right-0 opacity-20" />
        {/* Benin accents */}
        <div className="absolute top-[30%] left-[5%] w-[100px] h-[100px] bg-benin-yellow/8 rounded-full blur-[50px]" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AnimatedCard className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col h-full">
              <div className="p-6 border-b border-border flex justify-between items-center bg-background">
                <h2 className="text-text text-lg font-bold flex items-center gap-2">
                  <MapPin size={20} className="text-accent" />
                  Repartition Geographique
                </h2>
                <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full font-bold uppercase tracking-wider">Top Departements</span>
              </div>
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { val: "45+", label: "Universites", color: "text-primary" },
                    { val: "12", label: "Pays", color: "text-accent" },
                    { val: "38%", label: "Femmes", color: "text-accent-dark" },
                    { val: "2.5k", label: "Alumni", color: "text-primary-light" }
                  ].map((stat, i) => (
                    <div key={i} className="p-4 bg-background rounded-xl border border-border flex flex-col justify-center">
                      <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
                      <p className="text-[10px] text-text-muted uppercase font-bold mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-center gap-6">
                  {regionData.map((region, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-text">{region.name}</span>
                        <span className="text-text-secondary">{region.count} participants</span>
                      </div>
                      <div className="h-2.5 w-full bg-background-alt rounded-full overflow-hidden" role="progressbar" aria-valuenow={region.count} aria-label={`${region.name}: ${region.count} participants`}>
                        <div className="h-full bg-gradient-to-r from-primary via-accent to-blue rounded-full transition-all duration-700" style={{ width: region.width }} />
                      </div>
                    </div>
                  ))}
                  <button className="mt-2 text-accent text-sm font-bold hover:underline self-start">
                    Voir le rapport demographique complet &rarr;
                  </button>
                </div>
              </div>
            </div>
          </AnimatedCard>

        <AnimatedCard delay={0.2}>
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col h-full">
              <h2 className="text-text text-lg font-bold mb-2">Croissance de l'Impact</h2>
              <p className="text-sm text-text-secondary mb-6">Evolution de la moyenne des scores</p>
              <div className="h-64 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                    <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#9CA3AF'}} dy={10} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#fff', color: '#000' }}
                      itemStyle={{ color: '#000', fontWeight: 'bold' }}
                      formatter={(value: any) => [`${value} pts`, 'Score Moyen']}
                    />
                    <Area type="monotone" dataKey="score" stroke="#00D4FF" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 mt-auto">
                <p className="text-sm font-bold text-text flex items-center gap-2">
                  <TrendingUp size={16} className="text-accent" />
                  Record Historique
                </p>
                <p className="text-xs text-text-secondary mt-2">
                  Le niveau technique global a augmente de 14% cette annee, avec 3 projets brevetables issus de la finale.
                </p>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Gallery - Masonry asymetrique */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-20 py-16 overflow-hidden">
        {/* Thematic background image */}
        <div className="absolute inset-0 opacity-[0.03]">
          <img 
            src="https://images.unsplash.com/photo-1535378620166-273708d44e4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <ConstellationPattern className="w-[450px] h-[450px] text-pattern absolute top-10 right-0 opacity-45" />
        <MatrixGridPattern className="w-[300px] h-[200px] text-pattern absolute bottom-10 left-10 opacity-25" />
        {/* Benin accents */}
        <div className="absolute top-[40%] left-[5%] w-[120px] h-[120px] bg-benin-yellow/10 rounded-full blur-[50px]" />
        <div className="absolute bottom-[30%] right-[15%] w-[100px] h-[100px] bg-benin-red/8 rounded-full blur-[40px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-3">Galerie</p>
              <h2 className="text-3xl font-black text-text">Moments Memorables</h2>
            </div>
            <button className="text-accent font-bold text-sm hover:underline">
              Voir toutes les photos →
            </button>
          </AnimatedSection>
          
          {/* Masonry grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {galleryImages.map((src, i) => (
              <AnimatedCard key={i} delay={i * 0.1}>
                <div className={`group relative overflow-hidden rounded-2xl cursor-pointer ${i === 0 ? 'md:col-span-2 md:row-span-2 aspect-square' : i === 3 ? 'md:col-span-2 aspect-video' : 'aspect-square'}`}>
                  <OptimizedImage src={src} alt={`Album des Olympiades ${2021 + i}`} className="h-full group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-all duration-500 flex items-center justify-center">
                    <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-accent px-4 py-2 rounded-lg text-sm">
                      Edition {2021 + i}
                    </span>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Section - Cards horizontales */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-16 bg-background-alt relative overflow-hidden">
        {/* Patterns */}
        <BinaryRainPattern className="w-[100px] h-[300px] text-pattern absolute top-0 right-10 opacity-25" />
        <HexagonPattern className="w-[200px] h-[200px] text-accent absolute bottom-10 left-20 opacity-20" />
        {/* Benin accent */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 flex">
          <div className="flex-1 bg-benin-green/25" />
          <div className="flex-1 bg-benin-yellow/30" />
          <div className="flex-1 bg-benin-red/25" />
        </div>
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-3">Projets</p>
              <h2 className="text-3xl md:text-4xl font-black text-text">Innovations des Laureats</h2>
              <p className="text-text-secondary mt-2 max-w-lg">Des solutions IA concues par nos talents pour resoudre des problemes reels au Benin.</p>
            </div>
            <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-light transition-all">
              GitHub <ArrowUpRight size={16} />
            </a>
          </AnimatedSection>
          
          {/* Layout horizontal pour les projets */}
          <div className="space-y-6">
            {innovations.map((item, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.1}>
                <article className="group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-72 lg:w-96 h-48 md:h-auto overflow-hidden relative shrink-0">
                      <OptimizedImage src={item.image} alt={item.title} className="h-full group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="bg-accent text-white p-2 rounded-lg">
                          <item.icon size={18} />
                        </div>
                        <span className="bg-black/50 backdrop-blur-sm text-white font-bold text-xs px-3 py-1.5 rounded-lg">{item.category}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors">{item.title}</h3>
                        <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold">
                          {item.impact}
                        </div>
                      </div>
                      <p className="text-text-secondary leading-relaxed mb-6 flex-1">{item.desc}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-bold text-text-muted uppercase">Stack:</span>
                        {item.tech.map((t, i) => (
                          <span key={i} className="text-xs bg-background text-text-secondary font-semibold px-3 py-1.5 rounded-lg border border-border">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-12 pb-20">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-text text-xl md:text-2xl font-black">Presse Officielle & Documentation</h2>
                <a href="#" className="text-accent text-sm font-bold hover:underline">Voir tous les documents</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc, i) => {
                  const Icon = doc.type === 'video' ? Play : FileText;
                  const color = doc.type === 'video' ? 'text-primary' : (i % 2 === 0 ? 'text-accent-dark' : 'text-accent');
                  const bg = doc.type === 'video' ? 'bg-primary/10' : (i % 2 === 0 ? 'bg-accent-dark/10' : 'bg-accent/10');
                  return (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-background transition-colors group cursor-pointer">
                      <div className={`size-12 rounded-xl ${bg} ${color} flex items-center justify-center`}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-text font-bold text-sm">{doc.title}</h4>
                        <p className="text-xs text-text-secondary">{doc.date} - {doc.size}</p>
                      </div>
                      <button
                        className="size-8 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all text-text-muted"
                        aria-label={`Telecharger ${doc.title}`}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Results;
