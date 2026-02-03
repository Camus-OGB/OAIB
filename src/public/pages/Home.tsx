import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Globe, ArrowRight, Calendar, BarChart3, HelpCircle, Quote, ChevronLeft, ChevronRight, Sparkles, Cpu, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarousel } from '../../shared/hooks/useCarousel';
import { useCountdown } from '../../shared/hooks/useCountdown';
import { usePageTitle } from '../../shared/hooks/usePageTitle';
import { heroImages, testimonials, newsItems } from '../data/home';
import { AnimatedSection, AnimatedCard } from '../../shared/components/layout/AnimatedSection';
import { OptimizedImage } from '../../shared/components/ui/OptimizedImage';
import { NeuralNetworkPattern, ConstellationPattern, CircuitPattern } from '../../shared/components/patterns/AIPatterns';

const EDITION_DATE = new Date('2026-12-01T00:00:00');

const Home: React.FC = () => {
  usePageTitle();

  const heroCarousel = useCarousel(heroImages.length, 5000);
  const testimonialCarousel = useCarousel(testimonials.length, 6000);
  const countdown = useCountdown(EDITION_DATE);

  return (
    <div className="w-full overflow-hidden bg-background">
      {/* Hero Section - Light Modern Design */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-background via-white to-background-alt">
        {/* Soft Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px]" />
          <div className="absolute top-[50%] left-[40%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
          {/* Benin flag colors - subtle decorative lines */}
          <div className="absolute top-[30%] right-[5%] w-[250px] h-[250px] bg-benin-yellow/15 rounded-full blur-[80px]" />
          <div className="absolute bottom-[10%] right-[25%] w-[180px] h-[180px] bg-benin-red/12 rounded-full blur-[70px]" />
          <div className="absolute top-[60%] left-[5%] w-[120px] h-[120px] bg-benin-green/10 rounded-full blur-[60px]" />
          {/* Subtle tricolor accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 flex">
            <div className="flex-1 bg-benin-green/20" />
            <div className="flex-1 bg-benin-yellow/25" />
            <div className="flex-1 bg-benin-red/20" />
          </div>
          {/* Pattern overlays - more visible */}
          <NeuralNetworkPattern className="w-[700px] h-[700px] text-pattern top-0 right-0 opacity-40" />
          <ConstellationPattern className="w-[500px] h-[500px] text-pattern bottom-10 left-10 opacity-45" />
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
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border text-text text-xs font-bold uppercase tracking-wider shadow-sm">
                    <Calendar size={14} className="text-primary" />
                    Decembre 2026
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border text-text text-xs font-bold uppercase tracking-wider shadow-sm">
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
                    <span className="text-primary">
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
                    className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-bold text-sm rounded-xl transition-all hover:bg-primary-light hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]"
                  >
                    S'inscrire maintenant
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/a-propos"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border border-border text-text font-bold text-sm rounded-xl hover:bg-background-alt hover:border-primary/30 transition-all shadow-sm"
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
                    { value: '1,500+', label: 'Participants', icon: Users },
                    { value: '04', label: 'Editions', icon: Sparkles },
                    { value: '10+', label: 'Partenaires', icon: Globe },
                  ].map((stat, i) => (
                    <div key={i} className="text-center lg:text-left">
                      <p className="text-2xl sm:text-3xl font-black text-primary">{stat.value}</p>
                      <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mt-1">{stat.label}</p>
                    </div>
                  ))}
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

      {/* Countdown Section - Trust Blue gradient */}
      <AnimatedSection>
        <section className="relative py-12 md:py-16 overflow-hidden bg-primary">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" aria-hidden="true" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-accent/15 rounded-full blur-[80px]" aria-hidden="true" />
          </div>
          <CircuitPattern className="w-full h-[200px] text-pattern top-1/2 -translate-y-1/2 left-0 opacity-40" />

          <div className="relative z-10 px-6 sm:px-10 md:px-16 lg:px-20">
            <div className="max-w-6xl mx-auto text-center">
              <p className="text-accent text-sm uppercase tracking-widest mb-8">La competition commence dans</p>

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
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 mt-2">{item.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
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
        {/* Subtle Benin accents */}
        <div className="absolute top-10 right-10 w-[200px] h-[200px] bg-benin-yellow/8 rounded-full blur-[80px]" />
        <div className="absolute bottom-10 left-20 w-[150px] h-[150px] bg-benin-red/6 rounded-full blur-[60px]" />
        <CircuitPattern className="w-[400px] h-[400px] text-pattern absolute top-0 left-0 opacity-35" />
        <div className="w-full max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-3">Decouvrir</p>
            <h2 className="text-3xl md:text-4xl font-black text-text">Explorez l'OAIB</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 - A Propos */}
            <AnimatedCard delay={0}>
              <Link
                to="/a-propos"
                className="group relative h-72 flex flex-col justify-end p-7 bg-white border border-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                className="group relative h-72 flex flex-col justify-end p-7 bg-white border border-border rounded-2xl overflow-hidden hover:border-accent hover:shadow-lg hover:shadow-accent/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                className="group relative h-72 flex flex-col justify-end p-7 bg-white border border-border rounded-2xl overflow-hidden hover:border-primary-light hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-6 right-6 w-14 h-14 rounded-xl bg-primary-light/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary-light/20 transition-all">
                  <Award className="w-7 h-7 text-primary-light" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">Resultats</h3>
                  <p className="text-sm text-text-secondary">Classements et laureats des editions passees.</p>
                </div>
              </Link>
            </AnimatedCard>

            {/* Card 4 - FAQ (Wider) */}
            <AnimatedCard delay={0.3} className="md:col-span-2">
              <Link
                to="/programme"
                className="group relative h-44 flex items-center justify-between p-8 bg-background-alt border border-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">Questions frequentes</h3>
                  <p className="text-sm text-text-secondary max-w-md">Inscription, epreuves, conditions de participation... toutes vos reponses.</p>
                </div>
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 ml-4">
                  <HelpCircle className="w-8 h-8 text-primary" />
                </div>
              </Link>
            </AnimatedCard>

            {/* Card 5 - Epreuves */}
            <AnimatedCard delay={0.4}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative h-44 flex flex-col justify-center items-center p-6 bg-primary/10 border border-border rounded-2xl overflow-hidden hover:border-accent hover:shadow-lg transition-all duration-300 text-center"
              >
                <Cpu className="w-10 h-10 text-accent mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-text mb-1">Epreuves OAIB</h3>
                <p className="text-xs text-text-secondary">Sujets des editions precedentes</p>
              </a>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-20 py-20 bg-white overflow-hidden">
        {/* Subtle background pattern */}
        <ConstellationPattern className="w-[350px] h-[350px] text-pattern absolute top-10 right-0 opacity-25" />
        {/* Benin accent */}
        <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-benin-green/6 rounded-full blur-[70px]" />
        <div className="w-full max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-3">Actualites</p>
              <h2 className="text-3xl md:text-4xl font-black text-text">Dernieres Nouvelles</h2>
              <p className="text-text-secondary mt-2 max-w-md">Restez informe des annonces et mises a jour de l'OAIB.</p>
            </div>
            <Link to="/a-propos" className="group inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-sm font-bold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all">
              Toutes les actualites <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Featured News - Large */}
            <AnimatedCard delay={0} className="lg:col-span-3">
              <article className="group relative h-full min-h-[400px] rounded-2xl overflow-hidden border border-border">
                <OptimizedImage src={newsItems[0].image} alt={newsItems[0].title} className="absolute inset-0 h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/50 to-navy/20" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <span className={`inline-flex self-start items-center px-3 py-1.5 rounded-full bg-accent/90 backdrop-blur-sm text-xs font-bold text-primary border border-white/10 mb-4`}>
                    {newsItems[0].category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors">{newsItems[0].title}</h3>
                  <p className="text-accent/80 mb-4 line-clamp-2">{newsItems[0].desc}</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-accent/60 uppercase tracking-wider">
                    <Calendar size={14} /> {newsItems[0].date}
                  </div>
                </div>
              </article>
            </AnimatedCard>

            {/* Other News - Stacked */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {newsItems.slice(1).map((news, i) => (
                <AnimatedCard key={i} delay={0.1 + i * 0.1}>
                  <article className="group flex gap-4 p-4 rounded-xl bg-background border border-border hover:border-primary/30 transition-all duration-300">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border">
                      <OptimizedImage src={news.image} alt={news.title} className="h-full" />
                    </div>
                    <div className="flex flex-col justify-between py-0.5">
                      <div>
                        <span className={`text-xs font-bold text-accent mb-1 block`}>{news.category}</span>
                        <h3 className="text-sm font-bold text-text group-hover:text-primary transition-colors line-clamp-2">{news.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Calendar size={12} /> {news.date}
                      </div>
                    </div>
                  </article>
                </AnimatedCard>
              ))}
            </div>
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
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[120px]" aria-hidden="true" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-[120px]" aria-hidden="true" />
        {/* Benin colors */}
        <div className="absolute top-[40%] right-[5%] w-[150px] h-[150px] bg-benin-yellow/10 rounded-full blur-[70px]" />
        <div className="absolute bottom-[30%] left-[15%] w-[100px] h-[100px] bg-benin-red/8 rounded-full blur-[50px]" />
        <NeuralNetworkPattern className="w-[300px] h-[300px] text-pattern absolute bottom-0 right-0 opacity-30" />

        <div className="w-full max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-3">Temoignages</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-text">Ils ont vecu l'experience OAIB</h2>
            <p className="text-text-secondary">Decouvrez les parcours inspirants de nos laureats</p>
          </AnimatedSection>

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
                  {/* Photo */}
                  <div className="relative lg:w-2/5 shrink-0">
                    <div className="relative w-64 h-80 sm:w-72 sm:h-96 mx-auto">
                      {/* Glow effect */}
                      <div className="absolute -inset-4 bg-primary/15 rounded-[2rem] blur-xl opacity-60" />

                      {/* Image */}
                      <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden border border-border shadow-lg">
                        <OptimizedImage
                          src={testimonials[testimonialCarousel.current].image}
                          alt={testimonials[testimonialCarousel.current].name}
                          className="h-full"
                        />
                      </div>

                      {/* Quote icon */}
                      <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-xl shadow-accent/30">
                        <Quote className="w-7 h-7 text-primary" />
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
        </div>
      </section>

      {/* Partners Section */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-16 bg-white border-t border-border">
        <div className="w-full max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-text-secondary">Nos Partenaires</p>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center">
            {[
              { name: 'Ministere du Numerique', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Coat_of_arms_of_Benin.svg/180px-Coat_of_arms_of_Benin.svg.png' },
              { name: 'UNESCO', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/UNESCO_logo.svg/180px-UNESCO_logo.svg.png' },
              { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/200px-Google_2015_logo.svg.png' },
              { name: 'UNICEF', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_of_UNICEF.svg/200px-Logo_of_UNICEF.svg.png' },
              { name: 'African Union', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Flag_of_the_African_Union.svg/200px-Flag_of_the_African_Union.svg.png' },
            ].map((partner, i) => (
              <AnimatedCard key={partner.name} delay={i * 0.05}>
                <div className="flex items-center justify-center h-20 px-6 py-4 rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-default">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-10 max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
