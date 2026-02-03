import React from 'react';
import { 
  Users, 
  GraduationCap, 
  FileText, 
  Trophy,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  Activity
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: 'accent' | 'blue' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    accent: 'bg-accent/10 text-accent',
    blue: 'bg-blue-500/10 text-blue-400',
    purple: 'bg-purple-500/10 text-purple-400',
    orange: 'bg-orange-500/10 text-orange-400',
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-accent' : 'text-red-400'}`}>
          {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        <p className="text-slate-400 text-sm mt-1">{title}</p>
      </div>
    </div>
  );
};

const recentActivities = [
  { id: 1, action: 'Nouvel étudiant inscrit', user: 'Koffi Mensah', time: 'Il y a 5 min', type: 'user' },
  { id: 2, action: 'Épreuve créée', user: 'Admin', time: 'Il y a 15 min', type: 'exam' },
  { id: 3, action: 'Résultats publiés', user: 'Admin', time: 'Il y a 1h', type: 'result' },
  { id: 4, action: 'Inscription validée', user: 'Afi Dossou', time: 'Il y a 2h', type: 'user' },
  { id: 5, action: 'Modification contenu', user: 'Admin', time: 'Il y a 3h', type: 'content' },
];

const upcomingExams = [
  { id: 1, title: 'Phase Qualificative', date: '15 Mars 2025', participants: 234 },
  { id: 2, title: 'Phase Éliminatoire', date: '22 Mars 2025', participants: 180 },
  { id: 3, title: 'Finale Nationale', date: '5 Avril 2025', participants: 50 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Vue d'ensemble de l'olympiade</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Utilisateurs"
          value="1,234"
          change={12}
          icon={Users}
          color="accent"
        />
        <StatCard
          title="Étudiants Inscrits"
          value="856"
          change={8}
          icon={GraduationCap}
          color="blue"
        />
        <StatCard
          title="Épreuves Actives"
          value="12"
          change={-5}
          icon={FileText}
          color="purple"
        />
        <StatCard
          title="Taux de Réussite"
          value="68%"
          change={15}
          icon={Trophy}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <Activity className="text-accent" size={20} />
              <h2 className="text-lg font-bold text-white">Activités Récentes</h2>
            </div>
            <button className="text-accent text-sm font-medium hover:underline flex items-center gap-1">
              Voir tout <ArrowRight size={16} />
            </button>
          </div>
          <div className="divide-y divide-slate-700">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-slate-700/50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'user' ? 'bg-blue-500/10 text-blue-400' :
                  activity.type === 'exam' ? 'bg-purple-500/10 text-purple-400' :
                  activity.type === 'result' ? 'bg-accent/10 text-accent' :
                  'bg-orange-500/10 text-orange-400'
                }`}>
                  {activity.type === 'user' && <Users size={18} />}
                  {activity.type === 'exam' && <FileText size={18} />}
                  {activity.type === 'result' && <Trophy size={18} />}
                  {activity.type === 'content' && <FileText size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{activity.action}</p>
                  <p className="text-slate-400 text-sm">{activity.user}</p>
                </div>
                <span className="text-slate-500 text-sm whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <Calendar className="text-accent" size={20} />
              <h2 className="text-lg font-bold text-white">Prochaines Épreuves</h2>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="bg-slate-700/50 rounded-xl p-4">
                <h3 className="text-white font-semibold">{exam.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-slate-400 text-sm">{exam.date}</span>
                  <span className="text-accent text-sm">{exam.participants} inscrits</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-700">
            <button className="w-full py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors">
              Créer une Épreuve
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-white">Actions Rapides</h3>
            <p className="text-white/70 mt-1">Gérez efficacement l'olympiade</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors">
              Ajouter un Étudiant
            </button>
            <button className="px-6 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors">
              Nouvelle Épreuve
            </button>
            <button className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">
              Publier Résultats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
