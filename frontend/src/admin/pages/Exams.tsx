import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  FileText,
  Users,
  Loader2,
  X,
  Save,
  Play,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  listExams,
  createExam,
  updateExam,
  deleteExam,
  listPhases,
  listQuestions,
} from '../../services/examService';
import type { Exam, Phase, Question } from '../../shared/types';
import ExamCountdown from '../../shared/components/ExamCountdown';

interface ExamFormData {
  title: string;
  description: string;
  phase: number;
  duration_minutes: number;
  questions_count: number;
  passing_score: number;
  randomize_questions: boolean;
  show_correct_answers: boolean;
  start_datetime: string;
  end_datetime: string;
  status: string;
  selected_questions: number[];
}

const emptyFormData: ExamFormData = {
  title: '',
  description: '',
  phase: 0,
  duration_minutes: 60,
  questions_count: 20,
  passing_score: 60,
  randomize_questions: true,
  show_correct_answers: false,
  start_datetime: '',
  end_datetime: '',
  status: 'draft',
  selected_questions: [],
};

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  draft: { label: 'Brouillon', className: 'bg-gray-500/10 text-gray-400', icon: FileText },
  published: { label: 'Publié', className: 'bg-green-500/10 text-green-400', icon: CheckCircle },
  started: { label: 'Démarré', className: 'bg-blue-500/10 text-blue-400', icon: Play },
  finished: { label: 'Terminé', className: 'bg-slate-500/10 text-slate-400', icon: AlertCircle },
};

