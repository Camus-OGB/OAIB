import React from 'react';
import { FileText, Trophy, Clock, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

const stats = [
  { label: 'Épreuves complétées', value: '3/6', icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Score moyen', value: '78%', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
  { label: 'Classement', value: '42ème', icon: Trophy, color: 'text-benin-yellow', bg: 'bg-benin-yellow/10' },
  { label: 'Temps restant', value: '15j', icon: Clock, color: 'text-benin-red', bg: 'bg-benin-red/10' },
];

const upcomingExams = [
  { title: 'Épreuve de Machine Learning', date: '15 Fév 2026', duration: '2h', status: 'À venir' },
  { title: 'Épreuve de Deep Learning', date: '22 Fév 2026', duration: '2h30', status: 'À venir' },
  { title: 'Projet Final IA', date: '1 Mars 2026', duration: '4h', status: 'À venir' },
];

const recentResults = [
  { title: 'Introduction à l\'IA', score: 85, maxScore: 100, date: '5 Fév 2026' },
  { title: 'Python pour l\'IA', score: 72, maxScore: 100, date: '1 Fév 2026' },
  { title: 'Mathématiques pour l\'IA', score: 78, maxScore: 100, date: '28 Jan 2026' },
];

const StudentDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-text">Tableau de bord</h1>
        <p className="text-text-secondary mt-1">Suivez votre progression dans les Olympiades</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow">
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
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-text">Prochaines épreuves</h2>
            <a href="/etudiant/epreuves" className="text-sm text-accent font-medium hover:underline flex items-center gap-1">
              Voir tout <ArrowRight size={14} />
            </a>
          </div>
          <div className="space-y-4">
            {upcomingExams.map((exam, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-background rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-text truncate">{exam.title}</p>
                  <p className="text-sm text-text-secondary">{exam.date} • {exam.duration}</p>
                </div>
                <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full shrink-0">
                  {exam.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent results */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-text">Derniers résultats</h2>
            <a href="/etudiant/resultats" className="text-sm text-accent font-medium hover:underline flex items-center gap-1">
              Voir tout <ArrowRight size={14} />
            </a>
          </div>
          <div className="space-y-4">
            {recentResults.map((result, i) => (
              <div key={i} className="p-4 bg-background rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-text">{result.title}</p>
                  <p className="text-sm text-text-secondary">{result.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(result.score / result.maxScore) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-primary">{result.score}/{result.maxScore}</span>
                </div>
              </div>
            ))}
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
              className="px-6 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent-light transition-colors"
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
