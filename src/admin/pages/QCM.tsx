import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Minus,
  Edit2,
  Trash2,
  Copy,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  CheckCircle,
  Settings,
  Loader2,
  FileSpreadsheet,
  FileJson,
  Tag
} from 'lucide-react';
import {
  listQuestions, listCategories, createQuestion, updateQuestion, deleteQuestion,
  createCategory, updateCategory, deleteCategory,
  exportQuestionsJSON, exportQuestionsExcel, importQuestionsJSON, importQuestionsExcel,
} from '../../services/examService';
import type { Question, QuestionCategory, Difficulty } from '../../shared/types';

const difficultyConfig: Record<string, { label: string; className: string }> = {
  easy: { label: 'Facile', className: 'bg-green-500/10 text-green-400' },
  medium: { label: 'Moyen', className: 'bg-yellow-500/10 text-yellow-400' },
  hard: { label: 'Difficile', className: 'bg-red-500/10 text-red-400' },
};

interface QuestionFormData {
  text: string;
  options: { text: string; is_correct: boolean; order: number }[];
  difficulty: Difficulty;
  category: number;
  points: number;
  time_limit_seconds: number;
}

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 8;

const emptyFormData: QuestionFormData = {
  text: '',
  options: [
    { text: '', is_correct: false, order: 1 },
    { text: '', is_correct: false, order: 2 },
  ],
  difficulty: 'medium',
  category: 0,
  points: 10,
  time_limit_seconds: 90,
};

