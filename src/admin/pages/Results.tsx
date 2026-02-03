import React, { useState } from 'react';
import {
  Search,
  Filter,
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
  Calendar,
  FileText
} from 'lucide-react';

type ExamStatus = 'not_started' | 'in_progress' | 'completed' | 'evaluated';

interface ExamResult {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  examType: string;
  score: number;
  maxScore: number;
  percentage: number;
  startedAt: string;
  completedAt: string;
  duration: number; // minutes
  status: ExamStatus;
  correctAnswers: number;
  totalQuestions: number;
  categoryScores: { category: string; score: number; max: number }[];
}

const mockResults: ExamResult[] = [
  {
    id: '1',
    candidateId: 'C001',
    candidateName: 'Koffi Mensah',
    candidateEmail: 'koffi.m@email.com',
    examType: 'Test de Logique',
    score: 85,
    maxScore: 100,
    percentage: 85,
    startedAt: '2026-01-30 10:00',
    completedAt: '2026-01-30 10:28',
    duration: 28,
    status: 'completed',
    correctAnswers: 17,
    totalQuestions: 20,
    categoryScores: [
      { category: 'Logique', score: 9, max: 10 },
      { category: 'Mathématiques', score: 8, max: 10 },
    ],
  },
  {
    id: '2',
    candidateId: 'C002',
    candidateName: 'Afi Dossou',
    candidateEmail: 'afi.d@email.com',
    examType: 'Test de Logique',
    score: 72,
    maxScore: 100,
    percentage: 72,
    startedAt: '2026-01-30 09:15',
    completedAt: '2026-01-30 09:42',
    duration: 27,
    status: 'completed',
    correctAnswers: 14,
    totalQuestions: 20,
    categoryScores: [
      { category: 'Logique', score: 7, max: 10 },
      { category: 'Mathématiques', score: 7, max: 10 },
    ],
  },
  {
    id: '3',
    candidateId: 'C003',
    candidateName: 'Yao Agbessi',
    candidateEmail: 'yao.a@email.com',
    examType: 'Test de Logique',
    score: 0,
    maxScore: 100,
    percentage: 0,
    startedAt: '2026-01-30 11:00',
    completedAt: '',
    duration: 0,
    status: 'in_progress',
    correctAnswers: 0,
    totalQuestions: 20,
    categoryScores: [],
  },
  {
    id: '4',
    candidateId: 'C004',
    candidateName: 'Adjoa Houénou',
    candidateEmail: 'adjoa.h@email.com',
    examType: 'Test de Logique',
    score: 92,
    maxScore: 100,
    percentage: 92,
    startedAt: '2026-01-29 14:00',
    completedAt: '2026-01-29 14:25',
    duration: 25,
    status: 'evaluated',
    correctAnswers: 18,
    totalQuestions: 20,
    categoryScores: [
      { category: 'Logique', score: 10, max: 10 },
      { category: 'Mathématiques', score: 8, max: 10 },
    ],
  },
  {
    id: '5',
    candidateId: 'C005',
    candidateName: 'Kossi Tossou',
    candidateEmail: 'kossi.t@email.com',
    examType: 'Test de Logique',
    score: 58,
    maxScore: 100,
    percentage: 58,
    startedAt: '2026-01-29 16:30',
    completedAt: '2026-01-29 17:00',
    duration: 30,
    status: 'completed',
    correctAnswers: 12,
    totalQuestions: 20,
    categoryScores: [
      { category: 'Logique', score: 6, max: 10 },
      { category: 'Mathématiques', score: 6, max: 10 },
    ],
  },
];

const statusConfig = {
  not_started: { label: 'Non commencé', icon: Clock, className: 'bg-slate-500/10 text-slate-400' },
  in_progress: { label: 'En cours', icon: Play, className: 'bg-blue-500/10 text-blue-400' },
  completed: { label: 'Terminé', icon: CheckCircle, className: 'bg-green-500/10 text-green-400' },
  evaluated: { label: 'Évalué', icon: Trophy, className: 'bg-purple-500/10 text-purple-400' },
};

