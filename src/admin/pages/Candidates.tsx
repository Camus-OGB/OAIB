import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  MoreVertical,
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
  AlertCircle
} from 'lucide-react';

type CandidateStatus = 'pending' | 'approved' | 'rejected' | 'incomplete';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  city: string;
  region: string;
  school: string;
  level: string;
  averageGrade: number;
  mathGrade: number;
  scienceGrade: number;
  qcmScore: number | null;
  status: CandidateStatus;
  registrationDate: string;
  documentsCount: number;
  profileCompletion: number;
}

const mockCandidates: Candidate[] = [
  {
    id: '1',
    firstName: 'Koffi',
    lastName: 'Mensah',
    email: 'koffi.mensah@email.com',
    phone: '+229 97 00 00 01',
    birthDate: '2008-03-15',
    city: 'Cotonou',
    region: 'Littoral',
    school: 'Lycée Béhanzin',
    level: 'Terminale D',
    averageGrade: 16.5,
    mathGrade: 18,
    scienceGrade: 17,
    qcmScore: 85,
    status: 'approved',
    registrationDate: '2026-01-15',
    documentsCount: 3,
    profileCompletion: 100,
  },
  {
    id: '2',
    firstName: 'Afi',
    lastName: 'Dossou',
    email: 'afi.dossou@email.com',
    phone: '+229 96 00 00 02',
    birthDate: '2009-07-22',
    city: 'Porto-Novo',
    region: 'Ouémé',
    school: 'CEG Les Pylônes',
    level: 'Première C',
    averageGrade: 15.2,
    mathGrade: 16,
    scienceGrade: 15,
    qcmScore: 72,
    status: 'pending',
    registrationDate: '2026-01-18',
    documentsCount: 2,
    profileCompletion: 85,
  },
  {
    id: '3',
    firstName: 'Yao',
    lastName: 'Agbessi',
    email: 'yao.agbessi@email.com',
    phone: '+229 95 00 00 03',
    birthDate: '2008-11-08',
    city: 'Parakou',
    region: 'Borgou',
    school: 'Lycée Mathieu Bouké',
    level: 'Terminale C',
    averageGrade: 14.8,
    mathGrade: 15,
    scienceGrade: 14,
    qcmScore: null,
    status: 'incomplete',
    registrationDate: '2026-01-20',
    documentsCount: 1,
    profileCompletion: 60,
  },
  {
    id: '4',
    firstName: 'Adjoa',
    lastName: 'Houénou',
    email: 'adjoa.h@email.com',
    phone: '+229 94 00 00 04',
    birthDate: '2009-02-14',
    city: 'Abomey-Calavi',
    region: 'Atlantique',
    school: 'CS Sainte Rita',
    level: 'Terminale D',
    averageGrade: 17.2,
    mathGrade: 19,
    scienceGrade: 18,
    qcmScore: 92,
    status: 'approved',
    registrationDate: '2026-01-12',
    documentsCount: 3,
    profileCompletion: 100,
  },
  {
    id: '5',
    firstName: 'Kossi',
    lastName: 'Tossou',
    email: 'kossi.t@email.com',
    phone: '+229 93 00 00 05',
    birthDate: '2008-09-30',
    city: 'Natitingou',
    region: 'Atacora',
    school: 'Lycée de Natitingou',
    level: 'Première D',
    averageGrade: 13.5,
    mathGrade: 12,
    scienceGrade: 14,
    qcmScore: 58,
    status: 'rejected',
    registrationDate: '2026-01-25',
    documentsCount: 2,
    profileCompletion: 90,
  },
];

const regions = ['Tous', 'Littoral', 'Ouémé', 'Atlantique', 'Borgou', 'Atacora', 'Zou', 'Collines', 'Mono', 'Couffo', 'Plateau', 'Alibori', 'Donga'];
const statuses = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Validé' },
  { value: 'rejected', label: 'Rejeté' },
  { value: 'incomplete', label: 'Incomplet' },
];

const getStatusConfig = (status: CandidateStatus) => {
  const config = {
    pending: { label: 'En attente', icon: Clock, className: 'bg-yellow-500/10 text-yellow-400' },
    approved: { label: 'Validé', icon: CheckCircle, className: 'bg-green-500/10 text-green-400' },
    rejected: { label: 'Rejeté', icon: XCircle, className: 'bg-red-500/10 text-red-400' },
    incomplete: { label: 'Incomplet', icon: AlertCircle, className: 'bg-orange-500/10 text-orange-400' },
  };
  return config[status];
};

