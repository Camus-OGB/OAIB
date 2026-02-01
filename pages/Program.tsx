import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTitle } from '../hooks/usePageTitle';
import { phases, criteria, faqItems } from '../data/program';
import { AnimatedSection, AnimatedCard } from '../components/AnimatedSection';
import { OptimizedImage } from '../components/OptimizedImage';

const Program: React.FC = () => {
  usePageTitle('Programme');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 pb-20">
      {/* Hero */}
      <section className="py-12 md:py-20">
        <div className="flex flex-col gap-10 md:flex-row items-center">
          <AnimatedSection className="w-full md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-2xl h-[360px] md:h-[420px]">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=75"
                alt="Etudiants collaborant sur un projet d'intelligence artificielle"
                className="h-full"
              />
            </div>
          </AnimatedSection>
          <AnimatedSection className="w-full md:w-1/2 flex flex-col gap-6" delay={0.2}>
            <div className="flex flex-col gap-4">
              <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded-full w-max">Future Leaders</span>
              <h1 className="text-[#111813] dark:text-white text-3xl md:text-5xl lg:text-6xl font-black leading-tight">
                Programme & Processus Edition 2026
              </h1>
              <p className="text-[#61896f] dark:text-gray-400 text-lg leading-relaxed">
                Rejoignez la premiere competition d'intelligence artificielle du Benin. Nous recherchons les esprits les plus brillants pour mener la prochaine revolution technologique.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="bg-primary hover:bg-primary/90 text-[#111813] h-12 px-6 rounded-lg font-bold text-sm md:text-base transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Voir le Calendrier
              </button>
              <button className="border-2 border-primary/30 hover:border-primary text-[#111813] dark:text-white h-12 px-6 rounded-lg font-bold text-sm md:text-base transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Guide PDF
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Phases Timeline */}
      <AnimatedSection>
        <section className="py-16 bg-white dark:bg-[#112240] rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 dark:border-white/5 mb-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-[#111813] dark:text-white">Les 6 Phases de Selection</h2>
          <div className="space-y-0" role="list" aria-label="Phases de selection">
            {phases.map((item, idx, arr) => (
              <AnimatedCard key={idx} delay={idx * 0.08}>
                <div className="grid grid-cols-[40px_1fr] gap-x-6 relative" role="listitem">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center size-10 rounded-full z-10 ${idx === 0 ? 'bg-primary text-white' : 'bg-primary/10 text-primary border-2 border-primary/30'}`} aria-hidden="true">
                      <item.icon size={20} />
                    </div>
                    {idx !== arr.length - 1 && <div className="w-[2px] bg-gray-200 dark:bg-white/10 h-full min-h-[60px]" aria-hidden="true" />}
                  </div>
                  <div className="flex flex-col pb-10">
                    <span className={`${idx === 0 ? 'text-primary' : 'text-gray-400'} font-bold text-xs uppercase tracking-widest mb-1`}>{item.phase}</span>
                    <h3 className="text-[#111813] dark:text-white text-xl font-bold">{item.title}</h3>
                    <p className="text-[#61896f] dark:text-gray-400 mt-2 max-w-xl">{item.desc}</p>
                    {item.date && (
                      <div className="mt-2 text-sm font-semibold text-primary">{item.date}</div>
                    )}
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Criteria */}
      <section className="py-10">
        <AnimatedSection>
          <h2 className="text-[#111813] dark:text-white text-3xl font-bold mb-10">Criteres de Selection</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {criteria.map((c, i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <div className="bg-white dark:bg-[#112240] p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group h-full">
                <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                  <c.icon size={24} />
                </div>
                <h4 className="font-bold text-lg mb-2 text-[#111813] dark:text-white">{c.title}</h4>
                <p className="text-sm text-[#61896f] dark:text-gray-400 leading-relaxed">{c.desc}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 max-w-3xl mx-auto mt-10">
        <AnimatedSection className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#111813] dark:text-white">Questions Frequentes</h2>
        </AnimatedSection>
        <div className="space-y-4" role="region" aria-label="Questions frequemment posees">
          {faqItems.map((faq, i) => (
            <AnimatedCard key={i} delay={i * 0.05}>
              <div className="bg-white dark:bg-[#112240] border border-gray-100 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
                <button
                  className="flex items-center justify-between w-full p-6 text-left font-bold text-lg text-[#111813] dark:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  {faq.q}
                  <ChevronDown className={`transition-transform text-gray-500 shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} size={20} />
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
                      <div className="px-6 pb-6 text-[#61896f] dark:text-gray-300">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Program;
