/**
 * Mock Data Service
 * Provides mock data for the frontend without a real backend
 */

// ============ CANDIDATES DATA ============
export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  school: string;
  level: string;
  region: string;
  status: 'pending' | 'validated' | 'rejected';
  registeredAt: string;
  score?: number;
}

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    firstName: 'Amina',
    lastName: 'Touré',
    email: 'amina.toure@email.com',
    phone: '+229 97 00 00 01',
    birthDate: '2008-05-15',
    school: 'Lycée Béhanzin',
    level: 'Terminale C',
    region: 'Littoral',
    status: 'validated',
    registeredAt: '2026-01-15T10:30:00Z',
    score: 85,
  },
  {
    id: '2',
    firstName: 'Koffi',
    lastName: 'Mensah',
    email: 'koffi.mensah@email.com',
    phone: '+229 97 00 00 02',
    birthDate: '2009-03-22',
    school: 'Collège Père Aupiais',
    level: 'Première D',
    region: 'Atlantique',
    status: 'validated',
    registeredAt: '2026-01-16T14:20:00Z',
    score: 92,
  },
  {
    id: '3',
    firstName: 'Élise',
    lastName: 'Biaou',
    email: 'elise.biaou@email.com',
    phone: '+229 97 00 00 03',
    birthDate: '2007-11-08',
    school: 'Lycée Toffa 1er',
    level: 'Terminale D',
    region: 'Ouémé',
    status: 'pending',
    registeredAt: '2026-01-17T09:15:00Z',
  },
  {
    id: '4',
    firstName: 'Gildas',
    lastName: 'Houngbo',
    email: 'gildas.houngbo@email.com',
    phone: '+229 97 00 00 04',
    birthDate: '2008-08-30',
    school: 'Lycée Mathieu Bouké',
    level: 'Première C',
    region: 'Borgou',
    status: 'validated',
    registeredAt: '2026-01-18T16:45:00Z',
    score: 78,
  },
  {
    id: '5',
    firstName: 'Sarah',
    lastName: 'Dossou',
    email: 'sarah.dossou@email.com',
    phone: '+229 97 00 00 05',
    birthDate: '2009-01-12',
    school: 'CEG Le Nokoué',
    level: 'Seconde C',
    region: 'Littoral',
    status: 'rejected',
    registeredAt: '2026-01-19T11:00:00Z',
  },
];

// ============ EXAMS DATA ============
export interface Exam {
  id: string;
  title: string;
  description: string;
  phase: number;
  duration: number; // in minutes
  questionsCount: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
}

export const mockExams: Exam[] = [
  {
    id: '1',
    title: 'QCM Logique & Algorithmique',
    description: 'Évaluation des compétences en raisonnement logique et bases algorithmiques',
    phase: 1,
    duration: 60,
    questionsCount: 40,
    startDate: '2026-02-15T08:00:00Z',
    endDate: '2026-02-15T18:00:00Z',
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Épreuve de Programmation Python',
    description: 'Test pratique de programmation Python avec exercices variés',
    phase: 2,
    duration: 90,
    questionsCount: 15,
    startDate: '2026-03-10T08:00:00Z',
    endDate: '2026-03-10T18:00:00Z',
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'Challenge IA - Vision par Ordinateur',
    description: 'Projet pratique d\'analyse d\'images avec des modèles de deep learning',
    phase: 3,
    duration: 180,
    questionsCount: 5,
    startDate: '2026-04-20T08:00:00Z',
    endDate: '2026-04-20T18:00:00Z',
    status: 'upcoming',
  },
];