const AdminQCM: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>(emptyFormData);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [importing, setImporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [importResult, setImportResult] = useState<{ created: number; errors: { index: number; error: string }[] } | null>(null);
  const importFileRef = React.useRef<HTMLInputElement>(null);
  const itemsPerPage = 20;

  // Category management state
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('page_size', String(itemsPerPage));
      if (searchQuery) params.set('search', searchQuery);
      if (selectedDifficulty !== 'all') params.set('difficulty', selectedDifficulty);
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      const res = await listQuestions(params.toString());
      if (res.ok) { setQuestions(res.data.results ?? []); setTotalCount(res.data.count ?? 0); }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [currentPage, searchQuery, selectedDifficulty, selectedCategory]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  useEffect(() => {
    listCategories().then(res => { if (res.ok) setCategories(Array.isArray(res.data) ? res.data : (res.data as any).results ?? []); });
  }, []);

  const refreshCategories = () => {
    listCategories().then(res => { if (res.ok) setCategories(Array.isArray(res.data) ? res.data : (res.data as any).results ?? []); });
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setSavingCategory(true);
    try {
      const res = await createCategory({ name: newCategoryName.trim() });
      if (res.ok) { setNewCategoryName(''); refreshCategories(); }
    } catch { /* ignore */ }
    finally { setSavingCategory(false); }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!editingCategoryName.trim()) return;
    setSavingCategory(true);
    try {
      const res = await updateCategory(id, { name: editingCategoryName.trim() });
      if (res.ok) { setEditingCategoryId(null); setEditingCategoryName(''); refreshCategories(); }
    } catch { /* ignore */ }
    finally { setSavingCategory(false); }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!confirm(`Supprimer la catégorie « ${name} » ? Les questions associées ne seront pas supprimées.`)) return;
    try { await deleteCategory(id); refreshCategories(); } catch { /* ignore */ }
  };

  const stats = {
    total: totalCount,
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length,
  };

  const openCreateModal = () => {
    setEditingQuestion(null);
    setFormData({ ...emptyFormData, category: categories[0]?.id || 0 });
    setShowModal(true);
  };

  const openEditModal = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      text: question.text,
      options: question.options.map(o => ({ text: o.text, is_correct: o.is_correct ?? false, order: o.order })),
      difficulty: question.difficulty,
      category: question.category,
      points: question.points,
      time_limit_seconds: question.time_limit_seconds ?? 90,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, {
          text: formData.text,
          difficulty: formData.difficulty,
          category: formData.category,
          points: formData.points,
          time_limit_seconds: formData.time_limit_seconds,
          options: formData.options as any,
        });
      } else {
        await createQuestion({
          text: formData.text,
          difficulty: formData.difficulty,
          category: formData.category,
          points: formData.points,
          time_limit_seconds: formData.time_limit_seconds,
          options: formData.options,
        });
      }
      setShowModal(false);
      fetchQuestions();
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) return;
    try { await deleteQuestion(id); fetchQuestions(); } catch { /* ignore */ }
  };

  const handleDuplicate = async (question: Question) => {
    try {
      await createQuestion({
        text: `${question.text} (copie)`,
        difficulty: question.difficulty,
        category: question.category,
        points: question.points,
        time_limit_seconds: question.time_limit_seconds ?? 90,
        options: question.options.map(o => ({ text: o.text, is_correct: o.is_correct ?? false, order: o.order })),
      });
      fetchQuestions();
    } catch { /* ignore */ }
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...formData.options];
    newOptions[index].text = text;
    setFormData({ ...formData, options: newOptions });
  };

  const handleCorrectAnswerChange = (index: number) => {
    const newOptions = formData.options.map((opt, i) => ({
      ...opt,
      is_correct: i === index,
    }));
    setFormData({ ...formData, options: newOptions });
  };

  const handleAddOption = () => {
    if (formData.options.length >= MAX_OPTIONS) return;
    setFormData({
      ...formData,
      options: [...formData.options, { text: '', is_correct: false, order: formData.options.length + 1 }],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length <= MIN_OPTIONS) return;
    const newOptions = formData.options
      .filter((_, i) => i !== index)
      .map((opt, i) => ({ ...opt, order: i + 1 }));
    // Si on supprime la bonne réponse, reset
    if (formData.options[index].is_correct && newOptions.length > 0) {
      newOptions[0].is_correct = true;
    }
    setFormData({ ...formData, options: newOptions });
  };

  const handleExportJSON = async () => {
    setShowExportMenu(false);
    try { await exportQuestionsJSON(); } catch { alert('Erreur lors de l\'export JSON.'); }
  };

  const handleExportExcel = async () => {
    setShowExportMenu(false);
    try { await exportQuestionsExcel(); } catch { alert('Erreur lors de l\'export Excel.'); }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    try {
      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
      const res = isExcel ? await importQuestionsExcel(file) : await importQuestionsJSON(file);
      if (res.data) {
        setImportResult(res.data);
        fetchQuestions();
      } else {
        alert(res.error?.message || 'Erreur lors de l\'import.');
      }
    } catch { alert('Erreur lors de l\'import.'); }
    finally { setImporting(false); if (importFileRef.current) importFileRef.current.value = ''; }
  };

  // Close export menu on outside click
  useEffect(() => {
    if (!showExportMenu) return;
    const handleClick = () => setShowExportMenu(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showExportMenu]);

  const getCategoryColor = (name: string) => {
    const colors: Record<string, string> = {
      logique: 'bg-blue-500/10 text-blue-400',
      mathématiques: 'bg-purple-500/10 text-purple-400',
      programmation: 'bg-orange-500/10 text-orange-400',
      'machine learning': 'bg-pink-500/10 text-pink-400',
    };
    return colors[name.toLowerCase()] || 'bg-cyan-500/10 text-cyan-400';
  };

  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestion du QCM</h1>
          <p className="text-slate-400 mt-1">Banque de {stats.total} questions</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Import */}
          <input
            ref={importFileRef}
            type="file"
            accept=".json,.xlsx,.xls"
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            onClick={() => importFileRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            {importing ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            Importer
          </button>
          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-600 transition-colors"
            >
              <Download size={18} />
              Exporter
              <ChevronDown size={14} />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-2 w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  <FileJson size={16} />
                  Export JSON
                </button>
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  <FileSpreadsheet size={16} />
                  Export Excel
                </button>
              </div>
            )}
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors"
          >
            <Plus size={18} />
            Nouvelle question
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <p className="text-3xl font-bold text-white">{stats.total}</p>
          <p className="text-slate-400 text-sm">Total questions</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <p className="text-3xl font-bold text-green-400">{stats.easy}</p>
          <p className="text-slate-400 text-sm">Faciles</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <p className="text-3xl font-bold text-yellow-400">{stats.medium}</p>
          <p className="text-slate-400 text-sm">Moyennes</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <p className="text-3xl font-bold text-red-400">{stats.hard}</p>
          <p className="text-slate-400 text-sm">Difficiles</p>
        </div>
      </div>

      {/* Import result banner */}
      {importResult && (
        <div className={`rounded-xl border p-4 flex items-center justify-between ${importResult.errors.length > 0 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
          <div>
            <p className="text-white font-medium">
              <CheckCircle size={16} className="inline mr-2 text-green-400" />
              {importResult.created} question{importResult.created > 1 ? 's' : ''} importée{importResult.created > 1 ? 's' : ''} avec succès.
            </p>
            {importResult.errors.length > 0 && (
              <p className="text-yellow-400 text-sm mt-1">
                {importResult.errors.length} erreur{importResult.errors.length > 1 ? 's' : ''} :
                {importResult.errors.slice(0, 3).map(e => ` Ligne ${e.index + 1}: ${e.error}`).join(';')}
                {importResult.errors.length > 3 && '…'}
              </p>
            )}
          </div>
          <button onClick={() => setImportResult(null)} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Category Management Panel */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <button
          onClick={() => setShowCategoryPanel(!showCategoryPanel)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Tag size={20} className="text-accent" />
            <span className="text-white font-semibold">Catégories</span>
            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{categories.length}</span>
          </div>
          {showCategoryPanel ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </button>

        {showCategoryPanel && (
          <div className="px-6 pb-6 border-t border-slate-700">
            {/* Add new category */}
            <div className="flex gap-3 mt-4 mb-5">
              <input
                type="text"
                placeholder="Nom de la nouvelle catégorie…"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateCategory()}
                className="flex-1 px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
              />
              <button
                onClick={handleCreateCategory}
                disabled={!newCategoryName.trim() || savingCategory}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {savingCategory ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Ajouter
              </button>
            </div>

            {/* Category list */}
            {categories.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">Aucune catégorie. Ajoutez-en une ci-dessus.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center gap-3 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 group">
                    {editingCategoryId === cat.id ? (
                      <>
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={e => setEditingCategoryName(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleUpdateCategory(cat.id); if (e.key === 'Escape') setEditingCategoryId(null); }}
                          className="flex-1 px-3 py-1.5 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateCategory(cat.id)}
                          disabled={savingCategory}
                          className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                          title="Enregistrer"
                        >
                          {savingCategory ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        </button>
                        <button
                          onClick={() => setEditingCategoryId(null)}
                          className="p-1.5 text-slate-400 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Annuler"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-white text-sm font-medium truncate">{cat.name}</span>
                        <span className="text-xs text-slate-400 bg-slate-600 px-2 py-0.5 rounded-full flex-shrink-0">
                          {cat.questions_count} Q
                        </span>
                        <button
                          onClick={() => { setEditingCategoryId(cat.id); setEditingCategoryName(cat.name); }}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Renommer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
            />
          </div>
          <select
            value={selectedDifficulty}
            onChange={(e) => { setSelectedDifficulty(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
          >
            <option value="all">Toutes difficultés</option>
            <option value="easy">Facile</option>
            <option value="medium">Moyen</option>
            <option value="hard">Difficile</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
          >
            <option value="all">Toutes catégories</option>
            {categories.map(cat => (
              <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">Aucune question trouvée</div>
        ) : questions.map((question) => (
          <div key={question.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div 
              className="p-6 cursor-pointer hover:bg-slate-700/50 transition-colors"
              onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${(difficultyConfig[question.difficulty] || difficultyConfig.medium).className}`}>
                      {(difficultyConfig[question.difficulty] || difficultyConfig.medium).label}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getCategoryColor(question.category_name)}`}>
                      {question.category_name}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {question.points} pts • {question.time_limit_seconds ?? '-'}s
                    </span>
                  </div>
                  <p className="text-white font-medium">{question.text}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEditModal(question); }}
                    className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDuplicate(question); }}
                    className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(question.id); }}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedQuestion === question.id ? (
                    <ChevronUp className="text-slate-400" size={20} />
                  ) : (
                    <ChevronDown className="text-slate-400" size={20} />
                  )}
                </div>
              </div>
            </div>

            {expandedQuestion === question.id && (
              <div className="px-6 pb-6 border-t border-slate-700 pt-4">
                <p className="text-slate-400 text-sm mb-3">Options de réponse :</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {question.options.map((option, idx) => (
                    <div 
                      key={option.id}
                      className={`p-3 rounded-xl ${
                        option.is_correct 
                          ? 'bg-green-500/10 border border-green-500/30' 
                          : 'bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          option.is_correct ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-300'
                        }`}>
                          {optionLabels[idx] || idx + 1}
                        </span>
                        <span className={option.is_correct ? 'text-green-400' : 'text-slate-300'}>
                          {option.text}
                        </span>
                        {option.is_correct && <CheckCircle size={16} className="text-green-400 ml-auto" />}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                  <span>Créée le {new Date(question.created_at).toLocaleDateString('fr-FR')}</span>
                  <span>•</span>
                  <span>Utilisée {question.usage_count} fois</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingQuestion ? 'Modifier la question' : 'Nouvelle question'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Question text */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">Énoncé de la question *</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent resize-none"
                  rows={3}
                  placeholder="Entrez l'énoncé de la question..."
                />
              </div>

              {/* Options */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-300 font-medium">Options de réponse * ({formData.options.length})</label>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    disabled={formData.options.length >= MAX_OPTIONS}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-lg hover:bg-accent/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus size={14} />
                    Ajouter une option
                  </button>
                </div>
                <p className="text-slate-500 text-sm mb-3">Cliquez sur la lettre pour marquer la bonne réponse. Min {MIN_OPTIONS}, max {MAX_OPTIONS} options.</p>
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleCorrectAnswerChange(index)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors flex-shrink-0 ${
                          option.is_correct 
                            ? 'bg-green-500 text-white' 
                            : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                        }`}
                      >
                        {optionLabels[index] || index + 1}
                      </button>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
                        placeholder={`Option ${optionLabels[index] || index + 1}`}
                      />
                      {option.is_correct && (
                        <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        disabled={formData.options.length <= MIN_OPTIONS}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-20 disabled:cursor-not-allowed flex-shrink-0"
                        title="Supprimer cette option"
                      >
                        <Minus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Difficulté</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                  >
                    <option value="easy">Facile</option>
                    <option value="medium">Moyen</option>
                    <option value="hard">Difficile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Points</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                    min={1}
                    max={100}
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Temps (sec)</label>
                  <input
                    type="number"
                    value={formData.time_limit_seconds}
                    onChange={(e) => setFormData({ ...formData, time_limit_seconds: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                    min={10}
                    max={600}
                  />
                </div>
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
                  disabled={saving || !formData.text || formData.options.some(o => !o.text) || !formData.options.some(o => o.is_correct)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
                  {editingQuestion ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalCount > itemsPerPage && (
        <div className="flex items-center justify-between bg-slate-800 rounded-2xl border border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Page {currentPage} sur {Math.ceil(totalCount / itemsPerPage)} ({totalCount} questions)</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg disabled:opacity-50">Préc.</button>
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)} className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg disabled:opacity-50">Suiv.</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQCM;
