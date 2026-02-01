import React from 'react';
import { Download, TrendingUp, Play, FileText, ArrowUpRight, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { usePageTitle } from '../hooks/usePageTitle';
import { chartData, regionData, timelineItems, innovations, galleryImages, documents } from '../data/results';
import { AnimatedSection, AnimatedCard } from '../components/AnimatedSection';
import { OptimizedImage } from '../components/OptimizedImage';
import { SectionTitle } from '../components/SectionTitle';

const Results: React.FC = () => {
  usePageTitle('Resultats');

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-10">
      {/* Page Heading */}
      <AnimatedSection>
        <div className="flex flex-wrap justify-between items-end gap-6 mb-12">
          <div className="flex min-w-72 flex-col gap-3 max-w-3xl">
            <h1 className="text-[#111813] dark:text-white text-3xl lg:text-5xl font-black leading-tight tracking-[-0.033em]">
              Apercu des Editions Precedentes
            </h1>
            <p className="text-[#61896f] dark:text-gray-400 text-lg font-normal leading-normal">
              Retracer la trajectoire de l'excellence en intelligence artificielle parmi la jeunesse beninoise depuis notre creation.
            </p>
          </div>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-white dark:bg-[#112240] border border-[#dbe6df] dark:border-white/10 text-[#111813] dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-[#1d3557] transition-colors">
            <Download className="mr-2" size={16} />
            <span className="truncate">Rapport Complet (PDF)</span>
          </button>
        </div>
      </AnimatedSection>

      {/* Timeline */}
      <AnimatedSection>
        <div className="bg-white dark:bg-[#112240] rounded-xl border border-[#f0f4f2] dark:border-white/5 p-8 mb-16 shadow-sm">
          <h2 className="text-[#111813] dark:text-white text-xl md:text-2xl font-bold mb-8">Chronologie de l'Evolution</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="hidden md:block absolute top-6 left-0 w-3/4 h-1 bg-[#dbe6df] dark:bg-white/10 -z-0" aria-hidden="true" />
            {timelineItems.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group relative z-10">
                <div className={`size-12 rounded-full flex items-center justify-center mb-4 border-4 border-white dark:border-[#112240] transition-transform group-hover:scale-110 ${item.active ? 'bg-primary text-white scale-110' : 'bg-primary/20 text-primary'}`}>
                  <item.icon size={20} />
                </div>
                <h3 className={`font-bold text-base md:text-lg ${item.active ? 'text-primary' : 'text-[#111813] dark:text-white'}`}>{item.title}</h3>
                <p className="text-sm text-[#61896f] dark:text-gray-400 mt-1">{item.desc}</p>
                <p className="text-xs text-primary font-bold mt-2 uppercase tracking-wider">{item.status}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <AnimatedCard className="lg:col-span-2">
          <div className="bg-white dark:bg-[#112240] rounded-xl border border-[#f0f4f2] dark:border-white/5 overflow-hidden shadow-sm flex flex-col h-full">
            <div className="p-6 border-b border-[#f0f4f2] dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
              <h2 className="text-[#111813] dark:text-white text-lg font-bold flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Repartition Geographique
              </h2>
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Top Departements</span>
            </div>
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 flex-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: "45+", label: "Universites", color: "text-blue-500" },
                  { val: "12", label: "Pays", color: "text-primary" },
                  { val: "38%", label: "Femmes", color: "text-benin-red" },
                  { val: "2.5k", label: "Alumni", color: "text-benin-yellow" }
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-[#f6f8f6] dark:bg-[#0a192f] rounded-xl border border-[#f0f4f2] dark:border-white/5 flex flex-col justify-center">
                    <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center gap-6">
                {regionData.map((region, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-gray-800 dark:text-white">{region.name}</span>
                      <span className="text-gray-500 dark:text-gray-400">{region.count} participants</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={region.count} aria-label={`${region.name}: ${region.count} participants`}>
                      <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: region.width }} />
                    </div>
                  </div>
                ))}
                <button className="mt-2 text-primary text-sm font-bold hover:underline self-start">
                  Voir le rapport demographique complet &rarr;
                </button>
              </div>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <div className="bg-white dark:bg-[#112240] rounded-xl border border-[#f0f4f2] dark:border-white/5 p-6 shadow-sm flex flex-col h-full">
            <h2 className="text-[#111813] dark:text-white text-lg font-bold mb-2">Croissance de l'Impact</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Evolution de la moyenne des scores</p>
            <div className="h-64 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#13ec5b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#13ec5b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                  <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#9CA3AF'}} dy={10} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#fff', color: '#000' }}
                    itemStyle={{ color: '#000', fontWeight: 'bold' }}
                    formatter={(value: any) => [`${value} pts`, 'Score Moyen']}
                  />
                  <Area type="monotone" dataKey="score" stroke="#13ec5b" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mt-auto">
              <p className="text-sm font-bold text-[#111813] dark:text-white flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                Record Historique
              </p>
              <p className="text-xs text-[#61896f] dark:text-gray-300 mt-2">
                Le niveau technique global a augmente de 14% cette annee, avec 3 projets brevetables issus de la finale.
              </p>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Gallery */}
      <AnimatedSection className="mb-16">
        <SectionTitle title="Moments d'Excellence" className="mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((src, i) => (
            <div key={i} className="group relative overflow-hidden rounded-xl aspect-square">
              <OptimizedImage src={src} alt={`Album des Olympiades ${2021 + i}`} className="h-full group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <p className="text-white text-xs font-bold">Album {2021 + i}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Innovation Section */}
      <section className="mb-16">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <SectionTitle title="Innovations Technologiques" subtitle="Decouvrez les prototypes qui transforment le quotidien des Beninois." />
            <button className="text-primary font-bold hover:underline flex items-center gap-2 mt-4 md:mt-0">
              Voir le repo GitHub <ArrowUpRight size={18} />
            </button>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {innovations.map((item, idx) => (
            <AnimatedCard key={idx} delay={idx * 0.1}>
              <article className="group bg-white dark:bg-[#112240] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <OptimizedImage src={item.image} alt={item.title} className="h-full group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                    <div className="bg-primary text-[#111813] p-2 rounded-lg">
                      <item.icon size={18} />
                    </div>
                    <span className="text-white font-bold text-sm tracking-wide">{item.category}</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{item.title}</h3>
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                      {item.impact}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{item.desc}</p>
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Technologies</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tech.map((t, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 dark:bg-[#0a192f] text-gray-700 dark:text-gray-300 font-semibold px-2 py-1 rounded-md border border-gray-200 dark:border-white/5">
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
      </section>

      {/* Documents */}
      <AnimatedSection>
        <div className="bg-white dark:bg-[#112240] rounded-xl border border-[#f0f4f2] dark:border-white/5 p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-[#111813] dark:text-white text-xl md:text-2xl font-bold">Presse Officielle & Documentation</h2>
            <a href="#" className="text-primary text-sm font-bold hover:underline">Voir tous les documents</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc, i) => {
              const Icon = doc.type === 'video' ? Play : FileText;
              const color = doc.type === 'video' ? 'text-blue-600 dark:text-blue-400' : (i % 2 === 0 ? 'text-red-600' : 'text-primary');
              const bg = doc.type === 'video' ? 'bg-blue-50 dark:bg-blue-900/20' : (i % 2 === 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-primary/10');
              return (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-[#f0f4f2] dark:border-white/5 hover:bg-[#f6f8f6] dark:hover:bg-[#0a192f] transition-colors group cursor-pointer">
                  <div className={`size-12 rounded ${bg} ${color} flex items-center justify-center`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[#111813] dark:text-white font-bold text-sm">{doc.title}</h4>
                    <p className="text-xs text-[#61896f] dark:text-gray-400">{doc.date} - {doc.size}</p>
                  </div>
                  <button
                    className="size-8 rounded-full border border-[#dbe6df] dark:border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
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
  );
};

export default Results;
