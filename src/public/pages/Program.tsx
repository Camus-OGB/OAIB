import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTitle } from '../../shared/hooks/usePageTitle';
import { phases, criteria, faqItems } from '../data/program';
import { AnimatedSection, AnimatedCard } from '../../shared/components/layout/AnimatedSection';
import { OptimizedImage } from '../../shared/components/ui/OptimizedImage';
import { CircuitPattern, DataFlowPattern, HexagonPattern } from '../../shared/components/patterns/AIPatterns';

const Program: React.FC = () => {
  usePageTitle('Programme');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="w-full bg-background relative">
      {/* Hero - Full Width Background Image avec overlay */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/75" />
        </div>
        
        {/* Pattern decoratif */}
        <CircuitPattern className="w-[500px] h-[500px] text-pattern absolute top-10 right-10 opacity-60" />
        <DataFlowPattern className="w-[250px] h-[600px] text-pattern absolute bottom-0 left-20 opacity-50" />
        <HexagonPattern className="w-[300px] h-[300px] text-pattern absolute top-20 left-[40%] opacity-35" />
        {/* Benin flag colors - subtle */}
        <div className="absolute top-[40%] left-[10%] w-[180px] h-[180px] bg-benin-yellow/18 rounded-full blur-[70px]" />
        <div className="absolute bottom-[20%] right-[30%] w-[130px] h-[130px] bg-benin-red/12 rounded-full blur-[60px]" />
        <div className="absolute top-[20%] right-[15%] w-[100px] h-[100px] bg-benin-green/10 rounded-full blur-[50px]" />
        {/* Tricolor vertical line */}
        <div className="absolute top-0 bottom-0 left-0 w-1 flex flex-col">
          <div className="flex-1 bg-benin-green/30" />
          <div className="flex-1 bg-benin-yellow/35" />
          <div className="flex-1 bg-benin-red/30" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full px-6 sm:px-10 md:px-16 lg:px-20 py-20">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <span className="inline-block px-4 py-1.5 bg-accent text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                Edition 2026
              </span>
              <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] max-w-4xl mb-6">
                Votre parcours vers<br />
                <span className="text-accent">l'excellence en IA</span>
              </h1>
              <p className="text-accent/80 text-lg md:text-xl max-w-2xl mb-10">
                Six etapes pour transformer votre passion en expertise. Rejoignez les futurs leaders de l'intelligence artificielle au Benin.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-accent hover:bg-accent-light text-primary h-14 px-8 rounded-full font-bold text-base transition-all">
                  Commencer l'inscription
                </button>
                <button className="border border-white/20 hover:border-accent hover:bg-white/5 text-white h-14 px-8 rounded-full font-bold text-base transition-all backdrop-blur-sm">
                  Telecharger le guide
                </button>
              </div>
            </AnimatedSection>
          </div>
        </div>
        
        {/* Courbe decorative en bas */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
            <path d="M0 60V30C240 50 480 10 720 30C960 50 1200 10 1440 30V60H0Z" className="fill-background" />
          </svg>
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
        {/* Benin accents */}
        <div className="absolute top-[30%] left-[5%] w-[100px] h-[100px] bg-benin-yellow/10 rounded-full blur-[50px]" />
        <div className="absolute bottom-[40%] right-[10%] w-[80px] h-[80px] bg-benin-red/8 rounded-full blur-[40px]" />
        
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
                <AnimatedCard key={idx} delay={idx * 0.1}>
                  <div className={`lg:grid lg:grid-cols-2 lg:gap-16 items-center ${idx % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                    {/* Content side */}
                    <div className={`${idx % 2 === 0 ? 'lg:text-right lg:pr-16' : 'lg:order-2 lg:pl-16'} mb-6 lg:mb-0`}>
                      <div className={`p-8 bg-white border border-border rounded-2xl hover:border-primary/30 hover:shadow-lg transition-all ${idx % 2 === 0 ? 'lg:ml-auto' : ''} max-w-md ${idx % 2 === 0 ? 'lg:ml-auto' : 'lg:mr-auto'}`}>
                        <span className={`${idx === 0 ? 'text-primary bg-accent' : 'text-text-secondary bg-background-alt'} font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4`}>
                          {item.phase}
                        </span>
                        <h3 className="text-text text-xl font-bold mb-3">{item.title}</h3>
                        <p className="text-text-secondary mb-4">{item.desc}</p>
                        {item.date && (
                          <div className="text-sm font-bold text-accent">{item.date}</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Center icon (visible only on lg) */}
                    <div className={`hidden lg:flex items-center justify-center ${idx % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="absolute left-1/2 -translate-x-1/2">
                        <div className={`size-14 rounded-full flex items-center justify-center border-4 border-background ${idx === 0 ? 'bg-primary text-white' : 'bg-white text-primary border-2 border-primary/30'}`}>
                          <item.icon size={24} />
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
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
                <AnimatedCard key={i} delay={i * 0.05}>
                  <div className="bg-background border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all">
                    <button
                      className="flex items-center justify-between w-full p-6 text-left font-bold text-lg text-text focus:outline-none"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                      aria-controls={`faq-answer-${i}`}
                    >
                      {faq.q}
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
                          <div className="px-6 pb-6 text-text-secondary">{faq.a}</div>
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
