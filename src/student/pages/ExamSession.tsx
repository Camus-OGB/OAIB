import React, { useState, useEffect, useCallback } from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle,
  Flag,
  Send,
  X,
  AlertCircle
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  category: string;
}

interface ExamSessionProps {
  examId?: string;
  onComplete?: (results: ExamResult) => void;
  onExit?: () => void;
}

interface ExamResult {
  examId: string;
  answers: Record<string, string>;
  timeSpent: number;
  flaggedQuestions: string[];
}

// Mock questions for demo
const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'Si tous les A sont B, et tous les B sont C, alors :',
    options: [
      { id: 'a', text: 'Tous les C sont A' },
      { id: 'b', text: 'Tous les A sont C' },
      { id: 'c', text: 'Certains C ne sont pas A' },
      { id: 'd', text: 'Aucun A n\'est C' },
    ],
    category: 'Logique',
  },
  {
    id: '2',
    text: 'Complétez la suite : 2, 6, 12, 20, 30, ?',
    options: [
      { id: 'a', text: '40' },
      { id: 'b', text: '42' },
      { id: 'c', text: '44' },
      { id: 'd', text: '46' },
    ],
    category: 'Mathématiques',
  },
  {
    id: '3',
    text: 'Quel algorithme est le plus efficace pour trier un tableau de grande taille ?',
    options: [
      { id: 'a', text: 'Bubble Sort - O(n²)' },
      { id: 'b', text: 'Quick Sort - O(n log n)' },
      { id: 'c', text: 'Selection Sort - O(n²)' },
      { id: 'd', text: 'Insertion Sort - O(n²)' },
    ],
    category: 'Algorithmique',
  },
  {
    id: '4',
    text: 'En apprentissage automatique, qu\'est-ce que le surapprentissage (overfitting) ?',
    options: [
      { id: 'a', text: 'Le modèle ne peut pas apprendre les données d\'entraînement' },
      { id: 'b', text: 'Le modèle mémorise les données au lieu de généraliser' },
      { id: 'c', text: 'Le modèle est trop simple pour les données' },
      { id: 'd', text: 'Le modèle a besoin de plus de données' },
    ],
    category: 'Machine Learning',
  },
  {
    id: '5',
    text: 'Quelle est la dérivée de f(x) = x² + 3x ?',
    options: [
      { id: 'a', text: '2x + 3' },
      { id: 'b', text: 'x² + 3' },
      { id: 'c', text: '2x' },
      { id: 'd', text: 'x + 3' },
    ],
    category: 'Mathématiques',
  },
];

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const ExamSession: React.FC<ExamSessionProps> = ({ examId = '3', onComplete, onExit }) => {
  const [questions] = useState<Question[]>(mockQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === questions.length - 1;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Anti-cheat: detect tab/window changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        setShowTabWarning(true);
      }
    };

    const handleBlur = () => {
      setTabSwitchCount(prev => prev + 1);
      setShowTabWarning(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleAnswer = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const handleSubmit = useCallback(() => {
    const results: ExamResult = {
      examId,
      answers,
      timeSpent: 30 * 60 - timeLeft,
      flaggedQuestions: Array.from(flagged),
    };
    
    if (onComplete) {
      onComplete(results);
    }
    
    // TODO: Navigate to results page
    console.log('Exam submitted:', results);
  }, [examId, answers, timeLeft, flagged, onComplete]);

  const handleExit = () => {
    setShowExitWarning(true);
  };

  const confirmExit = () => {
    if (onExit) {
      onExit();
    }
    // TODO: Navigate back to exams list
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Tab switch warning modal */}
      {showTabWarning && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 text-benin-red mb-4">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold">Attention !</h3>
            </div>
            <p className="text-text-secondary mb-2">
              Vous avez quitté la fenêtre de l'examen. Cette action a été enregistrée.
            </p>
            <p className="text-sm text-benin-red font-medium mb-4">
              Nombre de détections : {tabSwitchCount}/3
            </p>
            {tabSwitchCount >= 3 && (
              <p className="text-sm text-benin-red font-bold mb-4">
                ⚠️ Après 3 détections, votre examen pourrait être invalidé.
              </p>
            )}
            <button
              onClick={() => setShowTabWarning(false)}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
            >
              J'ai compris, continuer l'examen
            </button>
          </div>
        </div>
      )}

      {/* Exit warning modal */}
      {showExitWarning && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 text-benin-red mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-bold">Quitter l'examen ?</h3>
            </div>
            <p className="text-text-secondary mb-4">
              Si vous quittez maintenant, toutes vos réponses seront perdues et vous ne pourrez peut-être pas reprendre l'examen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitWarning(false)}
                className="flex-1 py-3 border border-border text-text font-bold rounded-xl hover:bg-background-alt transition-colors"
              >
                Continuer l'examen
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 py-3 bg-benin-red text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
              >
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit confirmation modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-text mb-4">Confirmer la soumission</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Questions répondues</span>
                <span className="font-bold text-text">{answeredCount}/{questions.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Questions marquées</span>
                <span className="font-bold text-benin-yellow">{flagged.size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Temps restant</span>
                <span className="font-bold text-text">{formatTime(timeLeft)}</span>
              </div>
            </div>
            {answeredCount < questions.length && (
              <div className="p-3 bg-benin-yellow/10 rounded-xl mb-4">
                <p className="text-sm text-benin-yellow font-medium">
                  ⚠️ Vous n'avez pas répondu à toutes les questions.
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-3 border border-border text-text font-bold rounded-xl hover:bg-background-alt transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Soumettre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-border">
        <div className="flex items-center justify-between px-4 lg:px-8 py-4">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 text-text-secondary hover:text-benin-red transition-colors"
          >
            <X size={20} />
            <span className="hidden sm:inline">Quitter</span>
          </button>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${
              timeLeft < 300 ? 'bg-benin-red/10 text-benin-red animate-pulse' : 'bg-primary/10 text-primary'
            }`}>
              <Clock size={18} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-primary font-bold rounded-xl hover:bg-accent-light transition-colors"
          >
            <Send size={18} />
            <span className="hidden sm:inline">Soumettre</span>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-text-secondary">
              Question {currentIndex + 1} sur {questions.length}
            </span>
            <span className="text-text-secondary">
              {answeredCount} répondues
            </span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question navigation pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => goToQuestion(i)}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                i === currentIndex
                  ? 'bg-primary text-white'
                  : answers[q.id]
                    ? 'bg-green-100 text-green-600'
                    : flagged.has(q.id)
                      ? 'bg-benin-yellow/20 text-benin-yellow border-2 border-benin-yellow'
                      : 'bg-white border border-border text-text-secondary hover:bg-background-alt'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl border border-border p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
              {currentQuestion.category}
            </span>
            <button
              onClick={toggleFlag}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                flagged.has(currentQuestion.id)
                  ? 'bg-benin-yellow/20 text-benin-yellow'
                  : 'hover:bg-background-alt text-text-secondary'
              }`}
            >
              <Flag size={16} />
              {flagged.has(currentQuestion.id) ? 'Marquée' : 'Marquer'}
            </button>
          </div>

          <h2 className="text-lg lg:text-xl font-bold text-text mb-6">
            {currentQuestion.text}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  answers[currentQuestion.id] === option.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30 hover:bg-background-alt'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    answers[currentQuestion.id] === option.id
                      ? 'bg-primary text-white'
                      : 'bg-background text-text-secondary'
                  }`}>
                    {option.id.toUpperCase()}
                  </div>
                  <span className={`${
                    answers[currentQuestion.id] === option.id
                      ? 'text-primary font-medium'
                      : 'text-text'
                  }`}>
                    {option.text}
                  </span>
                  {answers[currentQuestion.id] === option.id && (
                    <CheckCircle className="ml-auto text-primary" size={20} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-3 border border-border rounded-xl font-medium text-text-secondary hover:bg-background-alt transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
            Précédent
          </button>

          {isLastQuestion ? (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="flex items-center gap-2 px-6 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent-light transition-colors"
            >
              Terminer
              <Send size={18} />
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="flex items-center gap-2 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
            >
              Suivant
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamSession;
