import { Leaf, Cpu, HeartPulse } from 'lucide-react';

export const chartData = [
  { year: '2021', score: 65, participation: 120 },
  { year: '2022', score: 75, participation: 450 },
  { year: '2023', score: 85, participation: 980 },
  { year: '2024', score: 98, participation: 1500 },
];

export const regionData = [
  { name: "Littoral (Cotonou)", count: 680, width: "90%" },
  { name: "Atlantique (Abomey-Calavi)", count: 450, width: "65%" },
  { name: "Borgou (Parakou)", count: 210, width: "35%" },
  { name: "Oueme (Porto-Novo)", count: 160, width: "25%" },
];

export const innovations = [
  {
    title: "AgriScan Drone",
    category: "Agriculture",
    icon: Leaf,
    desc: "Systeme autonome de surveillance des cultures utilisant la vision par ordinateur pour detecter les maladies des plantes avant propagation.",
    impact: "+40% Rendement",
    tech: ["YOLOv8", "Jetson Nano", "Python"],
    image: "https://images.unsplash.com/photo-1574621100236-d25a64a1ad3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75"
  },
  {
    title: "EcoVision Waste",
    category: "Smart City",
    icon: Cpu,
    desc: "Poubelle intelligente capable de trier automatiquement les dechets recyclables grace a un reseau de neurones convolutifs optimise.",
    impact: "-2 Tonnes CO2",
    tech: ["TensorFlow Lite", "IoT", "C++"],
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75"
  },
  {
    title: "Yoruba-Health Bot",
    category: "Sante",
    icon: HeartPulse,
    desc: "Assistant vocal permettant aux populations rurales d'acceder a des conseils medicaux de premier secours en langues locales.",
    impact: "50k Utilisateurs",
    tech: ["NLP", "Twilio API", "React"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75"
  }
];

export const galleryImages = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75"
];

export const documents = [
  { title: "Annonce Resultats Officiels 2024", date: "24 Aout 2024", size: "1.2 MB", type: "pdf" as const },
  { title: "Livre Blanc Pedagogie & IA", date: "12 Juin 2024", size: "4.5 MB", type: "pdf" as const },
  { title: "Briefing Presse Ministeriel", date: "05 Mars 2024", size: "0.8 MB", type: "pdf" as const },
  { title: "Highlights Video: Ceremonie 2023", date: "30 Juil 2023", size: "45 MB", type: "video" as const },
];