// ============ QUESTIONS DATA ============
export interface Question {
  id: string;
  examId: string;
  type: 'mcq' | 'code' | 'open';
  text: string;
  options?: string[];
  correctAnswer?: number;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const mockQuestions: Question[] = [
  {
    id: '1',
    examId: '1',
    type: 'mcq',
    text: 'Quelle est la complexité temporelle de la recherche binaire ?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 1,
    points: 2,
    difficulty: 'medium',
  },
  {
    id: '2',
    examId: '1',
    type: 'mcq',
    text: 'Quel algorithme est utilisé pour trouver le plus court chemin dans un graphe ?',
    options: ['Tri à bulles', 'Dijkstra', 'Recherche linéaire', 'Quicksort'],
    correctAnswer: 1,
    points: 2,
    difficulty: 'medium',
  },
  {
    id: '3',
    examId: '1',
    type: 'mcq',
    text: 'En Python, quelle fonction permet de créer une liste à partir d\'un itérable ?',
    options: ['array()', 'list()', 'tuple()', 'set()'],
    correctAnswer: 1,
    points: 1,
    difficulty: 'easy',
  },
];

// ============ STATISTICS DATA ============
export interface Statistics {
  totalCandidates: number;
  validatedCandidates: number;
  pendingCandidates: number;
  rejectedCandidates: number;
  totalExams: number;
  averageScore: number;
  regionDistribution: { region: string; count: number }[];
  registrationTrend: { date: string; count: number }[];
}

export const mockStatistics: Statistics = {
  totalCandidates: 1847,
  validatedCandidates: 1523,
  pendingCandidates: 245,
  rejectedCandidates: 79,
  totalExams: 3,
  averageScore: 72.5,
  regionDistribution: [
    { region: 'Littoral', count: 680 },
    { region: 'Atlantique', count: 450 },
    { region: 'Borgou', count: 210 },
    { region: 'Ouémé', count: 160 },
    { region: 'Zou', count: 120 },
    { region: 'Mono', count: 95 },
    { region: 'Alibori', count: 72 },
    { region: 'Donga', count: 60 },
  ],
  registrationTrend: [
    { date: '2026-01-01', count: 120 },
    { date: '2026-01-08', count: 340 },
    { date: '2026-01-15', count: 580 },
    { date: '2026-01-22', count: 890 },
    { date: '2026-01-29', count: 1250 },
    { date: '2026-02-05', count: 1847 },
  ],
};

// ============ RESOURCES DATA ============
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'link';
  url: string;
  category: string;
  createdAt: string;
}

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Introduction à Python',
    description: 'Guide complet pour débuter avec Python',
    type: 'pdf',
    url: '#',
    category: 'Programmation',
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: '2',
    title: 'Les bases de l\'IA',
    description: 'Comprendre les fondamentaux de l\'intelligence artificielle',
    type: 'video',
    url: '#',
    category: 'IA',
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: '3',
    title: 'Algorithmes de tri',
    description: 'Explication détaillée des algorithmes de tri classiques',
    type: 'pdf',
    url: '#',
    category: 'Algorithmique',
    createdAt: '2026-01-15T00:00:00Z',
  },
];

// ============ RESULTS DATA ============
export interface Result {
  id: string;
  candidateId: string;
  examId: string;
  score: number;
  maxScore: number;
  percentage: number;
  rank: number;
  completedAt: string;
}

export const mockResults: Result[] = [
  {
    id: '1',
    candidateId: '1',
    examId: '1',
    score: 34,
    maxScore: 40,
    percentage: 85,
    rank: 3,
    completedAt: '2026-02-15T09:45:00Z',
  },
  {
    id: '2',
    candidateId: '2',
    examId: '1',
    score: 37,
    maxScore: 40,
    percentage: 92.5,
    rank: 1,
    completedAt: '2026-02-15T09:30:00Z',
  },
  {
    id: '3',
    candidateId: '4',
    examId: '1',
    score: 31,
    maxScore: 40,
    percentage: 77.5,
    rank: 5,
    completedAt: '2026-02-15T09:55:00Z',
  },
];

export default {
  candidates: mockCandidates,
  exams: mockExams,
  questions: mockQuestions,
  statistics: mockStatistics,
  resources: mockResources,
  results: mockResults,
};
