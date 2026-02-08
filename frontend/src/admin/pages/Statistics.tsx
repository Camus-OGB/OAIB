import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  Award,
  MapPin,
  Download,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { getCandidateStats, listCandidates } from '../../services/candidateService';
import { listExamSessions, listCategories } from '../../services/examService';
import type { ExamSession, QuestionCategory } from '../../shared/types';

interface StatCard {
  label: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
}

interface RegionData {
  name: string;
  candidates: number;
  percentage: number;
}

interface QCMAnalytics {
  category: string;
  totalQuestions: number;
}

interface ScoreRange {
  range: string;
  count: number;
}

const AdminStatistics: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data state
  const [stats, setStats] = useState<StatCard[]>([]);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [genderData, setGenderData] = useState<{ gender: string; count: number; percentage: number }[]>([]);
  const [qcmAnalytics, setQcmAnalytics] = useState<QCMAnalytics[]>([]);
  const [scoreDistribution, setScoreDistribution] = useState<ScoreRange[]>([]);
  const [sessions, setSessions] = useState<ExamSession[]>([]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [candidateStatsRes, candidateRes, sessionRes, categoriesRes] = await Promise.all([
        getCandidateStats().catch(() => ({ ok: false, data: null, error: null })),
        listCandidates('page_size=1').catch(() => ({ ok: false, data: null, error: null })),
        listExamSessions('page_size=200').catch(() => ({ ok: false, data: null, error: null })),
        listCategories().catch(() => ({ ok: false, data: null, error: null })),
      ]);

      const candidateStats = (candidateStatsRes as any).data ?? {};
      const allSessions = sessionRes.data?.results ?? [];
      const categoryList = categoriesRes.data?.results ?? [];

      // KPI cards
      const totalInscrits = candidateStats.total ?? candidateRes.data?.count ?? 0;
      const validated = candidateStats.approved ?? 0;
      const sessionsCompleted = allSessions.filter((s: ExamSession) => s.status === 'completed').length;
      const completedSessions = allSessions.filter((s: ExamSession) => s.status === 'completed');
      const avgScore = completedSessions.length > 0
        ? Math.round(completedSessions.reduce((sum: number, s: ExamSession) => sum + (s.percentage || 0), 0) / completedSessions.length)
        : 0;

      setStats([
        { label: 'Total Inscrits', value: totalInscrits, change: 0, icon: Users, color: 'accent' },
        { label: 'Dossiers Validés', value: validated, change: 0, icon: GraduationCap, color: 'green' },
        { label: 'QCM Passés', value: sessionsCompleted, change: 0, icon: Activity, color: 'blue' },
        { label: 'Score Moyen', value: `${avgScore}%`, change: 0, icon: Award, color: 'purple' },
      ]);

      // Score distribution from sessions
      const ranges: ScoreRange[] = [
        { range: '0-20', count: 0 },
        { range: '21-40', count: 0 },
        { range: '41-60', count: 0 },
        { range: '61-80', count: 0 },
        { range: '81-100', count: 0 },
      ];
      completedSessions.forEach((s: ExamSession) => {
        const pct = s.percentage || 0;
        if (pct <= 20) ranges[0].count++;
        else if (pct <= 40) ranges[1].count++;
        else if (pct <= 60) ranges[2].count++;
        else if (pct <= 80) ranges[3].count++;
        else ranges[4].count++;
      });
      setScoreDistribution(ranges);
      setSessions(allSessions);

      // QCM analytics from categories
      setQcmAnalytics(
        categoryList.map((c: QuestionCategory) => ({
          category: c.name,
          totalQuestions: c.questions_count || 0,
        }))
      );

      // Region/Gender — from candidateStats if available, otherwise empty
      const regionEntries = Object.entries(candidateStats)
        .filter(([k]) => k.startsWith('region_'))
        .map(([k, v]) => ({ name: k.replace('region_', ''), candidates: v, percentage: totalInscrits > 0 ? Math.round((v / totalInscrits) * 100 * 10) / 10 : 0 }));
      setRegionData(regionEntries.length > 0 ? regionEntries : []);

      const male = candidateStats.male ?? 0;
      const female = candidateStats.female ?? 0;
      const genderTotal = male + female;
      if (genderTotal > 0) {
        setGenderData([
          { gender: 'Masculin', count: male, percentage: Math.round((male / genderTotal) * 100) },
          { gender: 'Féminin', count: female, percentage: Math.round((female / genderTotal) * 100) },
        ]);
      } else {
        setGenderData([]);
      }
    } catch (err) {
      console.error('Erreur chargement statistiques:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAllData().finally(() => setIsRefreshing(false));
  };

  const handleExportPDF = () => {
    alert('Export PDF en cours de développement');
  };

  const maxScore = Math.max(...scoreDistribution.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Statistiques & Rapports</h1>
          <p className="text-slate-400 mt-1">Analyse des performances et KPIs</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
            <option value="all">Tout le temps</option>
          </select>
          <button
            onClick={handleRefresh}
            className={`p-2.5 bg-slate-700 rounded-xl text-slate-300 hover:bg-slate-600 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors"
          >
            <Download size={18} />
            Rapport PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : (<>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                stat.color === 'accent' ? 'bg-accent/20' :
                stat.color === 'green' ? 'bg-green-500/20' :
                stat.color === 'blue' ? 'bg-blue-500/20' :
                'bg-purple-500/20'
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === 'accent' ? 'text-accent' :
                  stat.color === 'green' ? 'text-green-400' :
                  stat.color === 'blue' ? 'text-blue-400' :
                  'text-purple-400'
                }`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stat.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions Chart */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold text-lg">Sessions d'examen</h3>
              <p className="text-slate-400 text-sm">{sessions.length} session(s) au total</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-500" />
          </div>
          {sessions.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500">Aucune session disponible</div>
          ) : (
          <div className="h-64 flex items-end gap-2">
            {sessions.slice(0, 20).map((session, index) => {
              const pct = session.percentage || 0;
              return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className={`w-full rounded-t-lg transition-all ${pct >= 60 ? 'bg-green-500/80 hover:bg-green-500' : pct >= 40 ? 'bg-yellow-500/80 hover:bg-yellow-500' : 'bg-red-500/80 hover:bg-red-500'}`}
                  style={{ height: `${Math.max(pct * 2, 4)}px` }}
                  title={`${session.candidate_name || `#${session.id}`}: ${pct}%`}
                />
                <span className="text-[10px] text-slate-500 -rotate-45">#{session.id}</span>
              </div>
              );
            })}
          </div>
          )}
        </div>

        {/* Score Distribution */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold text-lg">Distribution des scores</h3>
              <p className="text-slate-400 text-sm">Répartition par tranche</p>
            </div>
            <PieChart className="w-5 h-5 text-slate-500" />
          </div>
          <div className="space-y-4">
            {scoreDistribution.map((range, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{range.range}%</span>
                  <span className="text-white font-bold">{range.count} candidats</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-orange-500' :
                      index === 2 ? 'bg-yellow-500' :
                      index === 3 ? 'bg-green-500' :
                      'bg-accent'
                    }`}
                    style={{ width: `${(range.count / maxScore) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demographic Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* By Region */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold text-lg">Candidats par région</h3>
              <p className="text-slate-400 text-sm">Répartition géographique</p>
            </div>
            <MapPin className="w-5 h-5 text-slate-500" />
          </div>
          <div className="space-y-3">
            {regionData.length === 0 ? (
              <div className="text-center py-8 text-slate-500">Données régionales non disponibles</div>
            ) : regionData.map((region, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-slate-300 w-24 text-sm">{region.name}</span>
                <div className="flex-1 h-6 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent to-accent/60 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${region.percentage * 3}%` }}
                  >
                    {region.percentage > 10 && (
                      <span className="text-primary text-xs font-bold">{region.candidates}</span>
                    )}
                  </div>
                </div>
                <span className="text-white font-bold w-16 text-right">{region.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Gender */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold text-lg">Par genre</h3>
              <p className="text-slate-400 text-sm">Répartition H/F</p>
            </div>
            <Users className="w-5 h-5 text-slate-500" />
          </div>
          {genderData.length < 2 ? (
            <div className="text-center py-16 text-slate-500">Données non disponibles</div>
          ) : (<>
          <div className="relative w-48 h-48 mx-auto mb-6">
            {/* Simple pie chart */}
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth="20"
                strokeDasharray={`${genderData[0].percentage * 2.51} 251`}
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#ec4899"
                strokeWidth="20"
                strokeDasharray={`${genderData[1].percentage * 2.51} 251`}
                strokeDashoffset={`-${genderData[0].percentage * 2.51}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{genderData[0].count + genderData[1].count}</p>
                <p className="text-slate-400 text-sm">Total</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {genderData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-pink-500'}`} />
                  <span className="text-slate-300">{data.gender}</span>
                </div>
                <span className="text-white font-bold">{data.count} ({data.percentage}%)</span>
              </div>
            ))}
          </div>
          </>)}
        </div>
      </div>

      </>)}
    </div>
  );
};

export default AdminStatistics;