const AdminCandidates: React.FC = () => {
  const [candidates] = useState<Candidate[]>(mockCandidates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Tous');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationAction, setValidationAction] = useState<'approve' | 'reject'>('approve');
  const [validationComment, setValidationComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = 
      c.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.school.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'Tous' || c.region === selectedRegion;
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log('Exporting candidates...');
    alert('Export CSV en cours de développement');
  };

  const openValidationModal = (candidate: Candidate, action: 'approve' | 'reject') => {
    setSelectedCandidate(candidate);
    setValidationAction(action);
    setValidationComment('');
    setShowValidationModal(true);
  };

  const handleValidation = () => {
    // TODO: Implement validation logic
    console.log(`${validationAction} candidate ${selectedCandidate?.id} with comment: ${validationComment}`);
    setShowValidationModal(false);
    setSelectedCandidate(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestion des Candidatures</h1>
          <p className="text-slate-400 mt-1">{filteredCandidates.length} candidat(s) trouvé(s)</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors"
        >
          <Download size={18} />
          Exporter CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, école..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Region filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
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
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">QCM</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Statut</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {paginatedCandidates.map((candidate) => {
                const statusConfig = getStatusConfig(candidate.status);
                return (
                  <tr key={candidate.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold">
                          {candidate.firstName[0]}{candidate.lastName[0]}
                        </div>
                        <div>
                          <p className="text-white font-medium">{candidate.firstName} {candidate.lastName}</p>
                          <p className="text-slate-400 text-sm">{candidate.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-white">{candidate.school}</p>
                      <p className="text-slate-400 text-sm">{candidate.level}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-300">{candidate.region}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <p className="text-white">Moy: {candidate.averageGrade}/20</p>
                        <p className="text-slate-400">M: {candidate.mathGrade} | S: {candidate.scienceGrade}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {candidate.qcmScore !== null ? (
                        <span className={`font-bold ${candidate.qcmScore >= 70 ? 'text-green-400' : candidate.qcmScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {candidate.qcmScore}%
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
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
                        {candidate.status === 'pending' && (
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

      {/* Candidate Detail Modal */}
      {selectedCandidate && !showValidationModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 flex items-center justify-between p-6 border-b border-slate-700">
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
                  {selectedCandidate.firstName[0]}{selectedCandidate.lastName[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedCandidate.firstName} {selectedCandidate.lastName}
                  </h3>
                  <p className="text-slate-400">Inscrit le {new Date(selectedCandidate.registrationDate).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="ml-auto">
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
                  <span className="text-white font-bold">{selectedCandidate.profileCompletion}%</span>
                </div>
                <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${selectedCandidate.profileCompletion}%` }}
                  />
                </div>
              </div>

              {/* Contact info */}
              <div>
                <h4 className="text-white font-bold mb-3">Informations de contact</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Mail size={18} className="text-slate-500" />
                    {selectedCandidate.email}
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone size={18} className="text-slate-500" />
                    {selectedCandidate.phone}
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin size={18} className="text-slate-500" />
                    {selectedCandidate.city}, {selectedCandidate.region}
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <User size={18} className="text-slate-500" />
                    Né le {new Date(selectedCandidate.birthDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>

              {/* School info */}
              <div>
                <h4 className="text-white font-bold mb-3">Informations scolaires</h4>
                <div className="bg-slate-700/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <School size={18} className="text-slate-500" />
                    <span className="text-white">{selectedCandidate.school}</span>
                    <span className="text-slate-400">• {selectedCandidate.level}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-600">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent">{selectedCandidate.averageGrade}</p>
                      <p className="text-slate-400 text-sm">Moyenne</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{selectedCandidate.mathGrade}</p>
                      <p className="text-slate-400 text-sm">Maths</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">{selectedCandidate.scienceGrade}</p>
                      <p className="text-slate-400 text-sm">Sciences</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-white font-bold mb-3">Documents ({selectedCandidate.documentsCount})</h4>
                <div className="space-y-2">
                  {['Bulletin T1', 'Bulletin T2', 'Certificat scolarité'].slice(0, selectedCandidate.documentsCount).map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-red-400" />
                        <span className="text-slate-300">{doc}.pdf</span>
                      </div>
                      <button className="text-accent hover:underline text-sm">Voir</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {selectedCandidate.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => {
                      setSelectedCandidate(null);
                      openValidationModal(selectedCandidate, 'approve');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500/20 text-green-400 font-bold rounded-xl hover:bg-green-500/30 transition-colors"
                  >
                    <CheckCircle size={18} />
                    Valider le dossier
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCandidate(null);
                      openValidationModal(selectedCandidate, 'reject');
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

      {/* Validation Modal */}
      {showValidationModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {validationAction === 'approve' ? 'Valider' : 'Rejeter'} la candidature
              </h2>
              <p className="text-slate-400 mt-1">
                {selectedCandidate.firstName} {selectedCandidate.lastName}
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
                  disabled={validationAction === 'reject' && !validationComment.trim()}
                  className={`flex-1 py-3 font-bold rounded-xl transition-colors disabled:opacity-50 ${
                    validationAction === 'approve'
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  {validationAction === 'approve' ? 'Valider' : 'Rejeter'}
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
