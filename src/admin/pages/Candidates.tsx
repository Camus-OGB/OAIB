import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  School,
  Mail,
  Phone,
  FileText,
  User,
  X,
  MessageSquare,
  AlertCircle,
  Loader2,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { listCandidates, approveCandidate, rejectCandidate } from '../../services/candidateService';
import type { CandidateProfile, CandidateStatus, CandidateDocument } from '../../shared/types';

const regions = ['Tous', 'Littoral', 'Ouémé', 'Atlantique', 'Borgou', 'Atacora', 'Zou', 'Collines', 'Mono', 'Couffo', 'Plateau', 'Alibori', 'Donga'];
const statuses = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Validé' },
  { value: 'rejected', label: 'Rejeté' },
  { value: 'incomplete', label: 'Incomplet' },
];

const getStatusConfig = (status: CandidateStatus) => {
  const config: Record<string, { label: string; icon: React.ElementType; className: string }> = {
    pending: { label: 'En attente', icon: Clock, className: 'bg-yellow-500/10 text-yellow-400' },
    approved: { label: 'Validé', icon: CheckCircle, className: 'bg-green-500/10 text-green-400' },
    rejected: { label: 'Rejeté', icon: XCircle, className: 'bg-red-500/10 text-red-400' },
    incomplete: { label: 'Incomplet', icon: AlertCircle, className: 'bg-orange-500/10 text-orange-400' },
  };
  return config[status] || config.incomplete;
};

const AdminCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Tous');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationAction, setValidationAction] = useState<'approve' | 'reject'>('approve');
  const [validationComment, setValidationComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [validating, setValidating] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<CandidateDocument | null>(null);
  const itemsPerPage = 10;

  const getInitials = (name: string | undefined | null): string => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('page_size', String(itemsPerPage));
      if (searchQuery) params.set('search', searchQuery);
      if (selectedStatus !== 'all') params.set('status', selectedStatus);
      if (selectedRegion !== 'Tous') params.set('region', selectedRegion);
      const res = await listCandidates(params.toString());
      if (res.ok) {
        setCandidates(res.data.results ?? []);
        setTotalCount(res.data.count ?? 0);
      } else {
        console.error('Erreur chargement candidats:', res.error);
        setCandidates([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Exception chargement candidats:', err);
      setCandidates([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedStatus, selectedRegion]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleExport = () => {
    alert('Export CSV en cours de développement');
  };

  const openValidationModal = (candidate: CandidateProfile, action: 'approve' | 'reject') => {
    setSelectedCandidate(candidate);
    setValidationAction(action);
    setValidationComment('');
    setShowValidationModal(true);
  };

  const handleValidation = async () => {
    if (!selectedCandidate) return;
    setValidating(true);
    try {
      const res = validationAction === 'approve'
        ? await approveCandidate(selectedCandidate.id)
        : await rejectCandidate(selectedCandidate.id, validationComment);

      if (res.ok) {
        setShowValidationModal(false);
        setSelectedCandidate(null);
        fetchCandidates();
      } else {
        console.error('Erreur validation:', res.error);
      }
    } catch { /* ignore */ }
    finally { setValidating(false); }
  };

  const canValidate = (status: CandidateStatus) => status === 'pending' || status === 'incomplete';

  const getDocUrl = (doc: CandidateDocument) => doc.file_url || doc.file;

  const isPdf = (doc: CandidateDocument) => {
    const url = getDocUrl(doc) || '';
    return url.toLowerCase().includes('.pdf') || doc.name?.toLowerCase().endsWith('.pdf');
  };

  const isImage = (doc: CandidateDocument) => {
    const url = getDocUrl(doc) || '';
    const name = doc.name?.toLowerCase() || '';
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)($|\?)/.test(url.toLowerCase()) ||
           /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/.test(name);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestion des Candidatures</h1>
          <p className="text-slate-400 mt-1">{totalCount} candidat(s) trouvé(s)</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors"
        >
          <Download size={18} />
          Exporter CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, école..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
            />
          </div>
          <select
            value={selectedRegion}
            onChange={(e) => { setSelectedRegion(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
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
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">École</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Région</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Notes</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Complétion</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Statut</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
                </td></tr>
              ) : candidates.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-slate-400">Aucun candidat trouvé</td></tr>
              ) : candidates.map((candidate) => {
                const statusConfig = getStatusConfig(candidate.status);
                const initials = getInitials(candidate.user_name);
                return (
                  <tr key={candidate.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-sm">
                          {initials}
                        </div>
                        <div>
                          <p className="text-white font-medium">{candidate.user_name || 'Nom inconnu'}</p>
                          <p className="text-slate-400 text-sm">{candidate.user_email || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-white">{candidate.school || '-'}</p>
                      <p className="text-slate-400 text-sm">{candidate.level || '-'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-300">{candidate.region || '-'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <p className="text-white">Moy: {candidate.average_grade ?? '-'}/20</p>
                        <p className="text-slate-400">M: {candidate.math_grade ?? '-'} | S: {candidate.science_grade ?? '-'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${candidate.profile_completion}%` }}
                          />
                        </div>
                        <span className="text-slate-300 text-sm">{candidate.profile_completion}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.className}`}>
                        <statusConfig.icon size={12} />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCandidate(candidate)}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white"
                          title="Voir détails"
                        >
                          <Eye size={18} />
                        </button>
                        {canValidate(candidate.status) && (
                          <>
                            <button
                              onClick={() => openValidationModal(candidate, 'approve')}
                              className="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-green-400"
                              title="Valider"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => openValidationModal(candidate, 'reject')}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                              title="Rejeter"
                            >
                              <XCircle size={18} />
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
        <div className="flex items-center justify-between p-4 border-t border-slate-700">
          <p className="text-slate-400 text-sm">
            Page {currentPage} sur {totalPages || 1}
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
              disabled={currentPage >= totalPages}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && !showValidationModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCandidate(null)}>
          <div className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-slate-800 flex items-center justify-between p-6 border-b border-slate-700 z-10">
              <h2 className="text-xl font-bold text-white">Détails du candidat</h2>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center text-white text-xl font-bold">
                  {getInitials(selectedCandidate.user_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white">
                    {selectedCandidate.user_name || 'Nom inconnu'}
                  </h3>
                  <p className="text-slate-400">Inscrit le {new Date(selectedCandidate.registered_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex-shrink-0">
                  {(() => {
                    const config = getStatusConfig(selectedCandidate.status);
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ${config.className}`}>
                        <config.icon size={16} />
                        {config.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Profile completion */}
              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Complétion du profil</span>
                  <span className="text-white font-bold">{selectedCandidate.profile_completion}%</span>
                </div>
                <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${selectedCandidate.profile_completion}%` }}
                  />
                </div>
              </div>

              {/* Contact info */}
              <div>
                <h4 className="text-white font-bold mb-3">Informations de contact</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Mail size={18} className="text-slate-500 flex-shrink-0" />
                    <span className="truncate">{selectedCandidate.user_email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone size={18} className="text-slate-500 flex-shrink-0" />
                    {selectedCandidate.user_phone || '-'}
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin size={18} className="text-slate-500 flex-shrink-0" />
                    {[selectedCandidate.city, selectedCandidate.region].filter(Boolean).join(', ') || '-'}
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <User size={18} className="text-slate-500 flex-shrink-0" />
                    {selectedCandidate.country || '-'}
                  </div>
                  {selectedCandidate.birth_date && (
                    <div className="flex items-center gap-3 text-slate-300">
                      <Calendar size={18} className="text-slate-500 flex-shrink-0" />
                      {selectedCandidate.birth_date}
                    </div>
                  )}
                </div>
              </div>

              {/* Tutor info */}
              {selectedCandidate.tutor_info && (selectedCandidate.tutor_info.first_name || selectedCandidate.tutor_info.last_name) && (
                <div>
                  <h4 className="text-white font-bold mb-3">Tuteur légal</h4>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-slate-300">
                        <User size={18} className="text-slate-500 flex-shrink-0" />
                        {selectedCandidate.tutor_info.first_name} {selectedCandidate.tutor_info.last_name}
                      </div>
                      <div className="flex items-center gap-3 text-slate-300">
                        <Phone size={18} className="text-slate-500 flex-shrink-0" />
                        {selectedCandidate.tutor_info.phone || '-'}
                      </div>
                      {selectedCandidate.tutor_info.email && (
                        <div className="flex items-center gap-3 text-slate-300">
                          <Mail size={18} className="text-slate-500 flex-shrink-0" />
                          {selectedCandidate.tutor_info.email}
                        </div>
                      )}
                      {selectedCandidate.tutor_info.relationship && (
                        <div className="flex items-center gap-3 text-slate-300">
                          <MessageSquare size={18} className="text-slate-500 flex-shrink-0" />
                          {selectedCandidate.tutor_info.relationship}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* School info */}
              <div>
                <h4 className="text-white font-bold mb-3">Informations scolaires</h4>
                <div className="bg-slate-700/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <School size={18} className="text-slate-500" />
                    <span className="text-white">{selectedCandidate.school || '-'}</span>
                    {selectedCandidate.level && <span className="text-slate-400">• {selectedCandidate.level}</span>}
                    {selectedCandidate.class_name && <span className="text-slate-400">• {selectedCandidate.class_name}</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-600">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent">{selectedCandidate.average_grade ?? '-'}</p>
                      <p className="text-slate-400 text-sm">Moyenne</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{selectedCandidate.math_grade ?? '-'}</p>
                      <p className="text-slate-400 text-sm">Maths</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">{selectedCandidate.science_grade ?? '-'}</p>
                      <p className="text-slate-400 text-sm">Sciences</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-white font-bold mb-3">Documents ({selectedCandidate.documents?.length ?? 0})</h4>
                <div className="space-y-2">
                  {(selectedCandidate.documents ?? []).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <FileText size={18} className="text-red-400 flex-shrink-0" />
                        <span className="text-slate-300 truncate">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="text-accent hover:underline text-sm font-medium"
                        >
                          Voir
                        </button>
                        <a
                          href={getDocUrl(doc)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-white"
                          title="Ouvrir dans un nouvel onglet"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  ))}
                  {(!selectedCandidate.documents || selectedCandidate.documents.length === 0) && (
                    <p className="text-slate-500 text-sm">Aucun document</p>
                  )}
                </div>
              </div>

              {/* Admin comment */}
              {selectedCandidate.admin_comment && (
                <div>
                  <h4 className="text-white font-bold mb-3">Commentaire admin</h4>
                  <p className="text-slate-300 bg-slate-700/50 rounded-xl p-4">{selectedCandidate.admin_comment}</p>
                </div>
              )}

              {/* Actions */}
              {canValidate(selectedCandidate.status) && (
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => {
                      const c = selectedCandidate;
                      setSelectedCandidate(null);
                      setTimeout(() => openValidationModal(c, 'approve'), 100);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500/20 text-green-400 font-bold rounded-xl hover:bg-green-500/30 transition-colors"
                  >
                    <CheckCircle size={18} />
                    Valider le dossier
                  </button>
                  <button
                    onClick={() => {
                      const c = selectedCandidate;
                      setSelectedCandidate(null);
                      setTimeout(() => openValidationModal(c, 'reject'), 100);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/30 transition-colors"
                  >
                    <XCircle size={18} />
                    Rejeter le dossier
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4" onClick={() => setPreviewDoc(null)}>
          <div className="bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <FileText size={20} className="text-red-400 flex-shrink-0" />
                <h3 className="text-white font-bold truncate">{previewDoc.name}</h3>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={getDocUrl(previewDoc)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent/90 transition-colors"
                >
                  <ExternalLink size={14} />
                  Ouvrir
                </a>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden min-h-0">
              {isPdf(previewDoc) ? (
                <iframe
                  src={getDocUrl(previewDoc)}
                  className="w-full h-full min-h-[70vh]"
                  title={previewDoc.name}
                />
              ) : isImage(previewDoc) ? (
                <div className="flex items-center justify-center p-6 h-full overflow-auto">
                  <img
                    src={getDocUrl(previewDoc)}
                    alt={previewDoc.name}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <FileText size={48} className="text-slate-500 mb-4" />
                  <p className="text-slate-300 mb-2">Aperçu non disponible pour ce type de fichier</p>
                  <p className="text-slate-500 text-sm mb-6">{previewDoc.name}</p>
                  <a
                    href={getDocUrl(previewDoc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors"
                  >
                    <Download size={16} />
                    Télécharger le fichier
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Validation Modal */}
      {showValidationModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowValidationModal(false)}>
          <div className="bg-slate-800 rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {validationAction === 'approve' ? 'Valider' : 'Rejeter'} la candidature
              </h2>
              <p className="text-slate-400 mt-1">
                {selectedCandidate.user_name || 'Nom inconnu'}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  <MessageSquare size={16} className="inline mr-2" />
                  Commentaire {validationAction === 'reject' && '(obligatoire)'}
                </label>
                <textarea
                  value={validationComment}
                  onChange={(e) => setValidationComment(e.target.value)}
                  placeholder={validationAction === 'approve' 
                    ? 'Commentaire optionnel...' 
                    : 'Raison du rejet...'}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowValidationModal(false)}
                  className="flex-1 py-3 border border-slate-600 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleValidation}
                  disabled={(validationAction === 'reject' && !validationComment.trim()) || validating}
                  className={`flex-1 py-3 font-bold rounded-xl transition-colors disabled:opacity-50 ${
                    validationAction === 'approve'
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  {validating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : validationAction === 'approve' ? 'Valider' : 'Rejeter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCandidates;