const AdminExams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState<ExamFormData>(emptyFormData);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('page_size', String(itemsPerPage));
      if (searchQuery) params.set('search', searchQuery);
      if (selectedPhase !== 'all') params.set('phase', selectedPhase);
      if (selectedStatus !== 'all') params.set('status', selectedStatus);
      const res = await listExams(params.toString());
      if (res.ok) {
        setExams(res.data.results ?? []);
        setTotalCount(res.data.count ?? 0);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedPhase, selectedStatus]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  useEffect(() => {
    listPhases().then(res => {
      if (res.ok) setPhases(res.data.results ?? []);
    });
    listQuestions('page_size=1000&is_active=true').then(res => {
      if (res.ok) setQuestions(res.data.results ?? []);
    });
  }, []);

  const stats = {
    total: totalCount,
    draft: exams.filter(e => e.status === 'draft').length,
    published: exams.filter(e => e.status === 'published').length,
    finished: exams.filter(e => e.status === 'finished').length,
  };

  const openCreateModal = () => {
    setEditingExam(null);
    const now = new Date();
    const start = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 jours
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2h
    setFormData({
      ...emptyFormData,
      phase: phases[0]?.id || 0,
      start_datetime: start.toISOString().slice(0, 16),
      end_datetime: end.toISOString().slice(0, 16),
    });
    setShowModal(true);
  };

  const openEditModal = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description,
      phase: exam.phase,
      duration_minutes: exam.duration_minutes,
      questions_count: exam.questions_count,
      passing_score: exam.passing_score,
      randomize_questions: exam.randomize_questions,
      show_correct_answers: exam.show_correct_answers,
      start_datetime: new Date(exam.start_datetime).toISOString().slice(0, 16),
      end_datetime: new Date(exam.end_datetime).toISOString().slice(0, 16),
      status: exam.status,
      selected_questions: [],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.phase || !formData.start_datetime || !formData.end_datetime) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        phase: formData.phase,
        duration_minutes: formData.duration_minutes,
        questions_count: formData.questions_count,
        passing_score: formData.passing_score,
        randomize_questions: formData.randomize_questions,
        show_correct_answers: formData.show_correct_answers,
        start_datetime: new Date(formData.start_datetime).toISOString(),
        end_datetime: new Date(formData.end_datetime).toISOString(),
        status: formData.status,
      };

      if (editingExam) {
        await updateExam(editingExam.id, payload);
      } else {
        await createExam(payload);
      }
      setShowModal(false);
      fetchExams();
    } catch (err) {
      alert('Erreur lors de la sauvegarde de l\'épreuve.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'épreuve « ${title} » ?`)) return;
    try {
      await deleteExam(id);
      fetchExams();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestion des Épreuves</h1>
          <p className="text-slate-400 mt-1">{stats.total} épreuves au total</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors"
        >
          <Plus size={18} />
          Nouvelle épreuve
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <p className="text-3xl font-bold text-white">{stats.total}</p>
          <p className="text-slate-400 text-sm">Total épreuves</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <p className="text-3xl font-bold text-gray-400">{stats.draft}</p>
          <p className="text-slate-400 text-sm">Brouillons</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <p className="text-3xl font-bold text-green-400">{stats.published}</p>
          <p className="text-slate-400 text-sm">Publiées</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <p className="text-3xl font-bold text-slate-400">{stats.finished}</p>
          <p className="text-slate-400 text-sm">Terminées</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une épreuve..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
            />
          </div>
          <select
            value={selectedPhase}
            onChange={e => {
              setSelectedPhase(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
          >
            <option value="all">Toutes les phases</option>
            {phases.map(p => (
              <option key={p.id} value={String(p.id)}>
                {p.title}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={e => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
          >
            <option value="all">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="started">Démarré</option>
            <option value="finished">Terminé</option>
          </select>
        </div>
      </div>

      {/* Exams List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-12 text-slate-400">Aucune épreuve trouvée</div>
        ) : (
          exams.map(exam => {
            const statusInfo = statusConfig[exam.status] || statusConfig.draft;
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={exam.id}
                className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${statusInfo.className} flex items-center gap-1`}>
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </span>
                        <span className="text-slate-500 text-sm">{exam.phase_title}</span>
                      </div>
                      <h3 className="text-white font-bold text-lg">{exam.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{exam.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(exam)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(exam.id, exam.title)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Clock size={16} />
                      <span>{exam.duration_minutes} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <FileText size={16} />
                      <span>{exam.questions_count} questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Users size={16} />
                      <span>{exam.sessions_count || 0} sessions</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Calendar size={16} />
                      <span>Début: {new Date(exam.start_datetime).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Calendar size={16} />
                      <span>Fin: {new Date(exam.end_datetime).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  {/* Countdown */}
                  <ExamCountdown
                    startDateTime={exam.start_datetime}
                    endDateTime={exam.end_datetime}
                    variant="compact"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingExam ? 'Modifier l\'épreuve' : 'Nouvelle épreuve'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
                  placeholder="Ex: Épreuve de sélection Phase 1"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent resize-none"
                  rows={3}
                  placeholder="Description de l'épreuve..."
                />
              </div>

              {/* Phase & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Phase *</label>
                  <select
                    value={formData.phase}
                    onChange={e => setFormData({ ...formData, phase: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                  >
                    {phases.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Statut *</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="started">Démarré</option>
                    <option value="finished">Terminé</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Date/Heure de début *</label>
                  <input
                    type="datetime-local"
                    value={formData.start_datetime}
                    onChange={e => setFormData({ ...formData, start_datetime: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Date/Heure de fin *</label>
                  <input
                    type="datetime-local"
                    value={formData.end_datetime}
                    onChange={e => setFormData({ ...formData, end_datetime: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Durée (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                    min={10}
                    max={240}
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Nombre de questions</label>
                  <input
                    type="number"
                    value={formData.questions_count}
                    onChange={e => setFormData({ ...formData, questions_count: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                    min={5}
                    max={100}
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Score de passage (%)</label>
                  <input
                    type="number"
                    value={formData.passing_score}
                    onChange={e => setFormData({ ...formData, passing_score: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                    min={0}
                    max={100}
                  />
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.randomize_questions}
                    onChange={e => setFormData({ ...formData, randomize_questions: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-accent focus:ring-accent focus:ring-offset-slate-800"
                  />
                  <span className="text-slate-300">Ordre aléatoire des questions</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.show_correct_answers}
                    onChange={e => setFormData({ ...formData, show_correct_answers: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-accent focus:ring-accent focus:ring-offset-slate-800"
                  />
                  <span className="text-slate-300">Afficher les bonnes réponses après l'épreuve</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-slate-600 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.title || !formData.phase || !formData.start_datetime || !formData.end_datetime}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
                  {editingExam ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalCount > itemsPerPage && (
        <div className="flex items-center justify-between bg-slate-800 rounded-2xl border border-slate-700 p-4">
          <p className="text-slate-400 text-sm">
            Page {currentPage} sur {Math.ceil(totalCount / itemsPerPage)} ({totalCount} épreuves)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg disabled:opacity-50"
            >
              Préc.
            </button>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)}
              className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg disabled:opacity-50"
            >
              Suiv.
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExams;
