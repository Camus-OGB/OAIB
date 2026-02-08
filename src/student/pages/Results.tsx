import React, { useState, useEffect } from 'react';
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
  PieChart,
  Loader2
} from 'lucide-react';
import { getMyExamSessions } from '../../services/examService';
import type { ExamSession } from '../../shared/types';

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

const ResultCard: React.FC<{ result: ExamSession }> = ({ result }) => {
  const [expanded, setExpanded] = useState(false);
  const percentage = result.percentage ?? 0;
  const duration = result.time_spent_seconds ? `${Math.floor(result.time_spent_seconds / 60)} min` : '—';
  const date = result.completed_at ? new Date(result.completed_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const categories = result.category_scores
    ? Object.entries(result.category_scores as Record<string, { score: number; max_score: number }>)
    : [];

  return (
    <div className="bg-white/80 rounded-2xl border border-border overflow-hidden">
      <div 
        className="p-6 cursor-pointer hover:bg-background-alt/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              percentage >= 80 ? 'bg-green-100' : percentage >= 60 ? 'bg-benin-yellow/20' : 'bg-red-100'
            }`}>
              <Trophy className={`w-6 h-6 ${getScoreColor(percentage)}`} />
            </div>
            <div>
              <h3 className="font-bold text-text">{result.exam_title}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {duration}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-2xl font-black ${getScoreColor(percentage)}`}>
              {percentage.toFixed(0)}%
            </div>
            {result.rank && (
              <div className="text-sm text-text-secondary mt-1">
                #{result.rank}
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
      {expanded && categories.length > 0 && (
        <div className="px-6 pb-6 pt-2 border-t border-border">
          <h4 className="font-bold text-text mb-4">Détails par catégorie</h4>
          <div className="space-y-3">
            {categories.map(([name, data], i) => {
              const catPercentage = data.max_score > 0 ? (data.score / data.max_score) * 100 : 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text-secondary">{name}</span>
                    <span className={`font-bold ${getScoreColor(catPercentage)}`}>
                      {data.score}/{data.max_score}
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
                    {result.rank}ème
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
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ExamSession[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyExamSessions('status=completed');
        if (res.ok) setResults(res.data.results ?? []);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const completedResults = results.filter(r => r.percentage !== null);
  const averageScore = completedResults.length > 0
    ? completedResults.reduce((acc, r) => acc + (r.percentage ?? 0), 0) / completedResults.length
    : 0;
  
  const bestResult = completedResults.length > 0
    ? completedResults.reduce((best, r) => (r.percentage ?? 0) > (best.percentage ?? 0) ? r : best, completedResults[0])
    : null;
  
  const trend = completedResults.length >= 2
    ? (completedResults[completedResults.length - 1].percentage ?? 0) - (completedResults[completedResults.length - 2].percentage ?? 0)
    : 0;

  const totalScore = completedResults.reduce((acc, r) => acc + (r.score ?? 0), 0);
  const maxTotalScore = completedResults.reduce((acc, r) => acc + (r.max_score ?? 0), 0);

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-text">Mes Résultats</h1>
        <p className="text-text-secondary mt-1">Consultez vos performances aux épreuves</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-black text-text">{averageScore.toFixed(0)}%</p>
          <p className="text-sm text-text-secondary">Score moyen</p>
        </div>

        <div className="bg-white/80 rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-green-600">{bestResult ? `${(bestResult.percentage ?? 0).toFixed(0)}%` : '—'}</p>
          <p className="text-sm text-text-secondary">Meilleur score</p>
        </div>

        <div className="bg-white/80 rounded-2xl border border-border p-5">
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

        <div className="bg-white/80 rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
          </div>
          <p className="text-2xl font-black text-text">{completedResults.length}</p>
          <p className="text-sm text-text-secondary">Épreuves passées</p>
        </div>
      </div>

      {/* Progress chart placeholder */}
      <div className="bg-white/80 rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-text">Progression globale</h2>
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-text-muted" />
            <span className="text-sm text-text-secondary">Phases complétées</span>
          </div>
        </div>

        {/* Simple progress visualization */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
          {completedResults.map((r, i) => {
            const pct = r.percentage ?? 0;
            return (
              <div key={r.id} className="text-center">
                <div className={`aspect-square rounded-xl flex items-center justify-center mb-2 ${
                  pct >= 80 ? 'bg-green-100' : pct >= 60 ? 'bg-benin-yellow/20' : 'bg-red-100'
                }`}>
                  <span className={`text-lg font-black ${getScoreColor(pct)}`}>
                    {pct.toFixed(0)}
                  </span>
                </div>
                <p className="text-xs text-text-secondary truncate">{r.exam_title}</p>
              </div>
            );
          })}
          {completedResults.length === 0 && (
            <div className="col-span-full text-center py-6">
              <p className="text-text-secondary text-sm">Aucune épreuve terminée</p>
            </div>
          )}
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
