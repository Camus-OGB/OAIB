import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  Award,
  MapPin,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  ChevronDown,
  RefreshCw
} from 'lucide-react';

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

interface GenderData {
  gender: string;
  count: number;
  percentage: number;
}

interface QCMAnalytics {
  category: string;
  avgScore: number;
  totalQuestions: number;
  correctRate: number;
}

const mockStats: StatCard[] = [
  { label: 'Total Inscrits', value: 2847, change: 15.3, icon: Users, color: 'accent' },
  { label: 'Dossiers Validés', value: 1523, change: 8.7, icon: GraduationCap, color: 'green' },
  { label: 'QCM Passés', value: 1102, change: 12.1, icon: Activity, color: 'blue' },
  { label: 'Score Moyen', value: '68%', change: -2.3, icon: Award, color: 'purple' },
];

const mockRegionData: RegionData[] = [
  { name: 'Littoral', candidates: 856, percentage: 30.1 },
  { name: 'Atlantique', candidates: 512, percentage: 18.0 },
  { name: 'Ouémé', candidates: 423, percentage: 14.9 },
  { name: 'Borgou', candidates: 298, percentage: 10.5 },
  { name: 'Zou', candidates: 215, percentage: 7.5 },
  { name: 'Collines', candidates: 178, percentage: 6.2 },
  { name: 'Atacora', candidates: 145, percentage: 5.1 },
  { name: 'Mono', candidates: 98, percentage: 3.4 },
  { name: 'Autres', candidates: 122, percentage: 4.3 },
];

const mockGenderData: GenderData[] = [
  { gender: 'Masculin', count: 1652, percentage: 58 },
  { gender: 'Féminin', count: 1195, percentage: 42 },
];

const mockQCMAnalytics: QCMAnalytics[] = [
  { category: 'Logique', avgScore: 72, totalQuestions: 45, correctRate: 68 },
  { category: 'Mathématiques', avgScore: 65, totalQuestions: 38, correctRate: 62 },
  { category: 'Programmation', avgScore: 58, totalQuestions: 32, correctRate: 55 },
  { category: 'Machine Learning', avgScore: 61, totalQuestions: 28, correctRate: 58 },
  { category: 'Culture IA', avgScore: 78, totalQuestions: 25, correctRate: 75 },
];

const mockDailyRegistrations = [
  { date: '01/01', count: 45 },
  { date: '02/01', count: 62 },
  { date: '03/01', count: 58 },
  { date: '04/01', count: 89 },
  { date: '05/01', count: 102 },
  { date: '06/01', count: 78 },
  { date: '07/01', count: 95 },
  { date: '08/01', count: 112 },
  { date: '09/01', count: 98 },
  { date: '10/01', count: 135 },
  { date: '11/01', count: 145 },
  { date: '12/01', count: 128 },
  { date: '13/01', count: 156 },
  { date: '14/01', count: 142 },
];

const mockScoreDistribution = [
  { range: '0-20', count: 23 },
  { range: '21-40', count: 87 },
  { range: '41-60', count: 245 },
  { range: '61-80', count: 512 },
  { range: '81-100', count: 235 },
];

const AdminStatistics: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExportPDF = () => {
    alert('Export PDF en cours de développement');
  };

  const maxRegistration = Math.max(...mockDailyRegistrations.map(d => d.count));
  const maxScore = Math.max(...mockScoreDistribution.map(d => d.count));

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
            className="flex items-center gap-2 px-4 py-2.5 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors"
          >
            <Download size={18} />
            Rapport PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat, index) => (
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
        {/* Registrations Chart */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold text-lg">Inscriptions quotidiennes</h3>
              <p className="text-slate-400 text-sm">Évolution des inscriptions</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-500" />
          </div>
          <div className="h-64 flex items-end gap-2">
            {mockDailyRegistrations.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-accent/80 rounded-t-lg transition-all hover:bg-accent"
                  style={{ height: `${(day.count / maxRegistration) * 200}px` }}
                  title={`${day.date}: ${day.count} inscrits`}
                />
                <span className="text-[10px] text-slate-500 -rotate-45">{day.date}</span>
              </div>
            ))}
          </div>
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
            {mockScoreDistribution.map((range, index) => (
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
            {mockRegionData.map((region, index) => (
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
                strokeDasharray={`${mockGenderData[0].percentage * 2.51} 251`}
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#ec4899"
                strokeWidth="20"
                strokeDasharray={`${mockGenderData[1].percentage * 2.51} 251`}
                strokeDashoffset={`-${mockGenderData[0].percentage * 2.51}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{mockGenderData[0].count + mockGenderData[1].count}</p>
                <p className="text-slate-400 text-sm">Total</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {mockGenderData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-pink-500'}`} />
                  <span className="text-slate-300">{data.gender}</span>
                </div>
                <span className="text-white font-bold">{data.count} ({data.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QCM Analytics */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-bold text-lg">Analyse des performances QCM</h3>
            <p className="text-slate-400 text-sm">Par catégorie de questions</p>
          </div>
          <Activity className="w-5 h-5 text-slate-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Catégorie</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Questions</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Score moyen</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Taux de réussite</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {mockQCMAnalytics.map((item, index) => (
                <tr key={index} className="hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-white font-medium">{item.category}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-slate-300">{item.totalQuestions}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-bold ${
                      item.avgScore >= 70 ? 'text-green-400' :
                      item.avgScore >= 50 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {item.avgScore}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-slate-300">{item.correctRate}%</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.correctRate >= 70 ? 'bg-green-500' :
                          item.correctRate >= 50 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${item.correctRate}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
        <h3 className="text-white font-bold text-lg mb-4">Rapports rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors text-left">
            <div className="p-3 bg-accent/20 rounded-xl">
              <FileText className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-white font-medium">Rapport d'inscriptions</p>
              <p className="text-slate-400 text-sm">Liste complète des candidats</p>
            </div>
          </button>
          <button className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors text-left">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium">Résultats QCM</p>
              <p className="text-slate-400 text-sm">Scores détaillés par candidat</p>
            </div>
          </button>
          <button className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors text-left">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-medium">Analyse régionale</p>
              <p className="text-slate-400 text-sm">Statistiques par département</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
