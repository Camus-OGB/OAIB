import { UserPlus, BookOpen, Terminal, MapPin, Trophy, Users, CheckCircle, Code } from 'lucide-react';

export const phases = [
  { icon: UserPlus, phase: "Phase 01", title: "Inscription", desc: "Candidature en ligne. Ouvert a tous les etudiants de 14-22 ans inscrits au Benin.", date: "15 Jan - 28 Fev 2026" },
  { icon: BookOpen, phase: "Phase 02", title: "Formation Fondamentale", desc: "Acces aux supports de cours, webinaires et modules de logique IA.", date: "01 Mar - 31 Mar 2026" },
  { icon: Terminal, phase: "Phase 03", title: "Tours Preliminaires", desc: "Examen national de logique et code en ligne. Top 20% qualifie.", date: "05 Avr - 12 Avr 2026" },
  { icon: MapPin, phase: "Phase 04", title: "Qualificatifs Regionaux", desc: "Evenements physiques a Cotonou, Porto-Novo, Parakou, et Bohicon.", date: "26 Avr - 10 Mai 2026" },
  { icon: Trophy, phase: "Phase 05", title: "Finale Nationale", desc: "Hackathon de 24h a Cotonou et presentation devant jury international.", date: "15 Juin - 16 Juin 2026" },
  { icon: Users, phase: "Phase 06", title: "Mentorat & Prix", desc: "Incubation des meilleurs projets et bourses universitaires.", date: "Juillet - Decembre 2026" }
];

export const criteria = [
  { icon: CheckCircle, title: "Age & Statut", desc: "Etudiants entre 14-22 ans. Carte d'etudiant valide requise." },
  { icon: Terminal, title: "Raisonnement Logique", desc: "Haute competence en logique mathematique et resolution de problemes." },
  { icon: Code, title: "Competences Tech", desc: "Bases de Python ou pensee algorithmique. Pas d'IA avancee requise au depart." },
  { icon: Users, title: "Travail d'Equipe", desc: "Capacite a collaborer efficacement lors des phases regionales et finales." }
];

export const faqItems = [
  { q: "Qui peut participer a l'edition 2026 ?", a: "La competition est ouverte a tous les etudiants residant au Benin, ages de 14 a 22 ans (Lycee et Licence 1-2)." },
  { q: "Dois-je savoir coder pour m'inscrire ?", a: "Aucune experience avancee n'est requise. Nous fournissons les formations necessaires." },
  { q: "Quels sont les prix pour les gagnants ?", a: "Stages internationaux, bourses d'etudes, ordinateurs et financement de projets." },
  { q: "L'inscription est-elle payante ?", a: "Non, l'inscription aux Olympiades d'IA du Benin est 100% gratuite." }
];
