import React from 'react';
import { UserPlus, BookOpen, Terminal, MapPin, Trophy, Users, CheckCircle, Code, ChevronDown } from 'lucide-react';

const Program: React.FC = () => {
  return (
    <div class="w-full px-4 sm:px-6 md:px-8 lg:px-12 pb-20">
      {/* Hero */}
      <section class="py-12 md:py-20">
        <div class="flex flex-col gap-10 md:flex-row items-center">
            <div class="w-full md:w-1/2 rounded-xl overflow-hidden shadow-2xl h-[360px] md:h-[420px]">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" class="w-full h-full object-cover" alt="Students" />
            </div>
            <div class="w-full md:w-1/2 flex flex-col gap-6">
                <div class="flex flex-col gap-4">
                    <span class="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded-full w-max">Future Leaders</span>
                    <h1 class="text-[#111813] dark:text-white text-3xl md:text-5xl lg:text-6xl font-black leading-tight">
                        Programme & Processus Édition 2026
                    </h1>
                    <p class="text-[#61896f] dark:text-gray-400 text-lg leading-relaxed">
                        Rejoignez la première compétition d'intelligence artificielle du Bénin. Nous recherchons les esprits les plus brillants pour mener la prochaine révolution technologique.
                    </p>
                </div>
                <div class="flex gap-4">
                    <button class="bg-primary hover:bg-primary/90 text-[#111813] h-12 px-6 rounded-lg font-bold text-sm md:text-base transition-all">
                        Voir le Calendrier
                    </button>
                    <button class="border-2 border-primary/30 hover:border-primary text-[#111813] dark:text-white h-12 px-6 rounded-lg font-bold text-sm md:text-base transition-all">
                        Guide PDF
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Phases Timeline */}
      <section class="py-16 bg-white dark:bg-[#112240] rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 dark:border-white/5 mb-20">
        <h2 class="text-2xl md:text-3xl font-bold mb-12 text-center text-[#111813] dark:text-white">Les 6 Phases de Sélection</h2>
        <div class="space-y-0">
            {[
                { icon: UserPlus, phase: "Phase 01", title: "Inscription", desc: "Candidature en ligne. Ouvert à tous les étudiants de 14-22 ans inscrits au Bénin.", date: "15 Jan - 28 Fév, 2026" },
                { icon: BookOpen, phase: "Phase 02", title: "Formation Fondamentale", desc: "Accès aux supports de cours, webinaires et modules de logique IA.", date: "" },
                { icon: Terminal, phase: "Phase 03", title: "Tours Préliminaires", desc: "Examen national de logique et code en ligne. Top 20% qualifié.", date: "" },
                { icon: MapPin, phase: "Phase 04", title: "Qualificatifs Régionaux", desc: "Événements physiques à Cotonou, Porto-Novo, Parakou, et Bohicon.", date: "" },
                { icon: Trophy, phase: "Phase 05", title: "Finale Nationale", desc: "Hackathon de 24h à Cotonou et présentation devant jury international.", date: "" },
                { icon: Users, phase: "Phase 06", title: "Mentorat & Prix", desc: "Incubation des meilleurs projets et bourses universitaires.", date: "" }
            ].map((item, idx, arr) => (
                <div key={idx} class="grid grid-cols-[40px_1fr] gap-x-6 relative">
                    <div class="flex flex-col items-center">
                        <div class={`flex items-center justify-center size-10 rounded-full z-10 ${idx === 0 ? 'bg-primary text-white' : 'bg-primary/10 text-primary border-2 border-primary/30'}`}>
                            <item.icon size={20} />
                        </div>
                        {idx !== arr.length - 1 && <div class="w-[2px] bg-gray-200 dark:bg-white/10 h-full min-h-[60px]"></div>}
                    </div>
                    <div class="flex flex-col pb-10">
                        <span class={`${idx === 0 ? 'text-primary' : 'text-gray-400'} font-bold text-xs uppercase tracking-widest mb-1`}>{item.phase}</span>
                        <h3 class="text-[#111813] dark:text-white text-xl font-bold">{item.title}</h3>
                        <p class="text-[#61896f] dark:text-gray-400 mt-2 max-w-xl">{item.desc}</p>
                        {item.date && (
                             <div class="mt-2 text-sm font-semibold text-primary">{item.date}</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Criteria */}
      <section class="py-10">
        <h2 class="text-[#111813] dark:text-white text-3xl font-bold mb-10">Critères de Sélection</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { icon: CheckCircle, title: "Âge & Statut", desc: "Étudiants entre 14-22 ans. Carte d'étudiant valide requise." },
                { icon: Terminal, title: "Raisonnement Logique", desc: "Haute compétence en logique mathématique et résolution de problèmes." },
                { icon: Code, title: "Compétences Tech", desc: "Bases de Python ou pensée algorithmique. Pas d'IA avancée requise au départ." },
                { icon: Users, title: "Travail d'Équipe", desc: "Capacité à collaborer efficacement lors des phases régionales et finales." }
            ].map((c, i) => (
                <div key={i} class="bg-white dark:bg-[#112240] p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
                    <div class="size-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                        <c.icon size={24} />
                    </div>
                    <h4 class="font-bold text-lg mb-2 text-[#111813] dark:text-white">{c.title}</h4>
                    <p class="text-sm text-[#61896f] dark:text-gray-400 leading-relaxed">{c.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* FAQ */}
      <section class="py-10 max-w-3xl mx-auto mt-10">
        <h2 class="text-3xl font-bold mb-8 text-center text-[#111813] dark:text-white">Questions Fréquentes</h2>
        <div class="space-y-4">
            {[
                { q: "Qui peut participer à l'édition 2026 ?", a: "La compétition est ouverte à tous les étudiants résidant au Bénin, âgés de 14 à 22 ans (Lycée et Licence 1-2)." },
                { q: "Dois-je savoir coder pour m'inscrire ?", a: "Aucune expérience avancée n'est requise. Nous fournissons les formations nécessaires." },
                { q: "Quels sont les prix pour les gagnants ?", a: "Stages internationaux, bourses d'études, ordinateurs et financement de projets." },
                { q: "L'inscription est-elle payante ?", a: "Non, l'inscription aux Olympiades d'IA du Bénin est 100% gratuite." }
            ].map((faq, i) => (
                <details key={i} class="group bg-white dark:bg-[#112240] border border-gray-100 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
                    <summary class="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-[#111813] dark:text-white">
                        {faq.q}
                        <ChevronDown className="group-open:rotate-180 transition-transform text-gray-500" />
                    </summary>
                    <div class="px-6 pb-6 text-[#61896f] dark:text-gray-300">{faq.a}</div>
                </details>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Program;