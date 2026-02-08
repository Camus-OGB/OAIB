import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Trophy,
  Target,
  FileText,
  Loader2
} from 'lucide-react';
import { listExamSessions } from '../../services/examService';
import type { ExamSession, SessionStatus } from '../../shared/types';

const statusConfig: Record<string, { label: string; icon: React.FC<{ size?: number; className?: string }>; className: string }> = {
  in_progress: { label: 'En cours', icon: Play, className: 'bg-blue-500/10 text-blue-400' },
  completed: { label: 'Terminé', icon: CheckCircle, className: 'bg-green-500/10 text-green-400' },
  timed_out: { label: 'Temps écoulé', icon: Clock, className: 'bg-orange-500/10 text-orange-400' },
  abandoned: { label: 'Abandonné', icon: XCircle, className: 'bg-red-500/10 text-red-400' },
};

const AdminResults: React.FC = () => {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<ExamSession | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('page_size', String(itemsPerPage));
      if (searchQuery) params.set('search', searchQuery);
      if (selectedStatus !== 'all') params.set('status', selectedStatus);
      const res = await listExamSessions(params.toString());
      if (res.ok) { setSessions(res.data.results ?? []); setTotalCount(res.data.count ?? 0); }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [currentPage, searchQuery, selectedStatus]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Compute stats from loaded page
  const completedSessions = sessions.filter(s => s.status === 'completed' || s.status === 'timed_out');
  const avgScore = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((sum, s) => sum + (s.percentage ?? 0), 0) / completedSessions.length)
    : 0;
  const passRate = completedSessions.length > 0
    ? Math.round((completedSessions.filter(s => (s.percentage ?? 0) >= 60).length / completedSessions.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Résultats des Épreuves</h1>
          <p className="text-slate-400 mt-1">{totalCount} résultat(s)</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors"
        >
          <Download size={18} />
          Exporter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-slate-400" />
            <span className="text-slate-400 text-sm">Total épreuves</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalCount}</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-slate-400 text-sm">Terminées</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{completedSessions.length}</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-accent" />
            <span className="text-slate-400 text-sm">Score moyen</span>
          </div>
          <p className="text-2xl font-bold text-accent">{avgScore}%</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            <span className="text-slate-400 text-sm">Taux réussite</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">{passRate}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, ID..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
          >
            <option value="all">Tous les statuts</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminé</option>
            <option value="timed_out">Temps écoulé</option>
            <option value="abandoned">Abandonné</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Candidat</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Épreuve</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Score</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Durée</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Date</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Statut</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
                </td></tr>
              ) : sessions.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-slate-400">Aucun résultat trouvé</td></tr>
              ) : sessions.map((session) => {
                const sc = statusConfig[session.status] || statusConfig.completed;
                const duration = session.time_spent_seconds > 0 ? Math.round(session.time_spent_seconds / 60) : 0;
                return (
                  <tr key={session.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{session.candidate_name || `Candidat #${session.candidate}`}</p>
                        <p className="text-slate-400 text-sm">{session.candidate_email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-300">{session.exam_title}</span>
                    </td>
                    <td className="py-4 px-6">
                      {session.percentage != null ? (
                        <div>
                          <p className={`font-bold ${
                            session.percentage >= 70 ? 'text-green-400' :
                            session.percentage >= 50 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {session.percentage}%
                          </p>
                          <p className="text-slate-500 text-sm">
                            {session.score}/{session.max_score}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {duration > 0 ? (
                        <span className="text-slate-300">{duration} min</span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <p className="text-slate-300">{new Date(session.started_at).toLocaleDateString('fr-FR')}</p>
                        <p className="text-slate-500">{new Date(session.started_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${sc.className}`}>
                        <sc.icon size={12} />
                        {sc.label}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedResult(session)}
                        className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700">
          <p className="text-slate-400 text-sm">
            Page {currentPage} sur {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Détails du résultat</h2>
              <button
                onClick={() => setSelectedResult(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Candidate info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center text-white text-xl font-bold">
                  {(selectedResult.candidate_name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedResult.candidate_name || `Candidat #${selectedResult.candidate}`}</h3>
                  <p className="text-slate-400">{selectedResult.candidate_email}</p>
                </div>
              </div>

              {/* Score summary */}
              {selectedResult.percentage != null && (
                <div className="bg-slate-700/50 rounded-xl p-6 text-center">
                  <p className={`text-5xl font-bold ${
                    selectedResult.percentage >= 70 ? 'text-green-400' :
                    selectedResult.percentage >= 50 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {selectedResult.percentage}%
                  </p>
                  <p className="text-slate-400 mt-2">
                    {selectedResult.score} / {selectedResult.max_score} points
                  </p>
                </div>
              )}

              {/* Exam details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-1">Épreuve</p>
                  <p className="text-white font-medium">{selectedResult.exam_title}</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-1">Durée</p>
                  <p className="text-white font-medium">
                    {selectedResult.time_spent_seconds > 0 ? `${Math.round(selectedResult.time_spent_seconds / 60)} minutes` : '-'}
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-1">Début</p>
                  <p className="text-white font-medium">{new Date(selectedResult.started_at).toLocaleString('fr-FR')}</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-1">Fin</p>
                  <p className="text-white font-medium">{selectedResult.completed_at ? new Date(selectedResult.completed_at).toLocaleString('fr-FR') : '-'}</p>
                </div>
              </div>

              {/* Category scores */}
              {selectedResult.category_scores && Object.keys(selectedResult.category_scores).length > 0 && (
                <div>
                  <h4 className="text-white font-bold mb-3">Scores par catégorie</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedResult.category_scores).map(([category, value]) => {
                      const score = typeof value === 'number' ? value : 0;
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">{category}</span>
                            <span className="text-white font-bold">{score}%</span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                score >= 70 ? 'bg-green-500' :
                                score >= 50 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResults;
