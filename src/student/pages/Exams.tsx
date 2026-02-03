import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Lock, 
  AlertCircle,
  Play,
  Calendar,
  Trophy,
  ChevronRight
} from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questionsCount: number;
  status: 'available' | 'completed' | 'locked' | 'in-progress';
  score?: number;
  maxScore?: number;
  deadline?: string;
  phase: number;
}

const exams: Exam[] = [
  {
    id: '1',
    title: 'Test de Logique - Phase 1',
    description: 'Évaluez vos capacités de raisonnement logique et analytique.',
    duration: 30,
    questionsCount: 20,
    status: 'completed',
    score: 85,
    maxScore: 100,
    phase: 1,
  },
  {
    id: '2',
    title: 'Mathématiques pour l\'IA',
    description: 'Algèbre linéaire, probabilités et statistiques fondamentales.',
    duration: 45,
    questionsCount: 25,
    status: 'completed',
    score: 72,
    maxScore: 100,
    phase: 2,
  },
  {
    id: '3',
    title: 'Introduction à Python',
    description: 'Syntaxe de base, structures de données et algorithmes simples.',
    duration: 60,
    questionsCount: 30,
    status: 'available',
    deadline: '10 Fév 2026',
    phase: 3,
  },
  {
    id: '4',
    title: 'Fondamentaux du Machine Learning',
    description: 'Concepts de base de l\'apprentissage automatique.',
    duration: 45,
    questionsCount: 25,
    status: 'locked',
    phase: 4,
  },
  {
    id: '5',
    title: 'Deep Learning & Réseaux de Neurones',
    description: 'Architecture des réseaux de neurones et backpropagation.',
    duration: 60,
    questionsCount: 30,
    status: 'locked',
    phase: 5,
  },
  {
    id: '6',
    title: 'Projet Final IA',
    description: 'Projet pratique combinant toutes les compétences acquises.',
    duration: 120,
    questionsCount: 10,
    status: 'locked',
    phase: 6,
  },
];

const StatusBadge: React.FC<{ status: Exam['status']; score?: number; maxScore?: number }> = ({ 
  status, 
  score, 
  maxScore 
}) => {
  const config = {
    available: { 
      label: 'Disponible', 
      icon: Play, 
      className: 'bg-accent/10 text-accent' 
    },
    completed: { 
      label: `${score}/${maxScore}`, 
      icon: CheckCircle, 
      className: 'bg-green-100 text-green-600' 
    },
    locked: { 
      label: 'Verrouillé', 
      icon: Lock, 
      className: 'bg-gray-100 text-gray-500' 
    },
    'in-progress': { 
      label: 'En cours', 
      icon: Clock, 
      className: 'bg-benin-yellow/10 text-benin-yellow' 
    },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${className}`}>
      <Icon size={14} />
      {label}
    </span>
  );
};

const ExamCard: React.FC<{ exam: Exam; onStart: (id: string) => void }> = ({ exam, onStart }) => {
  const isClickable = exam.status === 'available';
  
  return (
    <div 
      className={`bg-white rounded-2xl border border-border p-6 transition-all ${
        isClickable ? 'hover:shadow-lg hover:border-primary/30 cursor-pointer' : ''
      } ${exam.status === 'locked' ? 'opacity-60' : ''}`}
      onClick={() => isClickable && onStart(exam.id)}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            exam.status === 'completed' ? 'bg-green-100' :
            exam.status === 'available' ? 'bg-primary/10' :
            'bg-gray-100'
          }`}>
            <span className={`text-lg font-black ${
              exam.status === 'completed' ? 'text-green-600' :
              exam.status === 'available' ? 'text-primary' :
              'text-gray-400'
            }`}>
              {exam.phase}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-text">{exam.title}</h3>
            <p className="text-sm text-text-secondary">Phase {exam.phase}</p>
          </div>
        </div>
        <StatusBadge status={exam.status} score={exam.score} maxScore={exam.maxScore} />
      </div>

      <p className="text-sm text-text-secondary mb-4">{exam.description}</p>

      <div className="flex items-center gap-4 text-sm text-text-muted">
        <div className="flex items-center gap-1.5">
          <Clock size={14} />
          <span>{exam.duration} min</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText size={14} />
          <span>{exam.questionsCount} questions</span>
        </div>
        {exam.deadline && (
          <div className="flex items-center gap-1.5 text-benin-red">
            <Calendar size={14} />
            <span>Avant le {exam.deadline}</span>
          </div>
        )}
      </div>

      {isClickable && (
        <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors">
          <Play size={18} />
          Commencer l'épreuve
          <ChevronRight size={18} />
        </button>
      )}

      {exam.status === 'completed' && (
        <div className="mt-4 p-3 bg-green-50 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-700">Score obtenu</span>
            <span className="font-bold text-green-700">{exam.score}%</span>
          </div>
          <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${exam.score}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const StudentExams: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const filteredExams = selectedPhase 
    ? exams.filter(e => e.phase === selectedPhase)
    : exams;

  const completedCount = exams.filter(e => e.status === 'completed').length;
  const averageScore = exams
    .filter(e => e.score)
    .reduce((acc, e) => acc + (e.score || 0), 0) / completedCount || 0;

  const handleStartExam = (examId: string) => {
    // TODO: Navigate to exam page
    console.log('Starting exam:', examId);
  };

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-text">Épreuves</h1>
        <p className="text-text-secondary mt-1">Passez vos épreuves et suivez votre progression</p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-black text-text">{completedCount}/{exams.length}</p>
              <p className="text-xs text-text-secondary">Complétées</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-black text-text">{averageScore.toFixed(0)}%</p>
              <p className="text-xs text-text-secondary">Score moyen</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-benin-yellow/10 rounded-xl flex items-center justify-center">
              <Play className="w-5 h-5 text-benin-yellow" />
            </div>
            <div>
              <p className="text-2xl font-black text-text">{exams.filter(e => e.status === 'available').length}</p>
              <p className="text-xs text-text-secondary">Disponibles</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-text">{exams.filter(e => e.status === 'locked').length}</p>
              <p className="text-xs text-text-secondary">Verrouillées</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phase filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedPhase(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
            selectedPhase === null 
              ? 'bg-primary text-white' 
              : 'bg-white border border-border text-text-secondary hover:bg-background-alt'
          }`}
        >
          Toutes les phases
        </button>
        {[1, 2, 3, 4, 5, 6].map(phase => (
          <button
            key={phase}
            onClick={() => setSelectedPhase(phase)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              selectedPhase === phase 
                ? 'bg-primary text-white' 
                : 'bg-white border border-border text-text-secondary hover:bg-background-alt'
            }`}
          >
            Phase {phase}
          </button>
        ))}
      </div>

      {/* Important notice */}
      <div className="flex items-start gap-3 p-4 bg-benin-yellow/10 border border-benin-yellow/30 rounded-xl">
        <AlertCircle className="w-5 h-5 text-benin-yellow shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-text">Consignes importantes</p>
          <p className="text-sm text-text-secondary mt-1">
            Une fois l'épreuve commencée, vous ne pouvez pas la mettre en pause. 
            Le changement d'onglet ou de fenêtre sera détecté et pourra entraîner la disqualification.
          </p>
        </div>
      </div>

      {/* Exams grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExams.map(exam => (
          <ExamCard key={exam.id} exam={exam} onStart={handleStartExam} />
        ))}
      </div>
    </div>
  );
};

export default StudentExams;