const AdminResults: React.FC = () => {
  const [results] = useState<ExamResult[]>(mockResults);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ExamStatus | 'all'>('all');
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredResults = results.filter(r => {
    const matchesSearch = 
      r.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.candidateId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: results.length,
    completed: results.filter(r => r.status === 'completed' || r.status === 'evaluated').length,
    avgScore: Math.round(
      results
        .filter(r => r.status === 'completed' || r.status === 'evaluated')
        .reduce((sum, r) => sum + r.percentage, 0) /
      results.filter(r => r.status === 'completed' || r.status === 'evaluated').length || 0
    ),
    passRate: Math.round(
      (results.filter(r => r.percentage >= 60).length /
      results.filter(r => r.status === 'completed' || r.status === 'evaluated').length) * 100 || 0
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Résultats des Épreuves</h1>
          <p className="text-slate-400 mt-1">{filteredResults.length} résultat(s)</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors"
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
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-slate-400 text-sm">Terminées</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-accent" />
            <span className="text-slate-400 text-sm">Score moyen</span>
          </div>
          <p className="text-2xl font-bold text-accent">{stats.avgScore}%</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            <span className="text-slate-400 text-sm">Taux réussite</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">{stats.passRate}%</p>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ExamStatus | 'all')}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
          >
            <option value="all">Tous les statuts</option>
            <option value="not_started">Non commencé</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminé</option>
            <option value="evaluated">Évalué</option>
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
              {paginatedResults.map((result) => {
                const status = statusConfig[result.status];
                return (
                  <tr key={result.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{result.candidateName}</p>
                        <p className="text-slate-400 text-sm">{result.candidateId}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-300">{result.examType}</span>
                    </td>
                    <td className="py-4 px-6">
                      {result.status === 'completed' || result.status === 'evaluated' ? (
                        <div>
                          <p className={`font-bold ${
                            result.percentage >= 70 ? 'text-green-400' :
                            result.percentage >= 50 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {result.percentage}%
                          </p>
                          <p className="text-slate-500 text-sm">
                            {result.correctAnswers}/{result.totalQuestions}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {result.duration > 0 ? (
                        <span className="text-slate-300">{result.duration} min</span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <p className="text-slate-300">{result.startedAt.split(' ')[0]}</p>
                        <p className="text-slate-500">{result.startedAt.split(' ')[1]}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.className}`}>
                        <status.icon size={12} />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedResult(result)}
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
                  {selectedResult.candidateName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedResult.candidateName}</h3>
                  <p className="text-slate-400">{selectedResult.candidateEmail}</p>
                  <p className="text-slate-500 text-sm">ID: {selectedResult.candidateId}</p>
                </div>
              </div>

              {/* Score summary */}
              {(selectedResult.status === 'completed' || selectedResult.status === 'evaluated') && (
                <div className="bg-slate-700/50 rounded-xl p-6 text-center">
                  <p className={`text-5xl font-bold ${
                    selectedResult.percentage >= 70 ? 'text-green-400' :
                    selectedResult.percentage >= 50 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {selectedResult.percentage}%
                  </p>
                  <p className="text-slate-400 mt-2">
                    {selectedResult.score} / {selectedResult.maxScore} points
                  </p>
                  <p className="text-slate-500 text-sm">
                    {selectedResult.correctAnswers} réponses correctes sur {selectedResult.totalQuestions}
                  </p>
                </div>
              )}

              {/* Exam details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-1">Épreuve</p>
                  <p className="text-white font-medium">{selectedResult.examType}</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-1">Durée</p>
                  <p className="text-white font-medium">
                    {selectedResult.duration > 0 ? `${selectedResult.duration} minutes` : '-'}
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-1">Début</p>
                  <p className="text-white font-medium">{selectedResult.startedAt}</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-1">Fin</p>
                  <p className="text-white font-medium">{selectedResult.completedAt || '-'}</p>
                </div>
              </div>

              {/* Category scores */}
              {selectedResult.categoryScores.length > 0 && (
                <div>
                  <h4 className="text-white font-bold mb-3">Scores par catégorie</h4>
                  <div className="space-y-3">
                    {selectedResult.categoryScores.map((cat, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{cat.category}</span>
                          <span className="text-white font-bold">{cat.score}/{cat.max}</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              (cat.score / cat.max) >= 0.7 ? 'bg-green-500' :
                              (cat.score / cat.max) >= 0.5 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${(cat.score / cat.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
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
