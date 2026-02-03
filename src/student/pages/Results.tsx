import React, { useState } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart
} from 'lucide-react';

interface ExamResult {
  id: string;
  title: string;
  phase: number;
  score: number;
  maxScore: number;
  date: string;
  duration: string;
  rank?: number;
  totalParticipants?: number;
  categories: {
    name: string;
    score: number;
    maxScore: number;
  }[];
}

const results: ExamResult[] = [
  {
    id: '1',
    title: 'Test de Logique - Phase 1',
    phase: 1,
    score: 85,
    maxScore: 100,
    date: '20 Jan 2026',
    duration: '25 min',
    rank: 42,
    totalParticipants: 1250,
    categories: [
      { name: 'Raisonnement logique', score: 18, maxScore: 20 },
      { name: 'Suites numériques', score: 15, maxScore: 20 },
      { name: 'Analogies', score: 17, maxScore: 20 },
      { name: 'Déduction', score: 18, maxScore: 20 },
      { name: 'Problèmes', score: 17, maxScore: 20 },
    ],
  },
  {
    id: '2',
    title: 'Mathématiques pour l\'IA',
    phase: 2,
    score: 72,
    maxScore: 100,
    date: '28 Jan 2026',
    duration: '38 min',
    rank: 156,
    totalParticipants: 980,
    categories: [
      { name: 'Algèbre linéaire', score: 14, maxScore: 25 },
      { name: 'Probabilités', score: 20, maxScore: 25 },
      { name: 'Statistiques', score: 18, maxScore: 25 },
      { name: 'Calcul différentiel', score: 20, maxScore: 25 },
    ],
  },
  {
    id: '3',
    title: 'Python pour l\'IA',
    phase: 3,
    score: 78,
    maxScore: 100,
    date: '1 Fév 2026',
    duration: '52 min',
    rank: 89,
    totalParticipants: 850,
    categories: [
      { name: 'Syntaxe de base', score: 25, maxScore: 25 },
      { name: 'Structures de données', score: 18, maxScore: 25 },
      { name: 'Fonctions', score: 20, maxScore: 25 },
      { name: 'POO', score: 15, maxScore: 25 },
    ],
  },
];

const getScoreColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-benin-yellow';
  return 'text-benin-red';
};

const getScoreBgColor = (percentage: number): string => {
  if (percentage >= 80) return 'bg-green-500';
  if (percentage >= 60) return 'bg-benin-yellow';
  return 'bg-benin-red';
};

const ResultCard: React.FC<{ result: ExamResult }> = ({ result }) => {
  const [expanded, setExpanded] = useState(false);
  const percentage = (result.score / result.maxScore) * 100;

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div 
        className="p-6 cursor-pointer hover:bg-background-alt/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              percentage >= 80 ? 'bg-green-100' : percentage >= 60 ? 'bg-benin-yellow/20' : 'bg-red-100'
            }`}>
              <span className={`text-xl font-black ${getScoreColor(percentage)}`}>
                {result.phase}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-text">{result.title}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {result.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {result.duration}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-2xl font-black ${getScoreColor(percentage)}`}>
              {result.score}%
            </div>
            {result.rank && (
              <div className="text-sm text-text-secondary mt-1">
                #{result.rank} / {result.totalParticipants}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${getScoreBgColor(percentage)}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <button className="p-1 hover:bg-background-alt rounded-lg transition-colors">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-6 pb-6 pt-2 border-t border-border">
          <h4 className="font-bold text-text mb-4">Détails par catégorie</h4>
          <div className="space-y-3">
            {result.categories.map((cat, i) => {
              const catPercentage = (cat.score / cat.maxScore) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text-secondary">{cat.name}</span>
                    <span className={`font-bold ${getScoreColor(catPercentage)}`}>
                      {cat.score}/{cat.maxScore}
                    </span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${getScoreBgColor(catPercentage)}`}
                      style={{ width: `${catPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {result.rank && (
            <div className="mt-4 p-4 bg-background rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Votre classement</p>
                  <p className="font-bold text-text">
                    {result.rank}ème sur {result.totalParticipants} participants
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StudentResults: React.FC = () => {
  const totalScore = results.reduce((acc, r) => acc + r.score, 0);
  const maxTotalScore = results.reduce((acc, r) => acc + r.maxScore, 0);
  const averageScore = totalScore / results.length;
  
  const bestResult = results.reduce((best, r) => 
    r.score > best.score ? r : best, results[0]);
  
  const latestResult = results[results.length - 1];
  const previousResult = results[results.length - 2];
  const trend = latestResult && previousResult 
    ? latestResult.score - previousResult.score 
    : 0;

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-text">Mes Résultats</h1>
        <p className="text-text-secondary mt-1">Consultez vos performances aux épreuves</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-black text-text">{averageScore.toFixed(0)}%</p>
          <p className="text-sm text-text-secondary">Score moyen</p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-green-600">{bestResult.score}%</p>
          <p className="text-sm text-text-secondary">Meilleur score</p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              trend >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {trend >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-benin-red" />
              )}
            </div>
          </div>
          <p className={`text-2xl font-black ${trend >= 0 ? 'text-green-600' : 'text-benin-red'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </p>
          <p className="text-sm text-text-secondary">Évolution</p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
          </div>
          <p className="text-2xl font-black text-text">{results.length}</p>
          <p className="text-sm text-text-secondary">Épreuves passées</p>
        </div>
      </div>

      {/* Progress chart placeholder */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-text">Progression globale</h2>
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-text-muted" />
            <span className="text-sm text-text-secondary">Phases complétées</span>
          </div>
        </div>

        {/* Simple progress visualization */}
        <div className="grid grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map(phase => {
            const result = results.find(r => r.phase === phase);
            return (
              <div key={phase} className="text-center">
                <div className={`aspect-square rounded-xl flex items-center justify-center mb-2 ${
                  result 
                    ? result.score >= 80 
                      ? 'bg-green-100' 
                      : result.score >= 60 
                        ? 'bg-benin-yellow/20' 
                        : 'bg-red-100'
                    : 'bg-gray-100'
                }`}>
                  {result ? (
                    <span className={`text-lg font-black ${getScoreColor(result.score)}`}>
                      {result.score}
                    </span>
                  ) : (
                    <span className="text-lg font-black text-gray-300">-</span>
                  )}
                </div>
                <p className="text-xs text-text-secondary">Phase {phase}</p>
              </div>
            );
          })}
        </div>

        {/* Overall progress bar */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-text-secondary">Score total cumulé</span>
            <span className="font-bold text-text">{totalScore}/{maxTotalScore} points</span>
          </div>
          <div className="h-4 bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
              style={{ width: `${(totalScore / maxTotalScore) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Results list */}
      <div>
        <h2 className="text-lg font-bold text-text mb-4">Historique des épreuves</h2>
        <div className="space-y-4">
          {results.map(result => (
            <ResultCard key={result.id} result={result} />
          ))}
        </div>
      </div>

      {/* Empty state when no results */}
      {results.length === 0 && (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-text mb-2">Aucun résultat pour le moment</h3>
          <p className="text-text-secondary">
            Passez vos premières épreuves pour voir vos résultats ici.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentResults;
