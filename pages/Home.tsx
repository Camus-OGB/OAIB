import React, { useState, useEffect } from 'react';
import { Users, Award, Globe, ArrowRight, Calendar, BarChart3, HelpCircle, Newspaper, Quote } from 'lucide-react';
import { Page } from '../types';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
  ];

  const testimonials = [
    {
      quote: "Participer aux Olympiades a totalement changé ma vision de la technologie. Aujourd'hui, grâce à la bourse obtenue, je poursuis mes études en IA à l'international et je développe une solution pour l'agriculture béninoise.",
      name: "Amina TOURE",
      role: "Gagnante Édition 2022 - Data Scientist",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
       quote: "Une opportunité unique de se mesurer aux meilleurs talents du pays. L'accompagnement des mentors durant le hackathon a été déterminant pour la réussite de notre projet de santé connectée.",
       name: "Jean-Marc KOSSOU",
       role: "Finaliste 2023 - Ingénieur Logiciel",
       image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
       quote: "Je n'avais jamais codé d'IA avant de m'inscrire. Les bootcamps de préparation sont d'une qualité exceptionnelle et m'ont donné toutes les clés pour réussir.",
       name: "Sarah BIAOU",
       role: "Prix Espoir Féminin 2024",
       image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div class="w-full">
      {/* Hero Section */}
      <section class="relative px-4 sm:px-6 md:px-8 lg:px-12 py-8">
        <div class="w-full">
          <div class="relative min-h-[500px] md:min-h-[600px] flex flex-col items-start justify-end p-8 md:p-12 lg:p-16 overflow-hidden rounded-2xl bg-tech-blue group shadow-xl">
            
            {/* Dynamic Background Slider */}
            {heroImages.map((img, index) => (
              <div 
                key={index}
                class={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  backgroundImage: `url("${img}")`,
                  filter: 'brightness(0.4)'
                }}
              ></div>
            ))}

            <div 
              class="absolute inset-0 z-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/60 to-transparent"
            ></div>

            <div class="relative z-10 max-w-4xl space-y-5">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
                Édition 2026
              </div>
              <h1 class="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                Olympiades d’Intelligence Artificielle du Bénin
              </h1>
              <p class="text-white/80 text-lg md:text-xl font-normal leading-relaxed max-w-2xl">
                Propulser la prochaine génération de leaders technologiques béninois grâce à l'excellence en innovation et IA.
              </p>
              <div class="flex flex-wrap gap-4 pt-4">
                <button 
                    onClick={() => onNavigate(Page.PROGRAM)}
                    class="px-6 py-3 bg-primary text-tech-blue font-bold text-sm md:text-base rounded-lg transition-all hover:shadow-[0_0_20px_rgba(19,236,91,0.4)] hover:-translate-y-1"
                >
                  S'inscrire maintenant
                </button>
                <button 
                    onClick={() => onNavigate(Page.PROGRAM)}
                    class="px-6 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold text-sm md:text-base rounded-lg hover:bg-white/20 transition-all"
                >
                  Découvrir le Programme
                </button>
              </div>
            </div>

            {/* Slider Indicators */}
            <div class="absolute bottom-8 right-8 z-20 flex gap-2">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  class={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section class="px-4 sm:px-6 md:px-8 lg:px-12 py-12">
        <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex flex-col gap-3 rounded-xl p-8 bg-white dark:bg-[#112240] border border-[#dbe6df] dark:border-white/5 hover:border-primary/50 dark:hover:border-primary/50 transition-colors shadow-sm">
            <Users className="text-primary w-8 h-8 mb-2" />
            <p class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Candidats Inscrits</p>
            <p class="text-4xl md:text-5xl font-black text-tech-blue dark:text-white">1,500+</p>
          </div>
          <div class="flex flex-col gap-3 rounded-xl p-8 bg-white dark:bg-[#112240] border border-[#dbe6df] dark:border-white/5 hover:border-primary/50 dark:hover:border-primary/50 transition-colors shadow-sm">
            <Award className="text-benin-yellow w-8 h-8 mb-2" />
            <p class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Éditions Passées</p>
            <p class="text-4xl md:text-5xl font-black text-tech-blue dark:text-white">04</p>
          </div>
          <div class="flex flex-col gap-3 rounded-xl p-8 bg-white dark:bg-[#112240] border border-[#dbe6df] dark:border-white/5 hover:border-primary/50 dark:hover:border-primary/50 transition-colors shadow-sm">
            <Globe className="text-benin-red w-8 h-8 mb-2" />
            <p class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Participants Internationaux</p>
            <p class="text-4xl md:text-5xl font-black text-tech-blue dark:text-white">10+</p>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section class="px-4 sm:px-6 md:px-8 lg:px-12 py-16 bg-tech-blue dark:bg-[#112240] text-white overflow-hidden relative">
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div class="w-full relative z-10 text-center">
          <h2 class="text-2xl md:text-3xl font-black mb-10 text-white">Compte à rebours pour l'édition 2026</h2>
          <div class="flex justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
            {[
                { val: '365', label: 'Jours' }, 
                { val: '12', label: 'Heures' }, 
                { val: '45', label: 'Minutes' }, 
                { val: '00', label: 'Secondes' }
            ].map((item, idx) => (
                <div key={idx} class="flex flex-col items-center gap-4 flex-1">
                <div class="w-full aspect-square flex items-center justify-center rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm max-w-[140px]">
                    <p class="text-3xl md:text-5xl font-black text-primary">{item.val}</p>
                </div>
                <p class="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 text-white">{item.label}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section class="px-4 sm:px-6 md:px-8 lg:px-12 py-16">
        <div class="w-full">
          <h2 class="text-3xl font-black mb-8 text-[#111813] dark:text-white">Accès Rapide</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
                onClick={() => onNavigate(Page.RESULTS)}
                class="group text-left relative overflow-hidden rounded-2xl bg-white dark:bg-[#112240] border border-[#dbe6df] dark:border-white/5 p-8 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div class="flex flex-col h-full justify-between">
                <div>
                  <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-tech-blue transition-colors">
                    <BarChart3 className="font-bold w-5 h-5" />
                  </div>
                  <h3 class="text-lg font-bold mb-3 text-[#111813] dark:text-white">Résultats</h3>
                  <p class="text-sm opacity-70 leading-relaxed text-gray-600 dark:text-gray-300">Consultez les classements officiels et les performances des éditions précédentes.</p>
                </div>
                <div class="mt-6 flex items-center text-primary font-bold text-sm gap-2">
                   Voir les classements <ArrowRight size={16} />
                </div>
              </div>
            </button>
            <button 
                onClick={() => onNavigate(Page.PROGRAM)}
                class="group text-left relative overflow-hidden rounded-2xl bg-white dark:bg-[#112240] border border-[#dbe6df] dark:border-white/5 p-8 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div class="flex flex-col h-full justify-between">
                <div>
                  <div class="w-10 h-10 rounded-lg bg-benin-yellow/10 flex items-center justify-center text-benin-yellow mb-5 group-hover:bg-benin-yellow group-hover:text-tech-blue transition-colors">
                    <HelpCircle className="font-bold w-5 h-5" />
                  </div>
                  <h3 class="text-lg font-bold mb-3 text-[#111813] dark:text-white">FAQ</h3>
                  <p class="text-sm opacity-70 leading-relaxed text-gray-600 dark:text-gray-300">Des questions sur l'inscription, les épreuves ou le calendrier ? Trouvez vos réponses ici.</p>
                </div>
                <div class="mt-6 flex items-center text-primary font-bold text-sm gap-2">
                   Foire aux questions <ArrowRight size={16} />
                </div>
              </div>
            </button>
            <button 
                onClick={() => onNavigate(Page.HOME)}
                class="group text-left relative overflow-hidden rounded-2xl bg-white dark:bg-[#112240] border border-[#dbe6df] dark:border-white/5 p-8 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div class="flex flex-col h-full justify-between">
                <div>
                  <div class="w-10 h-10 rounded-lg bg-benin-red/10 flex items-center justify-center text-benin-red mb-5 group-hover:bg-benin-red group-hover:text-white transition-colors">
                    <Newspaper className="font-bold w-5 h-5" />
                  </div>
                  <h3 class="text-lg font-bold mb-3 text-[#111813] dark:text-white">Actualités</h3>
                  <p class="text-sm opacity-70 leading-relaxed text-gray-600 dark:text-gray-300">Restez informé des dernières annonces et mises à jour concernant la compétition.</p>
                </div>
                <div class="mt-6 flex items-center text-primary font-bold text-sm gap-2">
                   Lire les articles <ArrowRight size={16} />
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section class="px-4 sm:px-6 md:px-8 lg:px-12 py-16 bg-background-light dark:bg-[#061021]">
        <div class="w-full">
          <div class="flex justify-between items-end mb-10">
            <div>
              <h2 class="text-3xl font-black mb-2 text-[#111813] dark:text-white">Dernières Actualités</h2>
              <p class="text-sm opacity-60 text-gray-600 dark:text-gray-300">Suivez l'évolution de l'IA au Bénin</p>
            </div>
            <button class="text-sm font-bold text-primary hover:underline">Voir tout le blog</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                category: "ÉVÉNEMENT", color: "text-primary",
                title: "Retour sur la grande finale de l'édition 2024",
                desc: "Découvrez les projets innovants qui ont marqué le jury lors de la clôture exceptionnelle à Cotonou.",
                date: "15 Oct 2024",
                image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
              },
              {
                category: "FORMATION", color: "text-benin-yellow",
                title: "Lancement des Bootcamps IA en ligne",
                desc: "Une série de formations intensives pour préparer les candidats aux défis techniques de demain.",
                date: "02 Nov 2024",
                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
              },
              {
                category: "PARTENARIAT", color: "text-benin-red",
                title: "Nouveau partenariat stratégique avec Google AI Africa",
                desc: "Une collaboration majeure pour offrir des bourses et des ressources de pointe à nos lauréats.",
                date: "20 Dec 2024",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
              }
            ].map((news, i) => (
              <div key={i} class="group flex flex-col bg-white dark:bg-[#112240] rounded-2xl overflow-hidden border border-[#dbe6df] dark:border-white/5 shadow-sm hover:shadow-lg transition-all">
                <div class="h-48 overflow-hidden relative">
                    <div class="absolute inset-0 bg-tech-blue/20 group-hover:bg-transparent transition-colors z-10"></div>
                    <img src={news.image} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={news.title} />
                </div>
                <div class="p-6 flex flex-col flex-1">
                    <span class={`text-xs font-bold ${news.color} mb-3`}>{news.category}</span>
                    <h3 class="text-lg font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors">{news.title}</h3>
                    <p class="text-sm opacity-70 mb-6 line-clamp-3 text-gray-600 dark:text-gray-300">{news.desc}</p>
                    <div class="mt-auto flex items-center gap-2 text-[10px] font-bold opacity-50 uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        <Calendar size={14} className="w-3.5 h-3.5" /> {news.date}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section class="px-4 sm:px-6 md:px-8 lg:px-12 py-20 bg-white dark:bg-[#0a192f] relative overflow-hidden">
        {/* Background decoration */}
        <div class="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-tech-blue/5 dark:bg-primary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div class="w-full relative z-10">
          <div class="text-center max-w-2xl mx-auto mb-16">
            <h2 class="text-3xl font-black mb-4 text-[#111813] dark:text-white">Témoignages de nos Lauréats</h2>
            <p class="text-sm opacity-70 italic text-gray-600 dark:text-gray-400">"L'excellence n'est pas un acte, mais une habitude."</p>
          </div>
          <div class="relative max-w-4xl mx-auto">
             <div class="relative bg-white/50 dark:bg-[#112240]/50 backdrop-blur-sm rounded-3xl p-10 md:p-12 border border-[#dbe6df] dark:border-white/10 shadow-xl text-center min-h-[400px] flex flex-col justify-center items-center transition-all duration-500">
                {testimonials.map((item, index) => (
                    <div 
                        key={index}
                        class={`absolute inset-0 flex flex-col justify-center items-center p-10 md:p-12 transition-opacity duration-700 ease-in-out ${index === currentTestimonial ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <Quote className="text-primary/20 absolute top-8 left-8 transform -scale-x-100 w-16 h-16" size={64} />
                         <p class="text-xl md:text-2xl font-medium leading-relaxed mb-10 text-tech-blue dark:text-gray-100 relative z-10">
                            "{item.quote}"
                        </p>
                        <div class="flex flex-col items-center gap-4">
                            <div class="size-20 rounded-full border-4 border-primary/20 overflow-hidden shadow-lg">
                                <img src={item.image} alt={item.name} class="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p class="font-black text-lg text-gray-900 dark:text-white">{item.name}</p>
                                <p class="text-sm text-primary font-bold">{item.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div class="flex justify-center gap-3 mt-8">
                {testimonials.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentTestimonial(idx)}
                        class={`h-2 rounded-full transition-all duration-300 ${idx === currentTestimonial ? 'w-8 bg-primary' : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'}`}
                        aria-label={`Voir témoignage ${idx + 1}`}
                    />
                ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Partners Footer */}
       <section class="px-4 sm:px-6 md:px-8 lg:px-12 py-10 border-t border-[#f0f4f2] dark:border-white/5">
        <div class="w-full flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 text-gray-900 dark:text-white">
            <span class="text-lg md:text-xl font-black">MINISTÈRE DU NUMÉRIQUE</span>
            <span class="text-lg md:text-xl font-black">AFRICA IA CENTER</span>
            <span class="text-lg md:text-xl font-black">BENIN TECH HUB</span>
            <span class="text-lg md:text-xl font-black">UNICEF</span>
            <span class="text-lg md:text-xl font-black">REPUBLIQUE DU BENIN</span>
        </div>
      </section>
    </div>
  );
};

export default Home;