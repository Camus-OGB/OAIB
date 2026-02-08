import React, { useState, useEffect } from 'react';
import { FileText, Trophy, Clock, TrendingUp, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { getMyProfile } from '../../services/candidateService';
import { getMyExamSessions, listExams } from '../../services/examService';
import type { CandidateProfile, ExamSession, Exam } from '../../shared/types';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [profileRes, sessionsRes, examsRes] = await Promise.all([
        getMyProfile(),
        getMyExamSessions(),
        listExams('status=published'),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (sessionsRes.data) setSessions(sessionsRes.data.results ?? []);
      if (examsRes.data) setUpcomingExams((examsRes.data.results ?? []).slice(0, 3));
      setLoading(false);
    };
    load();
  }, []);

  const completedSessions = sessions.filter(s => s.status === 'completed');
  const averageScore = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.percentage || 0), 0) / completedSessions.length)
    : 0;
  const bestRank = completedSessions.reduce((best, s) => {
    if (s.rank && (!best || s.rank < best)) return s.rank;
    return best;
  }, null as number | null);

  const stats = [
    { label: 'Épreuves complétées', value: `${completedSessions.length}/${sessions.length || '-'}`, icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Score moyen', value: `${averageScore}%`, icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Classement', value: bestRank ? `${bestRank}ème` : '-', icon: Trophy, color: 'text-benin-yellow', bg: 'bg-benin-yellow/10' },
    { label: 'Complétion profil', value: profile ? `${profile.profile_completion}%` : '-', icon: Clock, color: 'text-benin-red', bg: 'bg-benin-red/10' },
  ];

  const recentResults = completedSessions.slice(0, 3);

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
        <h1 className="text-2xl lg:text-3xl font-black text-text">
          Bonjour{user ? `, ${user.first_name}` : ''} !
        </h1>
        <p className="text-text-secondary mt-1">Suivez votre progression dans les Olympiades</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/80 rounded-2xl border-2 border-primary/10 p-5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-2xl lg:text-3xl font-black text-text">{stat.value}</p>
            <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming exams */}
        <div className="bg-white/80 rounded-2xl border-2 border-primary/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-text">Prochaines épreuves</h2>
            <a href="/etudiant/epreuves" className="text-sm text-primary font-bold hover:text-accent flex items-center gap-1 transition-colors">
              Voir tout <ArrowRight size={14} />
            </a>
          </div>
          <div className="space-y-4">
            {upcomingExams.length > 0 ? upcomingExams.map((exam) => (
              <div key={exam.id} className="flex items-center gap-4 p-4 bg-background rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-text truncate">{exam.title}</p>
                  <p className="text-sm text-text-secondary">
                    {new Date(exam.start_datetime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })} • {exam.duration_minutes} min
                  </p>
                </div>
                <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full shrink-0">
                  {exam.status === 'published' ? 'À venir' : exam.status}
                </span>
              </div>
            )) : (
              <p className="text-sm text-text-secondary text-center py-4">Aucune épreuve à venir</p>
            )}
          </div>
        </div>

        {/* Recent results */}
        <div className="bg-white/80 rounded-2xl border-2 border-primary/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-text">Derniers résultats</h2>
            <a href="/etudiant/resultats" className="text-sm text-primary font-bold hover:text-accent flex items-center gap-1 transition-colors">
              Voir tout <ArrowRight size={14} />
            </a>
          </div>
          <div className="space-y-4">
            {recentResults.length > 0 ? recentResults.map((result) => (
              <div key={result.id} className="p-4 bg-background rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-text">{result.exam_title}</p>
                  <p className="text-sm text-text-secondary">
                    {result.completed_at ? new Date(result.completed_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${result.percentage || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-primary">{result.score ?? 0}/{result.max_score ?? 0}</span>
                </div>
              </div>
            )) : (
              <p className="text-sm text-text-secondary text-center py-4">Aucun résultat pour le moment</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-primary rounded-2xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Prêt pour la prochaine épreuve ?</h2>
            <p className="text-white/70 mt-1">Révisez les ressources et préparez-vous au mieux.</p>
          </div>
          <div className="flex gap-3">
            <a 
              href="/etudiant/ressources"
              className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors"
            >
              Voir les ressources
            </a>
            <a 
              href="/etudiant/epreuves"
              className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-light transition-colors"
            >
              Commencer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
