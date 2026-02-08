import React, { useState, useEffect } from 'react';
import { ChevronDown, UserPlus, BookOpen, Terminal, MapPin, Trophy, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTitle } from '../../shared/hooks/usePageTitle';
import { criteria } from '../data/program';
import { listPhasesPublic } from '../../services/examService';
import { listFAQ } from '../../services/cmsService';
import type { Phase, FAQItem } from '../../shared/types';
import { AnimatedSection, AnimatedCard } from '../../shared/components/layout/AnimatedSection';
import { OptimizedImage } from '../../shared/components/ui/OptimizedImage';
import { CircuitPattern, DataFlowPattern, HexagonPattern } from '../../shared/components/patterns/AIPatterns';

const phaseIcons = [UserPlus, BookOpen, Terminal, MapPin, Trophy, Users];

const Program: React.FC = () => {
  usePageTitle('Programme');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ── API state ──────────────────────────────────────────────
  const [phases, setPhases] = useState<Phase[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);

  useEffect(() => {
    listPhasesPublic('ordering=phase_number')
      .then(r => { if (r.data) setPhases(r.data.results ?? []); })
      .catch(() => {});
    listFAQ('is_active=true&ordering=display_order')
      .then(r => { if (r.data) setFaqItems(r.data.results ?? []); })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full bg-background relative">
      {/* Hero - Dynamic & Bold */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        {/* Binary matrix overlay - digital effect */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none font-mono text-[10px] text-white leading-relaxed select-none overflow-hidden z-10">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap animate-pulse" style={{ animationDelay: `${i * 0.12}s`, animationDuration: '3.2s' }}>
              {Array.from({ length: 160 }).map(() => Math.random() > 0.5 ? '1' : '0').join(' ')}
            </div>
          ))}
        </div>

        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="program-circuit" x="0" y="0" width="105" height="105" patternUnits="userSpaceOnUse">
                <circle cx="52" cy="52" r="2.5" fill="currentColor" className="text-white" />
                <line x1="52" y1="52" x2="105" y2="52" stroke="currentColor" strokeWidth="0.7" className="text-benin-yellow" />
                <line x1="52" y1="52" x2="52" y2="0" stroke="currentColor" strokeWidth="0.7" className="text-white" />
                <circle cx="0" cy="52" r="2" fill="currentColor" className="text-white" />
                <circle cx="52" cy="0" r="2" fill="currentColor" className="text-benin-yellow" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#program-circuit)" />
          </svg>
        </div>

        {/* Background Image with strong overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary-dark/90 to-primary/85" />
        </div>
        
        {/* Patterns - more visible */}
        <CircuitPattern className="w-[550px] h-[550px] text-pattern absolute top-0 right-0 opacity-55" />
        <DataFlowPattern className="w-[280px] h-[650px] text-pattern absolute bottom-0 left-10 opacity-50" />
        <HexagonPattern className="w-[350px] h-[350px] text-pattern absolute top-[30%] left-[35%] opacity-35" />
        {/* Benin flag colors - Plus visibles */}
        <div className="absolute top-[35%] right-[8%] w-[280px] h-[280px] bg-benin-yellow/35 rounded-full blur-[80px]" />
        <div className="absolute bottom-[15%] left-[20%] w-[220px] h-[220px] bg-benin-green/28 rounded-full blur-[70px]" />
        <div className="absolute top-[15%] left-[10%] w-[180px] h-[180px] bg-benin-red/25 rounded-full blur-[60px]" />
        {/* Tricolor line - Plus visible */}
        <div className="absolute top-0 bottom-0 left-0 w-2 flex flex-col">
          <div className="flex-1 bg-benin-green/50" />
          <div className="flex-1 bg-benin-yellow/60" />
          <div className="flex-1 bg-benin-red/50" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full px-6 sm:px-10 md:px-16 lg:px-20 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <AnimatedSection>
                <span className="inline-block px-4 py-1.5 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                  Edition 2026
                </span>
                <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-8">
                  Votre parcours vers<br />
                  <span className="text-accent">l'excellence en IA</span>
                </h1>
                <p className="text-white/80 text-xl leading-relaxed mb-10">
                  Six etapes pour transformer votre passion en expertise. Rejoignez les futurs leaders de l'intelligence artificielle au Benin.
                </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-accent hover:bg-accent-light text-white h-14 px-8 rounded-full font-bold text-base transition-all">
                  Commencer l'inscription
                </button>
                <button className="border border-white/20 hover:border-accent hover:bg-white/5 text-white h-14 px-8 rounded-full font-bold text-base transition-all backdrop-blur-sm">
                  Telecharger le guide
                </button>
              </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Phases Timeline - Style magazine */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-20 py-20 bg-background overflow-hidden">
        {/* Thematic background image */}
        <div className="absolute inset-0 opacity-[0.03]">
          <img 
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {/* Pattern subtil */}
        <HexagonPattern className="w-[450px] h-[450px] text-pattern absolute top-20 right-0 opacity-35" />
        <CircuitPattern className="w-[300px] h-[300px] text-pattern absolute bottom-10 left-10 opacity-25" />
        {/* Benin accents - Plus visibles */}
        <div className="absolute top-[30%] left-[5%] w-[180px] h-[180px] bg-benin-yellow/22 rounded-full blur-[60px]" />
        <div className="absolute bottom-[40%] right-[10%] w-[140px] h-[140px] bg-benin-red/18 rounded-full blur-[50px]" />
        
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-3">Le Parcours</p>
            <h2 className="text-3xl md:text-5xl font-black text-text">Les 6 Phases de Selection</h2>
          </AnimatedSection>
          
          {/* Timeline grid layout - alternant */}
          <div className="relative">
            {/* Ligne centrale verticale */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
            
            <div className="space-y-8 lg:space-y-0">
              {phases.map((item, idx) => (
                <AnimatedCard key={item.id} delay={idx * 0.1}>
                  <div className={`lg:grid lg:grid-cols-2 lg:gap-16 items-center ${idx % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                    {/* Content side */}
                    <div className={`${idx % 2 === 0 ? 'lg:text-right lg:pr-16' : 'lg:order-2 lg:pl-16'} mb-6 lg:mb-0`}>
                      <div className={`p-8 bg-white border border-border rounded-2xl hover:border-primary/30 hover:shadow-lg transition-all ${idx % 2 === 0 ? 'lg:ml-auto' : ''} max-w-md ${idx % 2 === 0 ? 'lg:ml-auto' : 'lg:mr-auto'}`}>
                        <span className={`${idx === 0 ? 'text-white bg-accent' : 'text-text-secondary bg-background-alt'} font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4`}>
                          Phase {String(item.phase_number).padStart(2, '0')}
                        </span>
                        <h3 className="text-text text-xl font-bold mb-3">{item.title}</h3>
                        <p className="text-text-secondary mb-4">{item.description}</p>
                        {(item.start_date || item.end_date) && (
                          <div className="text-sm font-bold text-accent">
                            {item.start_date ? new Date(item.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''} 
                            {item.end_date ? ` - ${new Date(item.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Center icon (visible only on lg) */}
                    <div className={`hidden lg:flex items-center justify-center ${idx % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="absolute left-1/2 -translate-x-1/2">
                        {(() => { const Icon = phaseIcons[idx] || phaseIcons[0]; return (
                        <div className={`size-14 rounded-full flex items-center justify-center border-4 border-background ${idx === 0 ? 'bg-primary text-white' : 'bg-white text-primary border-2 border-primary/30'}`}>
                          <Icon size={24} />
                        </div>
                        ); })()}
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Calendar 2026 - NEW SECTION */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-20 py-20 bg-background-alt overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <img 
            src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <CircuitPattern className="w-[300px] h-[300px] text-pattern absolute top-10 right-0 opacity-25" />
        <div className="absolute top-[20%] left-[5%] w-[100px] h-[100px] bg-benin-yellow/8 rounded-full blur-[50px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-3">Calendrier</p>
            <h2 className="text-3xl md:text-4xl font-black text-text mb-4">Dates Cles 2026</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Marquez ces dates importantes dans votre agenda. Ne manquez aucune etape de la competition.</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { month: 'JANVIER', date: '15', title: 'Ouverture Inscriptions', desc: 'Debut de la periode d\'inscription en ligne', color: 'bg-primary' },
              { month: 'FEVRIER', date: '28', title: 'Cloture Inscriptions', desc: 'Date limite pour soumettre votre candidature', color: 'bg-accent-dark' },
              { month: 'MARS', date: '01-31', title: 'Formation en Ligne', desc: 'Acces aux modules de formation IA', color: 'bg-accent' },
              { month: 'AVRIL', date: '05', title: 'Examens Preliminaires', desc: 'Tests en ligne de logique et programmation', color: 'bg-primary-light' },
              { month: 'MAI', date: '10', title: 'Fin Qualificatifs', desc: 'Dernier jour des evenements regionaux', color: 'bg-benin-yellow' },
              { month: 'JUIN', date: '15-16', title: 'Grande Finale', desc: 'Hackathon 24h a Cotonou', color: 'bg-benin-red' },
            ].map((event, i) => (
              <AnimatedCard key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all group">
                  <div className={`${event.color} text-white p-4 text-center`}>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-80">{event.month}</p>
                    <p className="text-4xl font-black mt-1">{event.date}</p>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-text mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-sm text-text-secondary">{event.desc}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>

          <AnimatedSection className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-white rounded-2xl border border-border shadow-sm">
              <p className="text-text font-bold">Ajoutez ces dates a votre calendrier</p>
              <button className="px-6 py-3 bg-gradient-to-r from-primary via-accent to-blue text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all">
                Telecharger (.ics)
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Criteria - Disposition en bento grid */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-20 py-20 bg-white overflow-hidden">
        <DataFlowPattern className="w-[250px] h-[600px] text-pattern absolute top-0 right-20 opacity-40" />
        <HexagonPattern className="w-[200px] h-[200px] text-pattern absolute bottom-10 left-10 opacity-20" />
        {/* Benin accent */}
        <div className="absolute bottom-[20%] right-[5%] w-[120px] h-[120px] bg-benin-green/8 rounded-full blur-[50px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-3">Eligibilite</p>
            <h2 className="text-text text-3xl md:text-4xl font-black">Criteres de Selection</h2>
          </AnimatedSection>
          
          {/* Bento grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {criteria.map((c, i) => (
              <AnimatedCard key={i} delay={i * 0.1}>
                <div className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ${i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
                  <div className={`bg-white border border-border p-8 h-full hover:border-primary/30 hover:shadow-lg transition-all ${i === 0 ? 'min-h-[320px] flex flex-col' : ''}`}>
                    <div className={`${i === 0 ? 'size-16' : 'size-12'} bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform`} aria-hidden="true">
                      <c.icon size={i === 0 ? 32 : 24} />
                    </div>
                    <h4 className={`font-bold mb-3 text-text ${i === 0 ? 'text-2xl' : 'text-lg'}`}>{c.title}</h4>
                    <p className={`text-text-secondary leading-relaxed ${i === 0 ? 'text-base' : 'text-sm'}`}>{c.desc}</p>
                    {i === 0 && (
                      <div className="mt-auto pt-6">
                        <span className="inline-flex items-center gap-2 text-accent font-bold text-sm">
                          Critere principal
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - Layout asymetrique */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-20 pb-28 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left - Title section */}
            <div className="lg:col-span-2 lg:sticky lg:top-32 lg:self-start">
              <AnimatedSection>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-3">Support</p>
                <h2 className="text-3xl md:text-4xl font-black text-text mb-4">Questions Frequentes</h2>
                <p className="text-text-secondary mb-8">Tout ce que vous devez savoir pour participer a l'OAIB.</p>
                <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20">
                  <p className="text-sm font-bold text-text mb-2">Besoin d'aide ?</p>
                  <p className="text-sm text-text-secondary mb-4">Notre equipe est disponible pour repondre a vos questions.</p>
                  <button className="text-primary font-bold text-sm hover:underline">
                    Contacter le support →
                  </button>
                </div>
              </AnimatedSection>
            </div>
            
            {/* Right - FAQ items */}
            <div className="lg:col-span-3 space-y-4" role="region" aria-label="Questions frequemment posees">
              {faqItems.map((faq, i) => (
                <AnimatedCard key={faq.id} delay={i * 0.05}>
                  <div className="bg-background border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all">
                    <button
                      className="flex items-center justify-between w-full p-6 text-left font-bold text-lg text-text focus:outline-none"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                      aria-controls={`faq-answer-${i}`}
                    >
                      {faq.question}
                      <ChevronDown className={`transition-transform text-text-secondary shrink-0 ml-4 ${openFaq === i ? 'rotate-180 text-accent' : ''}`} size={20} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          id={`faq-answer-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 text-text-secondary">{faq.answer}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Program;
