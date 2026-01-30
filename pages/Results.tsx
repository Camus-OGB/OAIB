import React from 'react';
import { Download, Rocket, Globe, Users, Star, TrendingUp, Play, FileText, Leaf, Cpu, HeartPulse, ArrowUpRight, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { year: '2021', score: 65, participation: 120 },
  { year: '2022', score: 75, participation: 450 },
  { year: '2023', score: 85, participation: 980 },
  { year: '2024', score: 98, participation: 1500 },
];

const regionData = [
    { name: "Littoral (Cotonou)", count: 680, width: "90%" },
    { name: "Atlantique (Abomey-Calavi)", count: 450, width: "65%" },
    { name: "Borgou (Parakou)", count: 210, width: "35%" },
    { name: "Ouémé (Porto-Novo)", count: 160, width: "25%" },
];

const innovations = [
  {
    title: "AgriScan Drone",
    category: "Agriculture",
    icon: Leaf,
    desc: "Système autonome de surveillance des cultures utilisant la vision par ordinateur pour détecter les maladies des plantes avant propagation.",
    impact: "+40% Rendement",
    tech: ["YOLOv8", "Jetson Nano", "Python"],
    image: "https://images.unsplash.com/photo-1574621100236-d25a64a1ad3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "EcoVision Waste",
    category: "Smart City",
    icon: Cpu,
    desc: "Poubelle intelligente capable de trier automatiquement les déchets recyclables grâce à un réseau de neurones convolutifs optimisé.",
    impact: "-2 Tonnes CO2",
    tech: ["TensorFlow Lite", "IoT", "C++"],
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Yoruba-Health Bot",
    category: "Santé",
    icon: HeartPulse,
    desc: "Assistant vocal permettant aux populations rurales d'accéder à des conseils médicaux de premier secours en langues locales.",
    impact: "50k Utilisateurs",
    tech: ["NLP", "Twilio API", "React"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const Results: React.FC = () => {
  return (
    <div class="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-10">
      {/* Page Heading */}
      <div class="flex flex-wrap justify-between items-end gap-6 mb-12">
        <div class="flex min-w-72 flex-col gap-3 max-w-3xl">
          <p class="text-[#111813] dark:text-white text-3xl lg:text-5xl font-black leading-tight tracking-[-0.033em]">
            Aperçu des Éditions Précédentes
          </p>
          <p class="text-[#61896f] dark:text-gray-400 text-lg font-normal leading-normal">
            Retracer la trajectoire de l'excellence en intelligence artificielle parmi la jeunesse béninoise depuis notre création.
          </p>
        </div>
        <button class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-white dark:bg-[#112240] border border-[#dbe6df] dark:border-white/10 text-[#111813] dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-[#1d3557] transition-colors">
          <Download className="mr-2" size={16} />
          <span class="truncate">Rapport Complet (PDF)</span>
        </button>
      </div>

      {/* Interactive Timeline */}
      <div class="bg-white dark:bg-[#112240] rounded-xl border border-[#f0f4f2] dark:border-white/5 p-8 mb-16 shadow-sm">
        <h2 class="text-[#111813] dark:text-white text-xl md:text-2xl font-bold mb-8">Chronologie de l'Évolution</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div class="hidden md:block absolute top-6 left-0 w-3/4 h-1 bg-[#dbe6df] dark:bg-white/10 -z-0"></div>
          
          {[
            { icon: Rocket, title: "2021 Inaugural", desc: "Année de Fondation • Cotonou", status: "Terminé", active: false },
            { icon: Globe, title: "2022 National", desc: "12 Départements • 500+ Étudiants", status: "Terminé", active: false },
            { icon: Users, title: "2023 Régional", desc: "Intégration UEMOA", status: "Terminé", active: false },
            { icon: Star, title: "2024 Innovation", desc: "Focus IA pour le Développement", status: "Plus Récent", active: true },
          ].map((item, idx) => (
            <div key={idx} class="flex flex-col items-center text-center group relative z-10">
                <div class={`size-12 rounded-full flex items-center justify-center mb-4 border-4 border-white dark:border-[#112240] transition-transform group-hover:scale-110 ${item.active ? 'bg-primary text-white scale-110' : 'bg-primary/20 text-primary'}`}>
                    <item.icon size={20} />
                </div>
                <h3 class={`font-bold text-base md:text-lg ${item.active ? 'text-primary' : 'text-[#111813] dark:text-white'}`}>{item.title}</h3>
                <p class="text-sm text-[#61896f] dark:text-gray-400 mt-1">{item.desc}</p>
                <p class="text-xs text-primary font-bold mt-2 uppercase tracking-wider">{item.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Dashboard Section */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        
        {/* Participation Breakdown (Replaces Map) */}
        <div class="lg:col-span-2 bg-white dark:bg-[#112240] rounded-xl border border-[#f0f4f2] dark:border-white/5 overflow-hidden shadow-sm flex flex-col">
          <div class="p-6 border-b border-[#f0f4f2] dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
            <h2 class="text-[#111813] dark:text-white text-lg font-bold flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Répartition Géographique
            </h2>
            <span class="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Top Départements</span>
          </div>
          
          <div class="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 flex-1">
             {/* Stats Cards */}
             <div class="grid grid-cols-2 gap-4">
                {[
                    { val: "45+", label: "Universités", color: "text-blue-500" },
                    { val: "12", label: "Pays", color: "text-primary" },
                    { val: "38%", label: "Femmes", color: "text-benin-red" },
                    { val: "2.5k", label: "Alumni", color: "text-benin-yellow" }
                ].map((stat, i) => (
                    <div key={i} class="p-4 bg-[#f6f8f6] dark:bg-[#0a192f] rounded-xl border border-[#f0f4f2] dark:border-white/5 flex flex-col justify-center">
                        <p class={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
                        <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold mt-1">{stat.label}</p>
                    </div>
                ))}
             </div>

             {/* Regional Progress List */}
             <div class="flex flex-col justify-center gap-6">
                {regionData.map((region, idx) => (
                    <div key={idx}>
                        <div class="flex justify-between text-sm font-bold mb-2">
                            <span class="text-gray-800 dark:text-white">{region.name}</span>
                            <span class="text-gray-500 dark:text-gray-400">{region.count} participants</span>
                        </div>
                        <div class="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                class="h-full bg-primary rounded-full" 
                                style={{ width: region.width }}
                            ></div>
                        </div>
                    </div>
                ))}
                <button class="mt-2 text-primary text-sm font-bold hover:underline self-start">
                    Voir le rapport démographique complet &rarr;
                </button>
             </div>
          </div>
        </div>

        {/* Growth Trends Chart (Replaces simple BarChart) */}
        <div class="bg-white dark:bg-[#112240] rounded-xl border border-[#f0f4f2] dark:border-white/5 p-6 shadow-sm flex flex-col">
            <h2 class="text-[#111813] dark:text-white text-lg font-bold mb-2">Croissance de l'Impact</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Évolution de la moyenne des scores</p>
            
            <div class="h-64 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#13ec5b" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#13ec5b" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                        <XAxis 
                            dataKey="year" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            tick={{fill: '#9CA3AF'}} 
                            dy={10}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#fff', color: '#000' }}
                            itemStyle={{ color: '#000', fontWeight: 'bold' }}
                            formatter={(value: any) => [`${value} pts`, 'Score Moyen']}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#13ec5b" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorScore)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div class="p-4 bg-primary/10 rounded-lg border border-primary/20 mt-auto">
                <p class="text-sm font-bold text-[#111813] dark:text-white flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" />
                    Record Historique
                </p>
                <p class="text-xs text-[#61896f] dark:text-gray-300 mt-2">
                    Le niveau technique global a augmenté de 14% cette année, avec 3 projets brevetables issus de la finale.
                </p>
            </div>
        </div>
      </div>

      {/* Gallery */}
      <div class="mb-16">
        <h2 class="text-[#111813] dark:text-white text-xl md:text-2xl font-bold mb-6">Moments d'Excellence</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
                "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1674&q=80",
                "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
                "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
            ].map((src, i) => (
                <div key={i} class="group relative overflow-hidden rounded-xl aspect-square">
                    <img src={src} class="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" alt={`Gallery ${i}`} />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                        <p class="text-white text-xs font-bold">Album {2021 + i}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Innovation Section */}
      <section class="mb-16">
        <div class="flex flex-col md:flex-row justify-between items-end mb-10">
            <div>
                <h2 class="text-3xl font-black mb-2 text-[#111813] dark:text-white">Innovations Technologiques</h2>
                <p class="text-gray-600 dark:text-gray-400">Découvrez les prototypes qui transforment le quotidien des Béninois.</p>
            </div>
            <button class="text-primary font-bold hover:underline flex items-center gap-2">
                Voir le repo GitHub <ArrowUpRight size={18} />
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {innovations.map((item, idx) => (
                <div key={idx} class="group bg-white dark:bg-[#112240] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    {/* Image Area */}
                    <div class="h-48 overflow-hidden relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                        <img src={item.image} alt={item.title} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div class="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                             <div class="bg-primary text-[#111813] p-2 rounded-lg">
                                <item.icon size={18} />
                             </div>
                             <span class="text-white font-bold text-sm tracking-wide">{item.category}</span>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div class="p-6 flex flex-col flex-1">
                        <div class="flex justify-between items-start mb-3">
                             <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{item.title}</h3>
                             <div class="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                                {item.impact}
                             </div>
                        </div>
                        
                        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{item.desc}</p>
                        
                        {/* Footer / Tech Stack */}
                        <div class="mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                            <p class="text-xs font-bold text-gray-400 uppercase mb-2">Technologies</p>
                            <div class="flex flex-wrap gap-2">
                                {item.tech.map((t, i) => (
                                    <span key={i} class="text-[10px] bg-gray-100 dark:bg-[#0a192f] text-gray-700 dark:text-gray-300 font-semibold px-2 py-1 rounded-md border border-gray-200 dark:border-white/5">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Documents */}
      <div class="bg-white dark:bg-[#112240] rounded-xl border border-[#f0f4f2] dark:border-white/5 p-8 shadow-sm">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 class="text-[#111813] dark:text-white text-xl md:text-2xl font-bold">Presse Officielle & Documentation</h2>
            <a href="#" class="text-primary text-sm font-bold hover:underline">Voir tous les documents</a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
                { title: "Annonce Résultats Officiels 2024", date: "24 Août 2024", size: "1.2 MB", icon: FileText, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
                { title: "Livre Blanc Pédagogie & IA", date: "12 Juin 2024", size: "4.5 MB", icon: FileText, color: "text-primary", bg: "bg-primary/10" },
                { title: "Briefing Presse Ministériel", date: "05 Mars 2024", size: "0.8 MB", icon: FileText, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
                { title: "Highlights Vidéo: Cérémonie 2023", date: "30 Juil 2023", size: "45 MB", icon: Play, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
            ].map((doc, i) => (
                <div key={i} class="flex items-center gap-4 p-4 rounded-lg border border-[#f0f4f2] dark:border-white/5 hover:bg-[#f6f8f6] dark:hover:bg-[#0a192f] transition-colors group cursor-pointer">
                    <div class={`size-12 rounded ${doc.bg} ${doc.color} flex items-center justify-center`}>
                        <doc.icon size={24} />
                    </div>
                    <div class="flex-1">
                        <h4 class="text-[#111813] dark:text-white font-bold text-sm">{doc.title}</h4>
                        <p class="text-xs text-[#61896f] dark:text-gray-400">{doc.date} • {doc.size}</p>
                    </div>
                    <button class="size-8 rounded-full border border-[#dbe6df] dark:border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all text-gray-500 dark:text-gray-400">
                        <Download size={16} />
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Results;