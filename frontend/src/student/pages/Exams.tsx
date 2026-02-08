import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  Lock,
  AlertCircle,
  Play,
  Calendar,
  Trophy,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { listExams, getMyExamSessions, listPhases } from '../../services/examService';
import type { Exam as ExamType, ExamSession, Phase } from '../../shared/types';
import ExamCountdown from '../../shared/components/ExamCountdown';

type ExamDisplayStatus = 'available' | 'completed' | 'locked' | 'in-progress';

interface ExamDisplay {
  id: number;
  title: string;
  description: string;
  duration: number;
  questionsCount: number;
  status: ExamDisplayStatus;
  score?: number | null;
  maxScore?: number | null;
  deadline?: string;
  startDateTime: string;
  endDateTime: string;
  phase: number;
  phaseTitle: string;
}

const StatusBadge: React.FC<{ status: ExamDisplayStatus; score?: number | null; maxScore?: number | null }> = ({ 
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

const ExamCard: React.FC<{ exam: ExamDisplay; onStart: (id: number) => void }> = ({ exam, onStart }) => {
  const isClickable = exam.status === 'available';
  
  return (
    <div 
      className={`bg-white/80 rounded-2xl border border-border p-6 transition-all ${
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

      {/* Countdown */}
      {(exam.status === 'locked' || exam.status === 'available' || exam.status === 'in-progress') && (
        <div className="mt-4">
          <ExamCountdown
            startDateTime={exam.startDateTime}
            endDateTime={exam.endDateTime}
            variant="compact"
          />
        </div>
      )}

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
  const navigate = useNavigate();
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [examsList, setExamsList] = useState<ExamDisplay[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [examsRes, sessionsRes, phasesRes] = await Promise.all([
          listExams('status=published'),
          getMyExamSessions(),
          listPhases(),
        ]);
        const sessions: ExamSession[] = sessionsRes.ok ? (sessionsRes.data.results ?? []) : [];
        const sessionsByExam = new Map<number, ExamSession>();
        for (const s of sessions) sessionsByExam.set(s.exam, s);
        const pList: Phase[] = phasesRes.ok ? (phasesRes.data.results ?? []) : [];
        setPhases(pList);
        const now = new Date();
        const mapped: ExamDisplay[] = (examsRes.ok ? (examsRes.data.results ?? []) : []).map((e: ExamType) => {
          const session = sessionsByExam.get(e.id);
          let status: ExamDisplayStatus = 'locked';
          if (session?.status === 'completed' || session?.status === 'timed_out') status = 'completed';
          else if (session?.status === 'in_progress') status = 'in-progress';
          else if (new Date(e.start_datetime) <= now && new Date(e.end_datetime) >= now) status = 'available';
          return {
            id: e.id,
            title: e.title,
            description: e.description,
            duration: e.duration_minutes,
            questionsCount: e.questions_count,
            status,
            score: session?.percentage ?? null,
            maxScore: 100,
            deadline: new Date(e.end_datetime) >= now ? new Date(e.end_datetime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : undefined,
            startDateTime: e.start_datetime,
            endDateTime: e.end_datetime,
            phase: e.phase,
            phaseTitle: e.phase_title,
          };
        });
        setExamsList(mapped);
      } catch { /* ignore */ }
       finally { setLoading(false); }
    };
    load();
  }, []);

  const filteredExams = selectedPhase 
    ? examsList.filter(e => e.phase === selectedPhase)
    : examsList;

  const completedCount = examsList.filter(e => e.status === 'completed').length;
  const averageScore = examsList
    .filter(e => e.score)
    .reduce((acc, e) => acc + (e.score || 0), 0) / completedCount || 0;

  const handleStartExam = (examId: number) => {
    navigate(`/etudiant/epreuves/${examId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

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
              <p className="text-2xl font-black text-text">{completedCount}/{examsList.length}</p>
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
              <p className="text-2xl font-black text-text">{examsList.filter(e => e.status === 'available').length}</p>
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
              <p className="text-2xl font-black text-text">{examsList.filter(e => e.status === 'locked').length}</p>
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
        {phases.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPhase(p.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              selectedPhase === p.id 
                ? 'bg-primary text-white' 
                : 'bg-white border border-border text-text-secondary hover:bg-background-alt'
            }`}
          >
            {p.title}
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
