import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  FileText,
  Trophy,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  Activity,
  Loader2
} from 'lucide-react';
import { listUsers } from '../../services/userService';
import { listCandidates, getCandidateStats } from '../../services/candidateService';
import { listExams, listExamSessions } from '../../services/examService';
import { listAuditLogs } from '../../services/userService';

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

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalExams, setTotalExams] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [recentActivities, setRecentActivities] = useState<{id: number; action: string; user: string; time: string; type: string}[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<{id: number; title: string; date: string; participants: number}[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, candidatesRes, examsRes, sessionsRes, logsRes] = await Promise.all([
          listUsers(),
          listCandidates(),
          listExams('status=active'),
          listExamSessions('status=completed&page_size=100'),
          listAuditLogs('page_size=5'),
        ]);

        if (usersRes.ok) setTotalUsers(usersRes.data.count ?? 0);
        if (candidatesRes.ok) setTotalStudents(candidatesRes.data.count ?? 0);
        if (examsRes.ok) {
          setTotalExams(examsRes.data.count ?? 0);
          const upcoming = (examsRes.data.results ?? [])
            .filter((e: any) => new Date(e.start_datetime) > new Date())
            .slice(0, 3)
            .map((e: any) => ({
              id: e.id,
              title: e.title,
              date: new Date(e.start_datetime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
              participants: e.sessions_count ?? 0,
            }));
          setUpcomingExams(upcoming);
        }
        if (sessionsRes.ok) {
          const sessions = sessionsRes.data.results ?? [];
          const withScore = sessions.filter((s: any) => s.percentage != null);
          if (withScore.length > 0) {
            setAvgScore(Math.round(withScore.reduce((a: number, s: any) => a + s.percentage, 0) / withScore.length));
          }
        }
        if (logsRes.ok) {
          setRecentActivities((logsRes.data.results ?? []).map((log: any) => ({
            id: log.id,
            action: log.action,
            user: log.user_email,
            time: new Date(log.created_at).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
            type: log.target_model === 'user' ? 'user' : log.target_model === 'exam' ? 'exam' : log.target_model === 'candidateprofile' ? 'result' : 'content',
          })));
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Vue d'ensemble de l'olympiade</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Utilisateurs" value={totalUsers} change={0} icon={Users} color="accent" />
        <StatCard title="Étudiants Inscrits" value={totalStudents} change={0} icon={GraduationCap} color="blue" />
        <StatCard title="Épreuves Actives" value={totalExams} change={0} icon={FileText} color="purple" />
        <StatCard title="Score Moyen" value={`${avgScore}%`} change={0} icon={Trophy} color="orange" />
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
            <button className="w-full py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors">
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
            <button className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors">
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
