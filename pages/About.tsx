import React from 'react';
import { Target, Eye, ShieldCheck, Linkedin, Twitter, Facebook, Instagram, Send, MapPin, Mail, Phone } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div class="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8">
      {/* Hero Header */}
      <div class="mb-12">
        <div class="bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-xl min-h-[320px] shadow-lg relative" style={{ backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 60%), url("https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80")' }}>
            <div class="flex flex-col p-8 md:p-12">
                <h1 class="text-white text-4xl md:text-5xl font-extrabold leading-tight mb-2">À propos & Partenaires</h1>
                <p class="text-white/80 max-w-2xl text-lg font-medium">Autonomiser la prochaine génération de talents en IA à travers le Bénin.</p>
            </div>
        </div>
      </div>

      {/* Pillars */}
      <section class="mb-20">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4 text-[#111813] dark:text-white">Nos Piliers Fondamentaux</h2>
            <p class="text-[#61896f] dark:text-gray-400 max-w-2xl mx-auto">Plus qu'une compétition, un mouvement pour bâtir un écosystème tech durable.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { icon: Target, title: "Notre Mission", desc: "Démocratiser le savoir en IA dans tous les établissements secondaires et universitaires du Bénin." },
                { icon: Eye, title: "Notre Vision", desc: "Faire du Bénin le hub ouest-africain d'excellence en intelligence artificielle d'ici 2030." },
                { icon: ShieldCheck, title: "Nos Valeurs", desc: "Excellence académique, innovation de rupture et intégrité absolue dans chaque initiative." }
            ].map((item, i) => (
                <div key={i} class="flex flex-col gap-4 rounded-xl border border-[#dbe6df] dark:border-white/5 bg-white dark:bg-[#112240] p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div class="bg-primary/20 text-primary w-12 h-12 rounded-lg flex items-center justify-center">
                        <item.icon size={28} />
                    </div>
                    <div>
                        <h3 class="text-xl font-bold mb-2 text-[#111813] dark:text-white">{item.title}</h3>
                        <p class="text-[#61896f] dark:text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Team */}
      <section class="mb-20">
        <h2 class="text-3xl font-bold mb-10 text-[#111813] dark:text-white">Équipe Organisatrice</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { name: "Dr. Koffi Mensah", role: "Academic Lead", desc: "Expert ML, 15 ans de recherche.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                { name: "Amina Dossou", role: "Program Manager", desc: "Spécialiste logistique éducation.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                { name: "Gildas Houngbo", role: "Technical Director", desc: "Architecte Full-stack & Infra IA.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                { name: "Elise Biaou", role: "Partnership Manager", desc: "Lien talents locaux et institutions.", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
            ].map((member, i) => (
                <div key={i} class="group">
                    <div class="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-200 dark:bg-gray-700">
                        <img src={member.img} alt={member.name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <h4 class="font-bold text-lg text-[#111813] dark:text-white">{member.name}</h4>
                    <p class="text-primary text-sm font-semibold uppercase tracking-wider mb-2">{member.role}</p>
                    <p class="text-sm text-[#61896f] dark:text-gray-400">{member.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Partners List */}
      <section class="mb-20">
        <div class="bg-white dark:bg-[#112240] rounded-2xl p-10 border border-[#dbe6df] dark:border-white/5 shadow-sm">
            <h2 class="text-3xl font-bold mb-8 text-center text-[#111813] dark:text-white">Nos Partenaires Institutionnels</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 items-center mb-12">
                {["MINISTRY OF TECH", "UNESCO BENIN", "TECH CORP AI", "UAC BENIN"].map((p, i) => (
                    <div key={i} class="p-6 bg-[#f6f8f6] dark:bg-[#0a192f] rounded-lg border border-transparent hover:border-primary/30 flex flex-col items-center gap-3 transition-all">
                        <div class="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center font-bold text-xs text-center p-2 text-gray-600 dark:text-gray-300">{p}</div>
                        <span class="text-[10px] font-bold uppercase tracking-widest text-center text-gray-500 dark:text-gray-400">Partenaire</span>
                    </div>
                ))}
            </div>
            <div class="text-center">
                <button class="inline-flex items-center gap-2 px-8 py-3 bg-primary text-[#111813] font-bold rounded-lg hover:bg-opacity-90 transition-all">
                    Devenir Partenaire
                </button>
            </div>
        </div>
      </section>

      {/* Contact */}
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <div class="bg-white dark:bg-[#112240] p-8 rounded-2xl border border-[#dbe6df] dark:border-white/5">
            <h3 class="text-2xl font-bold mb-6 text-[#111813] dark:text-white">Formulaire de Contact</h3>
            <form class="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Nom Complet</label>
                        <input class="rounded-lg border-[#dbe6df] dark:border-white/10 bg-[#f6f8f6] dark:bg-[#0a192f] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white" placeholder="Jean Dupont" type="text" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input class="rounded-lg border-[#dbe6df] dark:border-white/10 bg-[#f6f8f6] dark:bg-[#0a192f] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white" placeholder="jean@example.com" type="email" />
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Sujet</label>
                    <select class="rounded-lg border-[#dbe6df] dark:border-white/10 bg-[#f6f8f6] dark:bg-[#0a192f] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white">
                        <option>Partenariat</option>
                        <option>Information Générale</option>
                        <option>Presse</option>
                    </select>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                    <textarea class="rounded-lg border-[#dbe6df] dark:border-white/10 bg-[#f6f8f6] dark:bg-[#0a192f] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white" placeholder="Comment pouvons-nous vous aider ?" rows={4}></textarea>
                </div>
                <button class="w-full bg-primary text-[#111813] font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    Envoyer <Send size={16} />
                </button>
            </form>
        </div>

        <div class="flex flex-col justify-between">
            <div>
                <h3 class="text-2xl font-bold mb-6 text-[#111813] dark:text-white">Nous Contacter</h3>
                <div class="space-y-6">
                    <div class="flex gap-4">
                        <div class="bg-primary/20 text-primary p-2 rounded-lg shrink-0 h-min"><MapPin size={20} /></div>
                        <div><p class="font-bold text-gray-900 dark:text-white">Siège</p><p class="text-[#61896f] dark:text-gray-400 text-sm">Cotonou Digital Hub, Avenue Jean-Paul II, Cotonou, Bénin</p></div>
                    </div>
                    <div class="flex gap-4">
                        <div class="bg-primary/20 text-primary p-2 rounded-lg shrink-0 h-min"><Mail size={20} /></div>
                        <div><p class="font-bold text-gray-900 dark:text-white">Email</p><p class="text-[#61896f] dark:text-gray-400 text-sm">contact@oia-benin.org</p></div>
                    </div>
                    <div class="flex gap-4">
                        <div class="bg-primary/20 text-primary p-2 rounded-lg shrink-0 h-min"><Phone size={20} /></div>
                        <div><p class="font-bold text-gray-900 dark:text-white">Téléphone</p><p class="text-[#61896f] dark:text-gray-400 text-sm">+229 21 00 00 00</p></div>
                    </div>
                </div>
            </div>
            
            <div class="mt-8">
                <p class="text-sm font-bold mb-4 uppercase tracking-widest text-[#61896f] dark:text-gray-400">Suivez-nous</p>
                <div class="flex gap-4">
                    {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
                        <a key={i} href="#" class="w-10 h-10 rounded-full bg-white dark:bg-[#112240] border border-[#dbe6df] dark:border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors text-gray-600 dark:text-gray-300">
                            <Icon size={18} />
                        </a>
                    ))}
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default About;