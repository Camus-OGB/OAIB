import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Download, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  GraduationCap,
  Loader2
} from 'lucide-react';
import { listCandidates, approveCandidate, rejectCandidate } from '../../services/candidateService';
import type { CandidateProfile, CandidateStatus } from '../../shared/types';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-yellow-500/10 text-yellow-400' },
  approved: { label: 'Validé', color: 'bg-accent/10 text-accent' },
  rejected: { label: 'Rejeté', color: 'bg-red-500/10 text-red-400' },
  incomplete: { label: 'Incomplet', color: 'bg-orange-500/10 text-orange-400' },
};

const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<CandidateProfile | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const itemsPerPage = 10;

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('page_size', String(itemsPerPage));
      if (searchQuery) params.set('search', searchQuery);
      if (selectedStatus !== 'all') params.set('status', selectedStatus);
      if (selectedCity !== 'all') params.set('city', selectedCity);
      const res = await listCandidates(params.toString());
      if (res.ok) {
        setStudents(res.data.results ?? []);
        setTotalCount(res.data.count ?? 0);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [currentPage, searchQuery, selectedStatus, selectedCity]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try { await approveCandidate(id); fetchStudents(); } catch { /* ignore */ }
    finally { setActionLoading(null); }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try { await rejectCandidate(id, 'Rejeté par l\'administrateur'); fetchStudents(); } catch { /* ignore */ }
    finally { setActionLoading(null); }
  };

  // Stats from current data
  const statCounts = { pending: 0, approved: 0, rejected: 0 };
  students.forEach(s => { if (s.status in statCounts) statCounts[s.status as keyof typeof statCounts]++; });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Étudiants</h1>
          <p className="text-slate-400 mt-1">{totalCount} étudiants inscrits</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-600 transition-colors">
          <Download size={20} />
          Exporter CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">En attente</span>
            <span className="text-2xl font-bold text-yellow-400">{statCounts.pending}</span>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Validés</span>
            <span className="text-2xl font-bold text-accent">{statCounts.approved}</span>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Rejetés</span>
            <span className="text-2xl font-bold text-red-400">{statCounts.rejected}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou école..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Validé</option>
            <option value="rejected">Rejeté</option>
            <option value="incomplete">Incomplet</option>
          </select>

          {/* City Filter */}
          <input
            type="text"
            placeholder="Filtrer par ville..."
            value={selectedCity === 'all' ? '' : selectedCity}
            onChange={(e) => { setSelectedCity(e.target.value || 'all'); setCurrentPage(1); }}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium text-sm px-6 py-4">Étudiant</th>
                <th className="text-left text-slate-400 font-medium text-sm px-6 py-4 hidden lg:table-cell">École</th>
                <th className="text-left text-slate-400 font-medium text-sm px-6 py-4 hidden md:table-cell">Ville</th>
                <th className="text-left text-slate-400 font-medium text-sm px-6 py-4">Niveau</th>
                <th className="text-left text-slate-400 font-medium text-sm px-6 py-4">Statut</th>
                <th className="text-right text-slate-400 font-medium text-sm px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
                </td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400">Aucun étudiant trouvé</td></tr>
              ) : students.map((student) => {
                const sc = statusConfig[student.status] || statusConfig.incomplete;
                const initials = (student.user_name || '??').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                return (
                <tr key={student.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{initials}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{student.user_name || 'Nom inconnu'}</p>
                        <p className="text-slate-400 text-sm">{student.user_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 hidden lg:table-cell">{student.school}</td>
                  <td className="px-6 py-4 text-slate-300 hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-slate-400" />
                      {student.city}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-slate-300">
                      <GraduationCap size={14} className="text-accent" />
                      {student.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${sc.color}`}>
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="p-2 rounded-lg hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                      {(student.status === 'pending' || student.status === 'incomplete') && (
                        <>
                          <button
                            onClick={() => handleApprove(student.id)}
                            disabled={actionLoading === student.id}
                            className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === student.id ? '...' : 'Valider'}
                          </button>
                          <button
                            onClick={() => handleReject(student.id)}
                            disabled={actionLoading === student.id}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          >
                            Rejeter
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700">
          <p className="text-slate-400 text-sm">
            Page <span className="text-white">{currentPage}</span> sur <span className="text-white">{totalPages || 1}</span> ({totalCount} étudiants)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button className="px-4 py-2 rounded-lg bg-accent text-white font-medium">{currentPage}</button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
          <div className="bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {(selectedStudent.user_name || '??').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{selectedStudent.user_name || 'Nom inconnu'}</h2>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${(statusConfig[selectedStudent.status] || statusConfig.incomplete).color}`}>
                  {(statusConfig[selectedStudent.status] || statusConfig.incomplete).label}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail size={18} className="text-slate-400" />
                {selectedStudent.user_email}
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <GraduationCap size={18} className="text-slate-400" />
                {selectedStudent.school} • {selectedStudent.level}
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin size={18} className="text-slate-400" />
                {selectedStudent.city}, {selectedStudent.country}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="flex-1 py-3 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-600 transition-colors"
              >
                Fermer
              </button>
              {(selectedStudent.status === 'pending' || selectedStudent.status === 'incomplete') && (
                <button
                  onClick={() => { handleApprove(selectedStudent.id); setSelectedStudent(null); }}
                  className="flex-1 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors"
                >
                  Valider l'inscription
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
