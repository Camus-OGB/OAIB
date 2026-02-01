import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, Globe, ArrowRight, Calendar, BarChart3, HelpCircle, Newspaper, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarousel } from '../hooks/useCarousel';
import { useCountdown } from '../hooks/useCountdown';
import { usePageTitle } from '../hooks/usePageTitle';
import { heroImages, testimonials, newsItems } from '../data/home';
import { AnimatedSection, AnimatedCard } from '../components/AnimatedSection';
import { OptimizedImage } from '../components/OptimizedImage';
import { SectionTitle } from '../components/SectionTitle';

const EDITION_DATE = new Date('2026-12-01T00:00:00');

const Home: React.FC = () => {
  usePageTitle();

  const heroCarousel = useCarousel(heroImages.length, 5000);
  const testimonialCarousel = useCarousel(testimonials.length, 6000);
  const countdown = useCountdown(EDITION_DATE);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 md:px-8 lg:px-12 py-8">
        <div className="w-full">
          <div
            className="relative min-h-[500px] md:min-h-[600px] flex flex-col items-start justify-end p-8 md:p-12 lg:p-16 overflow-hidden rounded-2xl bg-tech-blue group shadow-xl"
            onMouseEnter={heroCarousel.pause}
            onMouseLeave={heroCarousel.resume}
            onTouchStart={heroCarousel.handleTouchStart}
            onTouchMove={heroCarousel.handleTouchMove}
            onTouchEnd={heroCarousel.handleTouchEnd}
            role="region"
            aria-roledescription="carousel"
            aria-label="Images de presentation"
          >
            {/* Background Slider */}
            {heroImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                  index === heroCarousel.current ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `url("${img}")`,
                  filter: 'brightness(0.4)'
                }}
                role="img"
                aria-label={`Image de presentation ${index + 1}`}
                aria-hidden={index !== heroCarousel.current}
              />
            ))}

            <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/60 to-transparent" />

            <div className="relative z-10 max-w-4xl space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider"
              >
                Edition 2026
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight"
              >
                Olympiades d'Intelligence Artificielle du Benin
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/80 text-lg md:text-xl font-normal leading-relaxed max-w-2xl"
              >
                Propulser la prochaine generation de leaders technologiques beninois grace a l'excellence en innovation et IA.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Link
                  to="/programme"
                  className="px-6 py-3 bg-primary text-tech-blue font-bold text-sm md:text-base rounded-lg transition-all hover:shadow-[0_0_20px_rgba(19,236,91,0.4)] hover:-translate-y-1"
                >
                  S'inscrire maintenant
                </Link>
                <Link
                  to="/programme"
                  className="px-6 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold text-sm md:text-base rounded-lg hover:bg-white/20 transition-all"
                >
                  Decouvrir le Programme
                </Link>
              </motion.div>
            </div>

            {/* Prev/Next buttons */}
            <button
              onClick={heroCarousel.prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Image precedente"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={heroCarousel.next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Image suivante"
            >
              <ChevronRight size={20} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 right-8 z-20 flex gap-2" role="tablist" aria-label="Indicateurs de slide">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => heroCarousel.goTo(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === heroCarousel.current ? 'w-8 bg-primary' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  role="tab"
                  aria-selected={idx === heroCarousel.current}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-12">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Users, color: 'text-primary', label: 'Candidats Inscrits', value: '1,500+' },
            { icon: Award, color: 'text-benin-yellow', label: 'Editions Passees', value: '04' },
            { icon: Globe, color: 'text-benin-red', label: 'Participants Internationaux', value: '10+' },
          ].map((stat, i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <div className="flex flex-col gap-3 rounded-xl p-8 bg-white dark:bg-[#112240] border border-[#dbe6df] dark:border-white/5 hover:border-primary/50 dark:hover:border-primary/50 transition-colors shadow-sm">
                <stat.icon className={`${stat.color} w-8 h-8 mb-2`} />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-4xl md:text-5xl font-black text-tech-blue dark:text-white">{stat.value}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Countdown Section */}
      <AnimatedSection>
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-16 bg-tech-blue dark:bg-[#112240] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" aria-hidden="true" />
          <div className="w-full relative z-10 text-center">
            <h2 className="text-2xl md:text-3xl font-black mb-10 text-white">Compte a rebours pour l'edition 2026</h2>
            <div className="flex justify-center gap-4 md:gap-8 max-w-4xl mx-auto" aria-live="polite" aria-label="Compte a rebours">
              {[
                { val: countdown.days, label: 'Jours' },
                { val: countdown.hours, label: 'Heures' },
                { val: countdown.minutes, label: 'Minutes' },
                { val: countdown.seconds, label: 'Secondes' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4 flex-1">
                  <div className="w-full aspect-square flex items-center justify-center rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm max-w-[140px]">
                    <p className="text-3xl md:text-5xl font-black text-primary">{item.val}</p>
                  </div>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 text-white">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Quick Access Section */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-16">
        <div className="w-full">
          <SectionTitle title="Acces Rapide" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { to: '/resultats', icon: BarChart3, iconBg: 'bg-primary/10', iconColor: 'text-primary', hoverBg: 'group-hover:bg-primary group-hover:text-tech-blue', title: 'Resultats', desc: 'Consultez les classements officiels et les performances des editions precedentes.', cta: 'Voir les classements' },
              { to: '/programme', icon: HelpCircle, iconBg: 'bg-benin-yellow/10', iconColor: 'text-benin-yellow', hoverBg: 'group-hover:bg-benin-yellow group-hover:text-tech-blue', title: 'FAQ', desc: "Des questions sur l'inscription, les epreuves ou le calendrier ? Trouvez vos reponses ici.", cta: 'Foire aux questions' },
              { to: '/a-propos', icon: Newspaper, iconBg: 'bg-benin-red/10', iconColor: 'text-benin-red', hoverBg: 'group-hover:bg-benin-red group-hover:text-white', title: 'Actualites', desc: 'Restez informe des dernieres annonces et mises a jour concernant la competition.', cta: 'Lire les articles' },
            ].map((card, i) => (
              <AnimatedCard key={i} delay={i * 0.1}>
                <Link
                  to={card.to}
                  className="group text-left relative overflow-hidden rounded-2xl bg-white dark:bg-[#112240] border border-[#dbe6df] dark:border-white/5 p-8 hover:shadow-lg transition-all hover:-translate-y-1 block h-full"
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center ${card.iconColor} mb-5 ${card.hoverBg} transition-colors`}>
                        <card.icon className="font-bold w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold mb-3 text-[#111813] dark:text-white">{card.title}</h3>
                      <p className="text-sm opacity-70 leading-relaxed text-gray-600 dark:text-gray-300">{card.desc}</p>
                    </div>
                    <div className="mt-6 flex items-center text-primary font-bold text-sm gap-2">
                      {card.cta} <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-16 bg-background-light dark:bg-[#061021]">
        <div className="w-full">
          <div className="flex justify-between items-end mb-10">
            <SectionTitle title="Dernieres Actualites" subtitle="Suivez l'evolution de l'IA au Benin" />
            <button className="text-sm font-bold text-primary hover:underline">Voir tout le blog</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsItems.map((news, i) => (
              <AnimatedCard key={i} delay={i * 0.1}>
                <article className="group flex flex-col bg-white dark:bg-[#112240] rounded-2xl overflow-hidden border border-[#dbe6df] dark:border-white/5 shadow-sm hover:shadow-lg transition-all h-full">
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-tech-blue/20 group-hover:bg-transparent transition-colors z-10" />
                    <OptimizedImage src={news.image} alt={news.title} className="h-full" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className={`text-xs font-bold ${news.color} mb-3`}>{news.category}</span>
                    <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors">{news.title}</h3>
                    <p className="text-sm opacity-70 mb-6 line-clamp-3 text-gray-600 dark:text-gray-300">{news.desc}</p>
                    <div className="mt-auto flex items-center gap-2 text-[10px] font-bold opacity-50 uppercase tracking-widest text-gray-500 dark:text-gray-400">
                      <Calendar size={14} /> {news.date}
                    </div>
                  </div>
                </article>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-20 bg-white dark:bg-[#0a192f] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-tech-blue/5 dark:bg-primary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" aria-hidden="true" />

        <div className="w-full relative z-10">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black mb-4 text-[#111813] dark:text-white">Temoignages de nos Laureats</h2>
            <p className="text-sm opacity-70 italic text-gray-600 dark:text-gray-400">"L'excellence n'est pas un acte, mais une habitude."</p>
          </AnimatedSection>

          <div
            className="relative max-w-4xl mx-auto"
            onMouseEnter={testimonialCarousel.pause}
            onMouseLeave={testimonialCarousel.resume}
            onTouchStart={testimonialCarousel.handleTouchStart}
            onTouchMove={testimonialCarousel.handleTouchMove}
            onTouchEnd={testimonialCarousel.handleTouchEnd}
            role="region"
            aria-roledescription="carousel"
            aria-label="Temoignages"
          >
            <div className="relative bg-white/50 dark:bg-[#112240]/50 backdrop-blur-sm rounded-3xl p-10 md:p-12 border border-[#dbe6df] dark:border-white/10 shadow-xl text-center min-h-[400px] flex flex-col justify-center items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialCarousel.current}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col justify-center items-center p-4"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Temoignage ${testimonialCarousel.current + 1} sur ${testimonials.length}`}
                >
                  <Quote className="text-primary/20 mb-4 w-12 h-12" size={48} aria-hidden="true" />
                  <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-10 text-tech-blue dark:text-gray-100">
                    "{testimonials[testimonialCarousel.current].quote}"
                  </blockquote>
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-20 rounded-full border-4 border-primary/20 overflow-hidden shadow-lg">
                      <OptimizedImage
                        src={testimonials[testimonialCarousel.current].image}
                        alt={testimonials[testimonialCarousel.current].name}
                      />
                    </div>
                    <div>
                      <p className="font-black text-lg text-gray-900 dark:text-white">{testimonials[testimonialCarousel.current].name}</p>
                      <p className="text-sm text-primary font-bold">{testimonials[testimonialCarousel.current].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Prev/Next */}
            <button
              onClick={testimonialCarousel.prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:text-primary transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Temoignage precedent"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={testimonialCarousel.next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:text-primary transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Temoignage suivant"
            >
              <ChevronRight size={20} />
            </button>

            <div className="flex justify-center gap-3 mt-8" role="tablist" aria-label="Indicateurs de temoignage">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => testimonialCarousel.goTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === testimonialCarousel.current ? 'w-8 bg-primary' : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'}`}
                  role="tab"
                  aria-selected={idx === testimonialCarousel.current}
                  aria-label={`Temoignage ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Footer */}
      <AnimatedSection>
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-10 border-t border-[#f0f4f2] dark:border-white/5">
          <div className="w-full flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 text-gray-900 dark:text-white">
            {['MINISTERE DU NUMERIQUE', 'AFRICA IA CENTER', 'BENIN TECH HUB', 'UNICEF', 'REPUBLIQUE DU BENIN'].map(partner => (
              <span key={partner} className="text-lg md:text-xl font-black">{partner}</span>
            ))}
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default Home;
