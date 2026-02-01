import React, { useState } from 'react';
import { Target, Eye, ShieldCheck, Linkedin, Twitter, Facebook, Instagram, Send, MapPin, Mail, Phone, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTitle } from '../hooks/usePageTitle';
import { pillars, teamMembers, partners } from '../data/about';
import { AnimatedSection, AnimatedCard } from '../components/AnimatedSection';
import { OptimizedImage } from '../components/OptimizedImage';

const pillarIcons = [Target, Eye, ShieldCheck];

const About: React.FC = () => {
  usePageTitle('A propos');
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Partenariat', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

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
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8">
      {/* Hero Header */}
      <AnimatedSection className="mb-12">
        <div
          className="bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-xl min-h-[320px] shadow-lg relative"
          style={{ backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 60%), url("https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=75")' }}
          role="img"
          aria-label="Equipe collaborant sur des projets technologiques"
        >
          <div className="flex flex-col p-8 md:p-12">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-tight mb-2">A propos & Partenaires</h1>
            <p className="text-white/80 max-w-2xl text-lg font-medium">Autonomiser la prochaine generation de talents en IA a travers le Benin.</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Pillars */}
      <section className="mb-20">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#111813] dark:text-white">Nos Piliers Fondamentaux</h2>
          <p className="text-[#61896f] dark:text-gray-400 max-w-2xl mx-auto">Plus qu'une competition, un mouvement pour batir un ecosysteme tech durable.</p>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((item, i) => {
            const Icon = pillarIcons[i];
            return (
              <AnimatedCard key={i} delay={i * 0.1}>
                <div className="flex flex-col gap-4 rounded-xl border border-[#dbe6df] dark:border-white/5 bg-white dark:bg-[#112240] p-8 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="bg-primary/20 text-primary w-12 h-12 rounded-lg flex items-center justify-center" aria-hidden="true">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#111813] dark:text-white">{item.title}</h3>
                    <p className="text-[#61896f] dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section className="mb-20">
        <AnimatedSection>
          <h2 className="text-3xl font-bold mb-10 text-[#111813] dark:text-white">Equipe Organisatrice</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <div className="group">
                <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-200 dark:bg-gray-700">
                  <OptimizedImage
                    src={member.img}
                    alt={`Photo de ${member.name}, ${member.role}`}
                    className="h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-bold text-lg text-[#111813] dark:text-white">{member.name}</h4>
                <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">{member.role}</p>
                <p className="text-sm text-[#61896f] dark:text-gray-400">{member.desc}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Partners */}
      <AnimatedSection className="mb-20">
        <div className="bg-white dark:bg-[#112240] rounded-2xl p-10 border border-[#dbe6df] dark:border-white/5 shadow-sm">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#111813] dark:text-white">Nos Partenaires Institutionnels</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center mb-12">
            {partners.map((p, i) => (
              <div key={i} className="p-6 bg-[#f6f8f6] dark:bg-[#0a192f] rounded-lg border border-transparent hover:border-primary/30 flex flex-col items-center gap-3 transition-all">
                <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center font-bold text-xs text-center p-2 text-gray-600 dark:text-gray-300">{p}</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-center text-gray-500 dark:text-gray-400">Partenaire</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-[#111813] font-bold rounded-lg hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Devenir Partenaire
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* Contact */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <AnimatedCard>
          <div className="bg-white dark:bg-[#112240] p-8 rounded-2xl border border-[#dbe6df] dark:border-white/5 h-full">
            <h3 className="text-2xl font-bold mb-6 text-[#111813] dark:text-white">Formulaire de Contact</h3>
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom Complet</label>
                  <input
                    id="contact-name"
                    className="rounded-lg border border-[#dbe6df] dark:border-white/10 bg-[#f6f8f6] dark:bg-[#0a192f] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                    placeholder="Jean Dupont"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    id="contact-email"
                    className="rounded-lg border border-[#dbe6df] dark:border-white/10 bg-[#f6f8f6] dark:bg-[#0a192f] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                    placeholder="jean@example.com"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">Sujet</label>
                <select
                  id="contact-subject"
                  className="rounded-lg border border-[#dbe6df] dark:border-white/10 bg-[#f6f8f6] dark:bg-[#0a192f] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option>Partenariat</option>
                  <option>Information Generale</option>
                  <option>Presse</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-message" className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <textarea
                  id="contact-message"
                  className="rounded-lg border border-[#dbe6df] dark:border-white/10 bg-[#f6f8f6] dark:bg-[#0a192f] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                  placeholder="Comment pouvons-nous vous aider ?"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full bg-primary text-[#111813] font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <AnimatePresence mode="wait">
                  {formStatus === 'idle' && (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      Envoyer <Send size={16} />
                    </motion.span>
                  )}
                  {formStatus === 'sending' && (
                    <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Envoi en cours...
                    </motion.span>
                  )}
                  {formStatus === 'sent' && (
                    <motion.span key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <CheckCircle size={16} /> Message envoye !
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
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-[#111813] dark:text-white">Nous Contacter</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-primary/20 text-primary p-2 rounded-lg shrink-0 h-min" aria-hidden="true"><MapPin size={20} /></div>
                  <div><p className="font-bold text-gray-900 dark:text-white">Siege</p><p className="text-[#61896f] dark:text-gray-400 text-sm">Cotonou Digital Hub, Avenue Jean-Paul II, Cotonou, Benin</p></div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/20 text-primary p-2 rounded-lg shrink-0 h-min" aria-hidden="true"><Mail size={20} /></div>
                  <div><p className="font-bold text-gray-900 dark:text-white">Email</p><p className="text-[#61896f] dark:text-gray-400 text-sm">contact@oia-benin.org</p></div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/20 text-primary p-2 rounded-lg shrink-0 h-min" aria-hidden="true"><Phone size={20} /></div>
                  <div><p className="font-bold text-gray-900 dark:text-white">Telephone</p><p className="text-[#61896f] dark:text-gray-400 text-sm">+229 21 00 00 00</p></div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-bold mb-4 uppercase tracking-widest text-[#61896f] dark:text-gray-400">Suivez-nous</p>
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
                    className="w-10 h-10 rounded-full bg-white dark:bg-[#112240] border border-[#dbe6df] dark:border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </AnimatedCard>
      </section>
    </div>
  );
};

export default About;
