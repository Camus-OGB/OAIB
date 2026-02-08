import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Globe, ArrowRight, Calendar, BarChart3, HelpCircle, Quote, ChevronLeft, ChevronRight, Sparkles, Cpu, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarousel } from '../../shared/hooks/useCarousel';
import { useCountdown } from '../../shared/hooks/useCountdown';
import { usePageTitle } from '../../shared/hooks/usePageTitle';
import { heroImages } from '../data/home';
import { listNews, listPartners, listTestimonials } from '../../services/cmsService';
import { listEditionsPublic, listPhasesPublic } from '../../services/examService';
import type { NewsArticleListItem, Partner, Phase, Testimonial } from '../../shared/types';
import { AnimatedSection, AnimatedCard } from '../../shared/components/layout/AnimatedSection';
import { OptimizedImage } from '../../shared/components/ui/OptimizedImage';
import { NeuralNetworkPattern, ConstellationPattern, CircuitPattern } from '../../shared/components/patterns/AIPatterns';
import LiveCounter from '../../shared/components/LiveCounter';
import { parseDjangoDate, formatDate } from '../../shared/utils/dateHelpers';

const FALLBACK_DATE = new Date('2026-12-01T00:00:00');

const Home: React.FC = () => {
  usePageTitle();

  const heroCarousel = useCarousel(heroImages.length, 5000);

  // ── API state ──────────────────────────────────────────────
  const [newsItems, setNewsItems] = useState<NewsArticleListItem[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editionsCount, setEditionsCount] = useState(0);
  const [nextPhaseDate, setNextPhaseDate] = useState<Date | null>(null);
  const [nextPhaseLabel, setNextPhaseLabel] = useState('LA COMPETITION');

  const countdown = useCountdown(nextPhaseDate ?? FALLBACK_DATE);
  const testimonialCarousel = useCarousel(testimonials.length, 6000);


  useEffect(() => {
    listNews('page_size=4').then(r => {
      if (r.data) {
        // Filtrer uniquement les actualités publiées
        const publishedNews = (r.data.results ?? []).filter(n => n.status === 'published');
        setNewsItems(publishedNews);
      }
    }).catch(() => {});
    listPartners().then(r => { if (r.data) setPartners((r.data.results ?? []).filter(p => p.is_active)); }).catch(() => {});
    listTestimonials('page_size=10').then(r => { if (r.data) setTestimonials((r.data.results ?? []).filter(t => t.is_active)); }).catch(() => {});
    listEditionsPublic().then(r => { if (r.data) setEditionsCount(r.data.count ?? 0); }).catch(() => {});
    // Trouver la prochaine phase upcoming pour le countdown
    listPhasesPublic('ordering=start_date').then(r => {
      if (!r.data) return;
      const phases = r.data.results ?? [];
      const upcoming = phases.find((p: Phase) => p.status === 'upcoming');
      if (upcoming) {
        const d = parseDjangoDate(upcoming.start_date);
        if (d) { setNextPhaseDate(d); setNextPhaseLabel(upcoming.title.toUpperCase()); }
      } else {
        const active = phases.find((p: Phase) => p.status === 'active');
        if (active) {
          const d = parseDjangoDate(active.end_date);
          if (d) {
            d.setHours(23, 59, 59);
            setNextPhaseDate(d);
            setNextPhaseLabel(`FIN : ${active.title.toUpperCase()}`);
          }
        }
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="w-full overflow-hidden bg-background">
      {/* Hero Section - Style flyer OAIB */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-white to-blue/10">
        {/* Binary matrix overlay - digital effect */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none font-mono text-[10px] text-primary leading-relaxed select-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap animate-pulse" style={{ animationDelay: `${i * 0.15}s`, animationDuration: '4s' }}>
              {Array.from({ length: 180 }).map(() => Math.random() > 0.5 ? '1' : '0').join(' ')}
            </div>
          ))}
        </div>

        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-circuit" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="60" cy="60" r="2.5" fill="currentColor" className="text-primary" />
                <line x1="60" y1="60" x2="120" y2="60" stroke="currentColor" strokeWidth="0.8" className="text-accent" />
                <line x1="60" y1="60" x2="60" y2="0" stroke="currentColor" strokeWidth="0.8" className="text-blue" />
                <circle cx="0" cy="60" r="2" fill="currentColor" className="text-accent" />
                <circle cx="60" cy="0" r="2" fill="currentColor" className="text-blue" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-circuit)" />
          </svg>
        </div>

        {/* Subtle background image */}
        <div className="absolute inset-0 opacity-[0.08]">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Gradient blurs - Style flyer (vert turquoise vers bleu marine) - Plus visibles */}
        <div className="absolute top-[15%] right-[10%] w-[700px] h-[700px] bg-primary/45 rounded-full blur-[130px]" />
        <div className="absolute bottom-[20%] left-[5%] w-[600px] h-[600px] bg-blue/35 rounded-full blur-[110px]" />
        <div className="absolute top-[40%] right-[25%] w-[450px] h-[450px] bg-accent/35 rounded-full blur-[100px]" />
        
        {/* Patterns */}
        <NeuralNetworkPattern className="w-[600px] h-[600px] text-pattern absolute bottom-0 right-0 opacity-30" />
        <ConstellationPattern className="w-[400px] h-[400px] text-pattern absolute top-10 left-10 opacity-35" />
        {/* Benin flag colors - Plus visibles */}
        <div className="absolute top-[25%] right-[30%] w-[280px] h-[280px] bg-benin-yellow/25 rounded-full blur-[80px]" />
        <div className="absolute bottom-[35%] left-[25%] w-[220px] h-[220px] bg-benin-red/22 rounded-full blur-[70px]" />
        <div className="absolute top-[55%] right-[15%] w-[180px] h-[180px] bg-benin-green/18 rounded-full blur-[60px]" />
        {/* Tricolor line - Plus visible */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-benin-green/40" />
          <div className="flex-1 bg-benin-yellow/50" />
          <div className="flex-1 bg-benin-red/40" />
        </div>

        <div className="w-full relative z-10 px-6 sm:px-10 md:px-16 lg:px-20 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Left Side - Content */}
              <div className="flex-1 text-center lg:text-left max-w-xl lg:max-w-lg">
                {/* Date & Location Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-8"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-primary/30 text-text text-xs font-bold uppercase tracking-wider shadow-sm hover:border-primary transition-all">
                    <Calendar size={14} className="text-primary" />
                    Decembre 2026
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-accent/30 text-text text-xs font-bold uppercase tracking-wider shadow-sm hover:border-accent transition-all">
                    <Globe size={14} className="text-accent" />
                    Cotonou, Benin
                  </span>
                </motion.div>

                {/* Main Title */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent mb-4">
                    5ème Edition
                  </p>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-text mb-6">
                    Olympiades<br />
                    <span className="bg-gradient-to-r from-primary via-accent to-blue bg-clip-text text-transparent">
                      d'Intelligence Artificielle
                    </span>
                    <br />du Benin
                  </h1>
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-base sm:text-lg text-text-secondary leading-relaxed mb-8"
                >
                  La competition nationale d'IA pour les lyceens et etudiants beninois.
                  Developpez vos competences et representez le Benin a l'international.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-4"
                >
                  <Link
                    to="/programme"
                    className="group inline-flex items-center gap-2 px-7 py-3.5 bg-red text-white font-bold text-sm rounded-xl transition-all hover:bg-red-light hover:shadow-lg hover:shadow-red/25 hover:scale-[1.02]"
                  >
                    S'inscrire maintenant
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/a-propos"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-yellow/10 to-yellow/5 border-2 border-yellow/40 text-text font-bold text-sm rounded-xl hover:from-yellow hover:to-yellow-light hover:text-white hover:border-yellow transition-all shadow-sm"
                  >
                    En savoir plus
                  </Link>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex justify-center lg:justify-start items-center gap-8 mt-10 pt-8 border-t border-border"
                >
                  {[
                    { value: editionsCount > 0 ? String(editionsCount).padStart(2, '0') : '—', label: 'Éditions', icon: Sparkles, color: 'text-yellow' },
                    { value: partners.length > 0 ? `${partners.length}+` : '—', label: 'Partenaires', icon: Globe, color: 'text-primary' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center lg:text-left">
                      <p className={`text-2xl sm:text-3xl font-black ${stat.color || 'text-primary'}`}>{stat.value}</p>
                      <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mt-1">{stat.label}</p>
                    </div>
                  ))}
                  {/* Live counter for candidates */}
                  <div className="text-center lg:text-left">
                    <p className="text-2xl sm:text-3xl font-black text-primary">
                      <LiveCounter />
                    </p>
                    <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mt-1">Inscrits 2026</p>
                  </div>
                </motion.div>
              </div>

              {/* Right Side - Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative flex-1 w-full lg:w-auto lg:flex-[1.2]"
                onMouseEnter={heroCarousel.pause}
                onMouseLeave={heroCarousel.resume}
                onTouchStart={heroCarousel.handleTouchStart}
                onTouchMove={heroCarousel.handleTouchMove}
                onTouchEnd={heroCarousel.handleTouchEnd}
                role="region"
                aria-roledescription="carousel"
                aria-label="Images de presentation"
              >
                {/* Image Container */}
                <div className="relative w-full max-w-[550px] lg:max-w-none aspect-[4/4] lg:aspect-[4/4.5] mx-auto">
                  {/* Soft shadow behind */}
                  <div className="absolute -inset-2 bg-primary/15 rounded-[3rem] blur-2xl opacity-50" />

                  {/* Main Image */}
                  <div className="relative w-full h-full rounded-[2rem] lg:rounded-[3rem] overflow-hidden border border-border shadow-xl">
                    {heroImages.map((img, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                          index === heroCarousel.current ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`OAIB - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          aria-hidden={index !== heroCarousel.current}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-20">
                    <div className="px-5 py-3 bg-white/95 backdrop-blur-md rounded-xl border border-border shadow-lg">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Prochaine edition</p>
                      <p className="text-xl font-black text-primary">2026</p>
                    </div>
                  </div>

                  {/* Navigation Dots */}
                  <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex gap-2 z-20" role="tablist">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => heroCarousel.goTo(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === heroCarousel.current ? 'w-6 bg-accent' : 'w-2 bg-text-muted/40 hover:bg-text-muted/60'
                        }`}
                        role="tab"
                        aria-selected={idx === heroCarousel.current}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section - Gradient moderne style flyer */}
      <AnimatedSection>
        <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-br from-primary via-primary to-blue">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-[100px]" aria-hidden="true" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-[80px]" aria-hidden="true" />
          </div>
          <CircuitPattern className="w-full h-[200px] text-white/20 top-1/2 -translate-y-1/2 left-0 opacity-40" />

          <div className="relative z-10 px-6 sm:px-10 md:px-16 lg:px-20">
            <div className="max-w-6xl mx-auto text-center">
              {nextPhaseDate ? (
                <>
                  <p className="text-white/90 text-sm uppercase tracking-widest mb-8">{nextPhaseLabel} commence dans</p>

                  {/* Countdown display */}
                  <div className="mb-8 flex justify-center items-center gap-4 sm:gap-8 md:gap-12 lg:gap-16" aria-live="polite" aria-label="Compte a rebours">
                    {[
                      { value: countdown.days, label: 'Jours' },
                      { value: countdown.hours, label: 'Heures' },
                      { value: countdown.minutes, label: 'Min' },
                      { value: countdown.seconds, label: 'Sec' },
                    ].map((item, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && (
                          <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white/10 -mt-4">:</span>
                        )}
                        <div className="flex flex-col items-center">
                          <div className="relative">
                            <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight">
                              {item.value}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/60 mt-2">{item.label}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-8">
                  <p className="text-white/90 text-sm uppercase tracking-widest mb-6">Prochaine compétition</p>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Dates à venir</p>
                  <p className="text-white/70 text-base max-w-md mx-auto">Les dates de la prochaine édition seront annoncées prochainement. Restez connectés !</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Discover Section - Cards with gradients */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-20 py-20 bg-background overflow-hidden">
        {/* Thematic background image */}
        <div className="absolute inset-0 opacity-[0.15]">
          <img
            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {/* Subtle Benin accents - Plus visibles */}
        <div className="absolute top-10 right-10 w-[280px] h-[280px] bg-benin-yellow/18 rounded-full blur-[85px]" />
        <div className="absolute bottom-10 left-20 w-[220px] h-[220px] bg-benin-red/15 rounded-full blur-[70px]" />
        <CircuitPattern className="w-[400px] h-[400px] text-pattern absolute top-0 left-0 opacity-35" />
        <div className="w-full max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-3">Decouvrir</p>
            <h2 className="text-3xl md:text-4xl font-black text-text">Explorez l'OAIB</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 - A Propos */}
            <AnimatedCard delay={0}>
              <Link
                to="/a-propos"
                className="group relative h-72 flex flex-col justify-end p-7 bg-white border-2 border-primary/20 rounded-2xl overflow-hidden hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-6 right-6 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                  <Globe className="w-7 h-7 text-primary" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">A Propos</h3>
                  <p className="text-sm text-text-secondary">Notre mission et l'impact sur l'ecosysteme tech beninois.</p>
                </div>
              </Link>
            </AnimatedCard>

            {/* Card 2 - Programme */}
            <AnimatedCard delay={0.1}>
              <Link
                to="/programme"
                className="group relative h-72 flex flex-col justify-end p-7 bg-white border-2 border-accent/20 rounded-2xl overflow-hidden hover:border-accent hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-6 right-6 w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/20 transition-all">
                  <Calendar className="w-7 h-7 text-accent" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-text mb-2 group-hover:text-accent transition-colors">Programme</h3>
                  <p className="text-sm text-text-secondary">Dates cles et deroulement de la competition.</p>
                </div>
              </Link>
            </AnimatedCard>

            {/* Card 3 - Resultats */}
            <AnimatedCard delay={0.2}>
              <Link
                to="/resultats"
                className="group relative h-72 flex flex-col justify-end p-7 bg-white border-2 border-yellow/30 rounded-2xl overflow-hidden hover:border-yellow hover:shadow-xl hover:shadow-yellow/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-6 right-6 w-14 h-14 rounded-xl bg-yellow/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-yellow/20 transition-all">
                  <Award className="w-7 h-7 text-yellow-dark" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-text mb-2 group-hover:text-yellow-dark transition-colors">Resultats</h3>
                  <p className="text-sm text-text-secondary">Classements et laureats des editions passees.</p>
                </div>
              </Link>
            </AnimatedCard>

            {/* Card 4 - FAQ */}
            <AnimatedCard delay={0.3}>
              <Link
                to="/programme"
                className="group relative h-72 flex flex-col justify-end p-7 bg-white border-2 border-red/20 rounded-2xl overflow-hidden hover:border-red hover:shadow-xl hover:shadow-red/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-6 right-6 w-14 h-14 rounded-xl bg-red/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-red/20 transition-all">
                  <HelpCircle className="w-7 h-7 text-red" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-text mb-2 group-hover:text-red transition-colors">Questions frequentes</h3>
                  <p className="text-sm text-text-secondary">Inscription, epreuves, conditions de participation... toutes vos reponses.</p>
                </div>
              </Link>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-20 py-20 bg-white overflow-hidden">
        {/* Subtle background pattern */}
        <ConstellationPattern className="w-[350px] h-[350px] text-pattern absolute top-10 right-0 opacity-25" />
        {/* Benin accent - Plus visible */}
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-benin-green/15 rounded-full blur-[75px]" />
        <div className="w-full max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-3">Actualites</p>
              <h2 className="text-3xl md:text-4xl font-black text-text">Dernieres Nouvelles</h2>
              <p className="text-text-secondary mt-2 max-w-md">Restez informe des annonces et mises a jour de l'OAIB.</p>
            </div>
            <Link to="/actualites" className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-full text-sm font-bold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
              Toutes les actualites <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {newsItems.length > 0 ? (
            <>
            {/* Featured News - Large */}
            <AnimatedCard delay={0} className="lg:col-span-3">
              <article className="group relative h-full min-h-[400px] rounded-2xl overflow-hidden border border-border">
                <OptimizedImage src={newsItems[0].image || ''} alt={newsItems[0].title} className="absolute inset-0 h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/50 to-navy/20" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <span className={`inline-flex self-start items-center px-3 py-1.5 rounded-full bg-accent/90 backdrop-blur-sm text-xs font-bold text-white border border-white/10 mb-4`}>
                    Actualité
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors">{newsItems[0].title}</h3>
                  <p className="text-accent/80 mb-4 line-clamp-2">{newsItems[0].excerpt}</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-accent/60 uppercase tracking-wider">
                    <Calendar size={14} /> {formatDate(newsItems[0].published_at)}
                  </div>
                </div>
              </article>
            </AnimatedCard>

            {/* Other News - Stacked */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {newsItems.slice(1, 4).map((news, i) => (
                <AnimatedCard key={news.id} delay={0.1 + i * 0.1}>
                  <article className="group flex gap-4 p-4 rounded-xl bg-background border border-border hover:border-primary/30 transition-all duration-300">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border">
                      <OptimizedImage src={news.image || ''} alt={news.title} className="h-full" />
                    </div>
                    <div className="flex flex-col justify-between py-0.5">
                      <div>
                        <span className={`text-xs font-bold text-accent mb-1 block`}>Actualité</span>
                        <h3 className="text-sm font-bold text-text group-hover:text-primary transition-colors line-clamp-2">{news.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Calendar size={12} /> {formatDate(news.published_at)}
                      </div>
                    </div>
                  </article>
                </AnimatedCard>
              ))}
            </div>
            </>
            ) : (
              <div className="lg:col-span-5 text-center py-12">
                <p className="text-text-secondary">Chargement des actualités...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-24 relative overflow-hidden bg-background">
        {/* Thematic background image */}
        <div className="absolute inset-0 opacity-[0.02]">
          <img
            src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {/* Decorative elements - Plus colorés */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/22 rounded-full blur-[130px]" aria-hidden="true" />
        <div className="absolute bottom-20 right-10 w-[420px] h-[420px] bg-accent/20 rounded-full blur-[130px]" aria-hidden="true" />
        {/* Benin colors - Plus visibles */}
        <div className="absolute top-[40%] right-[5%] w-[220px] h-[220px] bg-benin-yellow/22 rounded-full blur-[75px]" />
        <div className="absolute bottom-[30%] left-[15%] w-[160px] h-[160px] bg-benin-red/18 rounded-full blur-[60px]" />
        <NeuralNetworkPattern className="w-[300px] h-[300px] text-pattern absolute bottom-0 right-0 opacity-30" />

        <div className="w-full max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-3">Temoignages</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-text">Ils ont vecu l'experience OAIB</h2>
            <p className="text-text-secondary">Decouvrez les parcours inspirants de nos laureats</p>
          </AnimatedSection>

          {testimonials.length > 0 ? (
          <div
            className="relative"
            onMouseEnter={testimonialCarousel.pause}
            onMouseLeave={testimonialCarousel.resume}
            onTouchStart={testimonialCarousel.handleTouchStart}
            onTouchMove={testimonialCarousel.handleTouchMove}
            onTouchEnd={testimonialCarousel.handleTouchEnd}
            role="region"
            aria-roledescription="carousel"
            aria-label="Temoignages"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialCarousel.current}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
                role="group"
                aria-roledescription="slide"
                aria-label={`Temoignage ${testimonialCarousel.current + 1} sur ${testimonials.length}`}
              >
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                  {/* Video / Photo */}
                  <div className="relative lg:w-2/5 shrink-0">
                    <div className="relative w-64 h-80 sm:w-72 sm:h-96 mx-auto">
                      {/* Glow effect */}
                      <div className="absolute -inset-4 bg-primary/15 rounded-[2rem] blur-xl opacity-60" />

                      {/* Video or Image */}
                      <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden border border-border shadow-lg bg-navy">
                        {testimonials[testimonialCarousel.current].video_url ? (
                          <iframe
                            src={testimonials[testimonialCarousel.current].video_url}
                            title={`Témoignage de ${testimonials[testimonialCarousel.current].name}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        ) : testimonials[testimonialCarousel.current].image ? (
                          <OptimizedImage
                            src={testimonials[testimonialCarousel.current].image}
                            alt={testimonials[testimonialCarousel.current].name}
                            className="h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-700">
                            <Users className="w-20 h-20 text-slate-500" />
                          </div>
                        )}
                      </div>

                      {/* Quote icon */}
                      <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-xl shadow-accent/30">
                        <Quote className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-3/5 text-center lg:text-left">
                    <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed text-text mb-8">
                      <span className="text-accent text-4xl leading-none">"</span>
                      {testimonials[testimonialCarousel.current].quote}
                      <span className="text-accent text-4xl leading-none">"</span>
                    </blockquote>

                    <div className="flex items-center gap-4 justify-center lg:justify-start">
                      <div className="w-12 h-1 bg-primary rounded-full" />
                      <div>
                        <p className="font-black text-xl text-text">{testimonials[testimonialCarousel.current].name}</p>
                        <p className="text-primary font-semibold">{testimonials[testimonialCarousel.current].role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-6 mt-16">
              <button
                onClick={testimonialCarousel.prev}
                className="w-12 h-12 rounded-full border border-border text-text-secondary flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300"
                aria-label="Temoignage precedent"
              >
                <ChevronLeft size={22} />
              </button>

              <div className="flex gap-3" role="tablist" aria-label="Indicateurs de temoignage">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => testimonialCarousel.goTo(idx)}
                    className={`rounded-full transition-all duration-500 ${idx === testimonialCarousel.current ? 'w-10 h-3 bg-primary' : 'w-3 h-3 bg-border hover:bg-text-muted'}`}
                    role="tab"
                    aria-selected={idx === testimonialCarousel.current}
                    aria-label={`Temoignage ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={testimonialCarousel.next}
                className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-light hover:shadow-lg transition-all duration-300"
                aria-label="Temoignage suivant"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-secondary">Chargement des témoignages...</p>
            </div>
          )}
        </div>
      </section>

      {/* Partners Section */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-16 bg-white border-t border-border overflow-hidden">
        <div className="w-full max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-text-secondary">Nos Partenaires</p>
          </AnimatedSection>
          
          {/* Carrousel de logos */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* Premier groupe */}
              {partners.map((partner, i) => (
                <div key={`p1-${partner.id}`} className="flex-shrink-0 w-64 mx-4">
                  <div className="flex items-center justify-center h-20 px-6 py-4 rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-default">
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-10 max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <span className="text-sm font-bold text-text-secondary">{partner.name}</span>
                    )}
                  </div>
                </div>
              ))}
              {/* Duplication pour effet infini */}
              {partners.map((partner, i) => (
                <div key={`p2-${partner.id}`} className="flex-shrink-0 w-64 mx-4">
                  <div className="flex items-center justify-center h-20 px-6 py-4 rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-default">
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-10 max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <span className="text-sm font-bold text-text-secondary">{partner.name}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
