import React, { useState, useEffect } from 'react';
import { Target, Eye, ShieldCheck, Linkedin, Twitter, Facebook, Instagram, Send, MapPin, Mail, Phone, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTitle } from '../../shared/hooks/usePageTitle';
import { pillars, teamMembers } from '../data/about';
import { listPartners } from '../../services/cmsService';
import type { Partner } from '../../shared/types';
import { AnimatedSection, AnimatedCard } from '../../shared/components/layout/AnimatedSection';
import { OptimizedImage } from '../../shared/components/ui/OptimizedImage';
import { NeuralNetworkPattern, HexagonPattern, DataFlowPattern, ConstellationPattern } from '../../shared/components/patterns/AIPatterns';

const pillarIcons = [Target, Eye, ShieldCheck];

const About: React.FC = () => {
  usePageTitle('A propos');
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Partenariat', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    listPartners('ordering=display_order')
      .then(r => { if (r.data) setPartners((r.data.results ?? []).filter(p => p.is_active)); })
      .catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('sent');
      setFormData({ name: '', email: '', subject: 'Partenariat', message: '' });
      setTimeout(() => setFormStatus('idle'), 4000);
    }, 1500);
  };

  return (
    <div className="w-full bg-background relative">
      {/* Hero Header - Style editorial/storytelling */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/75" />
        </div>
        
        {/* Pattern */}
        <NeuralNetworkPattern className="w-[600px] h-[600px] text-pattern absolute bottom-0 left-0 opacity-45" />
        <HexagonPattern className="w-[300px] h-[300px] text-pattern absolute top-10 right-[45%] opacity-30" />
        {/* Benin flag colors - Plus visibles */}
        <div className="absolute top-[20%] left-[30%] w-[280px] h-[280px] bg-benin-yellow/28 rounded-full blur-[80px]" />
        <div className="absolute bottom-[30%] right-[20%] w-[220px] h-[220px] bg-benin-red/25 rounded-full blur-[70px]" />
        <div className="absolute top-[60%] left-[10%] w-[180px] h-[180px] bg-benin-green/20 rounded-full blur-[60px]" />
        {/* Tricolor line Plus visible */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-benin-green/45" />
          <div className="flex-1 bg-benin-yellow/55" />
          <div className="flex-1 bg-benin-red/45" />
        </div>
        
        <div className="relative z-10 w-full px-6 sm:px-10 md:px-16 lg:px-20 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-xl">
              <AnimatedSection>
                <span className="inline-block px-4 py-1.5 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-full mb-8">
                  Notre Histoire
                </span>
                <h1 className="text-text text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-8">
                  Construire<br />
                  l'avenir de<br />
                  <span className="text-primary">l'IA au Benin</span>
                </h1>
                <p className="text-text-secondary text-xl leading-relaxed mb-10">
                  Depuis 2022, nous formons la prochaine generation de talents en intelligence artificielle. Une mission, un pays, mille possibilites.
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-3">
                    {teamMembers.slice(0, 4).map((m, i) => (
                      <div key={i} className="w-12 h-12 rounded-full border-3 border-background overflow-hidden">
                        <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-text font-bold">+20 benevoles</p>
                    <p className="text-text-muted text-sm">engages dans la mission</p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
        

      </section>

      {/* Pillars - Style magazine avec image de fond */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-20 py-24 overflow-hidden">
        <HexagonPattern className="w-[500px] h-[500px] text-pattern absolute top-0 right-0 opacity-35" />
        <DataFlowPattern className="w-[200px] h-[400px] text-pattern absolute bottom-0 left-10 opacity-25" />
        {/* Benin accents - Plus visibles */}
        <div className="absolute top-[50%] right-[5%] w-[180px] h-[180px] bg-benin-yellow/22 rounded-full blur-[60px]" />
        <div className="absolute bottom-[20%] left-[30%] w-[140px] h-[140px] bg-benin-red/18 rounded-full blur-[50px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            <AnimatedSection>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-4">Nos Fondations</p>
              <h2 className="text-4xl md:text-5xl font-black text-text leading-tight mb-6">
                Trois piliers pour<br />un impact durable
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                L'OAIB n'est pas seulement une competition. C'est un ecosysteme complet qui accompagne les jeunes talents du Benin vers l'excellence en IA.
              </p>
            </AnimatedSection>
            
            <div className="relative h-80 rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75"
                alt="Equipe en reunion"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/20" />
            </div>
          </div>
          
          {/* Pillar cards - horizontal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((item, i) => {
              const Icon = pillarIcons[i];
              const colors = ['border-primary', 'border-accent', 'border-accent-dark'];
              return (
                <AnimatedCard key={i} delay={i * 0.15}>
                  <div className={`relative bg-white rounded-2xl p-8 border-t-4 ${colors[i]} shadow-sm hover:shadow-xl transition-all h-full`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${i === 0 ? 'bg-primary/10 text-primary' : i === 1 ? 'bg-accent/10 text-accent' : 'bg-accent-dark/10 text-accent-dark'}`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-text">{item.title}</h3>
                    <p className="text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team - Layout moderne avec hover effects */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-20 bg-gradient-to-br from-primary via-accent to-blue relative overflow-hidden">
        {/* Binary matrix overlay - digital effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none font-mono text-[10px] text-white leading-relaxed select-none overflow-hidden">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap animate-pulse" style={{ animationDelay: `${i * 0.12}s`, animationDuration: '3.5s' }}>
              {Array.from({ length: 160 }).map(() => Math.random() > 0.5 ? '1' : '0').join(' ')}
            </div>
          ))}
        </div>

        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="about-circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="currentColor" className="text-white" />
                <line x1="50" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.6" className="text-white" />
                <line x1="50" y1="50" x2="50" y2="0" stroke="currentColor" strokeWidth="0.6" className="text-white" />
                <circle cx="0" cy="50" r="1.5" fill="currentColor" className="text-white" />
                <circle cx="50" cy="0" r="1.5" fill="currentColor" className="text-white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-circuit)" />
          </svg>
        </div>

        {/* Background image */}
        <div className="absolute inset-0 opacity-[0.08]">
          <img 
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {/* Patterns */}
        <NeuralNetworkPattern className="w-[400px] h-[400px] text-pattern absolute top-0 right-0 opacity-25" />
        <HexagonPattern className="w-[250px] h-[250px] text-pattern absolute bottom-10 left-10 opacity-20" />
        {/* Benin accents - Plus visibles */}
        <div className="absolute top-[20%] left-[10%] w-[220px] h-[220px] bg-benin-yellow/22 rounded-full blur-[70px]" />
        <div className="absolute bottom-[30%] right-[15%] w-[160px] h-[160px] bg-benin-red/18 rounded-full blur-[60px]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/90 mb-3">L'Equipe</p>
            <h2 className="text-4xl font-black text-white mb-4">Les Visages derriere l'OAIB</h2>
            <p className="text-white/70 max-w-xl mx-auto">Des passionnes d'IA et d'education qui travaillent pour democratiser l'acces aux technologies emergentes.</p>
          </AnimatedSection>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member, i) => (
              <AnimatedCard key={i} delay={i * 0.1}>
                <div className="group relative">
                  {/* Image container avec effet hover */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-5">
                    <OptimizedImage
                      src={member.img}
                      alt={`Photo de ${member.name}, ${member.role}`}
                      className="h-full"
                    />
                    {/* Overlay au hover */}
                    <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/90 transition-all duration-500 flex items-center justify-center">
                      <p className="text-white font-medium text-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
                        {member.desc}
                      </p>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <h4 className="font-bold text-lg text-white group-hover:text-white transition-colors">{member.name}</h4>
                  <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">{member.role}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Partners - Style logos band moderne */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-20 py-24 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 opacity-[0.03]">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <DataFlowPattern className="w-[250px] h-[600px] text-pattern absolute top-0 left-10 opacity-40" />
        <ConstellationPattern className="w-[300px] h-[300px] text-pattern absolute bottom-10 right-10 opacity-25" />
        {/* Benin accents */}
        <div className="absolute top-[40%] right-[5%] w-[120px] h-[120px] bg-benin-yellow/8 rounded-full blur-[50px]" />
        <div className="absolute bottom-[20%] left-[20%] w-[80px] h-[80px] bg-benin-green/6 rounded-full blur-[40px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-3">Ecosystem</p>
            <h2 className="text-4xl font-black text-text mb-4">Ils nous font confiance</h2>
            <p className="text-text-secondary max-w-xl mx-auto">Gouvernement, entreprises tech et organisations internationales s'associent pour propulser l'IA au Benin.</p>
          </AnimatedSection>
          
          {/* Carrousel de logos */}
          <div className="relative overflow-hidden mb-12">
            <div className="flex animate-scroll">
              {/* Premier groupe */}
              {partners.map((p) => (
                <div key={`p1-${p.id}`} className="flex-shrink-0 w-64 mx-4">
                  <div className="group bg-white rounded-2xl p-8 border border-border hover:border-primary/30 hover:shadow-lg transition-all flex flex-col items-center justify-center min-h-[140px]">
                    {p.logo ? (
                      <img src={p.logo} alt={p.name} className="max-h-16 max-w-full object-contain mb-4 group-hover:scale-110 transition-transform" />
                    ) : (
                      <div className="w-20 h-20 bg-background rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-xl font-black text-text-muted">{p.name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="text-sm font-bold text-text-secondary text-center">{p.name}</span>
                  </div>
                </div>
              ))}
              {/* Duplication pour effet infini */}
              {partners.map((p) => (
                <div key={`p2-${p.id}`} className="flex-shrink-0 w-64 mx-4">
                  <div className="group bg-white rounded-2xl p-8 border border-border hover:border-primary/30 hover:shadow-lg transition-all flex flex-col items-center justify-center min-h-[140px]">
                    {p.logo ? (
                      <img src={p.logo} alt={p.name} className="max-h-16 max-w-full object-contain mb-4 group-hover:scale-110 transition-transform" />
                    ) : (
                      <div className="w-20 h-20 bg-background rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-xl font-black text-text-muted">{p.name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="text-sm font-bold text-text-secondary text-center">{p.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA Partenaire */}
          <AnimatedSection className="text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-primary/10 rounded-2xl border border-primary/20">
              <p className="text-text font-bold">Vous souhaitez rejoindre l'aventure ?</p>
              <button className="px-8 py-3 bg-gradient-to-r from-primary via-accent to-blue text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all">
                Devenir Partenaire
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact - Layout split moderne */}
      <section className="relative overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left - Form */}
          <div className="w-full lg:w-1/2 px-6 sm:px-10 md:px-16 lg:px-20 py-20 bg-background-alt">
            <div className="max-w-lg lg:ml-auto lg:mr-12">
              <AnimatedCard>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-3">Contact</p>
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-text">Parlons de votre projet</h2>
                <p className="text-text-secondary mb-8">Partenariat, presse, questions... notre equipe vous repond sous 48h.</p>
                
                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="contact-name" className="text-sm font-bold text-text">Nom</label>
                      <input
                        id="contact-name"
                        name="name"
                        className="rounded-xl border border-border bg-white p-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-text"
                        placeholder="Jean Dupont"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        autoComplete="name"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="contact-email" className="text-sm font-bold text-text">Email</label>
                      <input
                        id="contact-email"
                        name="email"
                        className="rounded-xl border border-border bg-white p-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-text"
                        placeholder="jean@example.com"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-subject" className="text-sm font-bold text-text">Sujet</label>
                    <select
                      id="contact-subject"
                      name="subject"
                      className="rounded-xl border border-border bg-white p-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option>Partenariat</option>
                      <option>Information Generale</option>
                      <option>Presse</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-message" className="text-sm font-bold text-text">Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className="rounded-xl border border-border bg-white p-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-text resize-none"
                      placeholder="Comment pouvons-nous vous aider ?"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className="w-full bg-gradient-to-r from-primary via-accent to-blue text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-base"
                  >
                    <AnimatePresence mode="wait">
                      {formStatus === 'idle' && (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                          Envoyer le message <Send size={18} />
                        </motion.span>
                      )}
                      {formStatus === 'sending' && (
                        <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          Envoi en cours...
                        </motion.span>
                      )}
                      {formStatus === 'sent' && (
                        <motion.span key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                          <CheckCircle size={18} /> Message envoye !
                        </motion.span>
                      )}
                      {formStatus === 'error' && (
                        <motion.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          Erreur, reessayez
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </form>
              </AnimatedCard>
            </div>
          </div>
          
          {/* Right - Contact Info avec image de fond */}
          <div className="w-full lg:w-1/2 relative min-h-[500px]">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/90" />
            {/* Benin tricolor accent */}
            <div className="absolute top-0 right-0 w-1 h-full flex flex-col">
              <div className="flex-1 bg-benin-green/40" />
              <div className="flex-1 bg-benin-yellow/50" />
              <div className="flex-1 bg-benin-red/40" />
            </div>
            <DataFlowPattern className="w-[200px] h-[400px] text-pattern absolute bottom-0 left-10 opacity-25" />
            
            <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-12 py-20">
              <div className="max-w-md">
                <AnimatedCard delay={0.2}>
                  <h3 className="text-3xl font-black mb-10 text-white">Coordonnees</h3>
                  
                  <div className="space-y-8">
                    <div className="flex gap-5">
                      <div className="bg-accent text-white p-3 rounded-xl shrink-0 h-min">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">Siege</p>
                        <p className="text-white/70">Cotonou Digital Hub<br />Avenue Jean-Paul II, Cotonou, Benin</p>
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <div className="bg-accent text-white p-3 rounded-xl shrink-0 h-min">
                        <Mail size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">Email</p>
                        <p className="text-white/70">contact@oia-benin.org</p>
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <div className="bg-accent text-white p-3 rounded-xl shrink-0 h-min">
                        <Phone size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">Telephone</p>
                        <p className="text-white/70">+229 21 00 00 00</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/20">
                    <p className="text-sm font-bold mb-5 uppercase tracking-widest text-white/50">Reseaux sociaux</p>
                    <div className="flex gap-4">
                      {[
                        { icon: Linkedin, label: 'LinkedIn' },
                        { icon: Twitter, label: 'Twitter' },
                        { icon: Facebook, label: 'Facebook' },
                        { icon: Instagram, label: 'Instagram' },
                      ].map(({ icon: Icon, label }) => (
                        <a
                          key={label}
                          href="#"
                          className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition-all text-white"
                          aria-label={label}
                        >
                          <Icon size={20} />
                        </a>
                      ))}
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
