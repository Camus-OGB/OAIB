import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Download,
  Upload,
  Filter,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type Category = 'logic' | 'math' | 'programming' | 'ml' | 'general';

interface Question {
  id: string;
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  difficulty: Difficulty;
  category: Category;
  points: number;
  timeLimit: number; // seconds
  createdAt: string;
  usageCount: number;
}

const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'Si tous les A sont B, et tous les B sont C, alors :',
    options: [
      { id: 'a', text: 'Tous les C sont A', isCorrect: false },
      { id: 'b', text: 'Tous les A sont C', isCorrect: true },
      { id: 'c', text: 'Certains C ne sont pas A', isCorrect: false },
      { id: 'd', text: 'Aucun A n\'est C', isCorrect: false },
    ],
    difficulty: 'easy',
    category: 'logic',
    points: 5,
    timeLimit: 60,
    createdAt: '2026-01-10',
    usageCount: 245,
  },
  {
    id: '2',
    text: 'Complétez la suite : 2, 6, 12, 20, 30, ?',
    options: [
      { id: 'a', text: '40', isCorrect: false },
      { id: 'b', text: '42', isCorrect: true },
      { id: 'c', text: '44', isCorrect: false },
      { id: 'd', text: '46', isCorrect: false },
    ],
    difficulty: 'medium',
    category: 'math',
    points: 10,
    timeLimit: 90,
    createdAt: '2026-01-12',
    usageCount: 189,
  },
  {
    id: '3',
    text: 'Quel algorithme a une complexité O(n log n) pour le tri ?',
    options: [
      { id: 'a', text: 'Bubble Sort', isCorrect: false },
      { id: 'b', text: 'Quick Sort', isCorrect: true },
      { id: 'c', text: 'Selection Sort', isCorrect: false },
      { id: 'd', text: 'Insertion Sort', isCorrect: false },
    ],
    difficulty: 'hard',
    category: 'programming',
    points: 15,
    timeLimit: 120,
    createdAt: '2026-01-15',
    usageCount: 156,
  },
  {
    id: '4',
    text: 'Qu\'est-ce que le surapprentissage (overfitting) en Machine Learning ?',
    options: [
      { id: 'a', text: 'Le modèle ne peut pas apprendre', isCorrect: false },
      { id: 'b', text: 'Le modèle mémorise au lieu de généraliser', isCorrect: true },
      { id: 'c', text: 'Le modèle est trop simple', isCorrect: false },
      { id: 'd', text: 'Manque de données', isCorrect: false },
    ],
    difficulty: 'medium',
    category: 'ml',
    points: 10,
    timeLimit: 90,
    createdAt: '2026-01-18',
    usageCount: 203,
  },
];

const difficultyConfig = {
  easy: { label: 'Facile', className: 'bg-green-500/10 text-green-400' },
  medium: { label: 'Moyen', className: 'bg-yellow-500/10 text-yellow-400' },
  hard: { label: 'Difficile', className: 'bg-red-500/10 text-red-400' },
};

const categoryConfig = {
  logic: { label: 'Logique', className: 'bg-blue-500/10 text-blue-400' },
  math: { label: 'Mathématiques', className: 'bg-purple-500/10 text-purple-400' },
  programming: { label: 'Programmation', className: 'bg-orange-500/10 text-orange-400' },
  ml: { label: 'Machine Learning', className: 'bg-pink-500/10 text-pink-400' },
  general: { label: 'Culture IA', className: 'bg-cyan-500/10 text-cyan-400' },
};

interface QuestionFormData {
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  difficulty: Difficulty;
  category: Category;
  points: number;
  timeLimit: number;
}

const emptyFormData: QuestionFormData = {
  text: '',
  options: [
    { id: 'a', text: '', isCorrect: false },
    { id: 'b', text: '', isCorrect: false },
    { id: 'c', text: '', isCorrect: false },
    { id: 'd', text: '', isCorrect: false },
  ],
  difficulty: 'medium',
  category: 'logic',
  points: 10,
  timeLimit: 90,
};

const AdminQCM: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>(emptyFormData);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [qcmSettings, setQcmSettings] = useState({
    questionsPerExam: 20,
    totalDuration: 30, // minutes
    passingScore: 60, // percentage
    randomizeQuestions: true,
    showCorrectAnswers: false,
  });

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const stats = {
    total: questions.length,
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length,
  };

  const openCreateModal = () => {
    setEditingQuestion(null);
    setFormData(emptyFormData);
    setShowModal(true);
  };

  const openEditModal = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      text: question.text,
      options: question.options,
      difficulty: question.difficulty,
      category: question.category,
      points: question.points,
      timeLimit: question.timeLimit,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingQuestion) {
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, ...formData }
          : q
      ));
    } else {
      const newQuestion: Question = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        usageCount: 0,
      };
      setQuestions(prev => [...prev, newQuestion]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleDuplicate = (question: Question) => {
    const duplicate: Question = {
      ...question,
      id: Date.now().toString(),
      text: `${question.text} (copie)`,
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
    };
    setQuestions(prev => [...prev, duplicate]);
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...formData.options];
    newOptions[index].text = text;
    setFormData({ ...formData, options: newOptions });
  };

  const handleCorrectAnswerChange = (index: number) => {
    const newOptions = formData.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setFormData({ ...formData, options: newOptions });
  };

  const handleExport = () => {
    const data = JSON.stringify(questions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qcm_questions.json';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestion du QCM</h1>
          <p className="text-slate-400 mt-1">Banque de {stats.total} questions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-600 transition-colors"
          >
            <Settings size={18} />
            Paramètres
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-600 transition-colors"
          >
            <Download size={18} />
            Exporter
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors"
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

      {/* Filters */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
            />
          </div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'all')}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
          >
            <option value="all">Toutes difficultés</option>
            <option value="easy">Facile</option>
            <option value="medium">Moyen</option>
            <option value="hard">Difficile</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
          >
            <option value="all">Toutes catégories</option>
            <option value="logic">Logique</option>
            <option value="math">Mathématiques</option>
            <option value="programming">Programmation</option>
            <option value="ml">Machine Learning</option>
            <option value="general">Culture IA</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div key={question.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div 
              className="p-6 cursor-pointer hover:bg-slate-700/50 transition-colors"
              onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${difficultyConfig[question.difficulty].className}`}>
                      {difficultyConfig[question.difficulty].label}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${categoryConfig[question.category].className}`}>
                      {categoryConfig[question.category].label}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {question.points} pts • {question.timeLimit}s
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
                  {question.options.map((option) => (
                    <div 
                      key={option.id}
                      className={`p-3 rounded-xl ${
                        option.isCorrect 
                          ? 'bg-green-500/10 border border-green-500/30' 
                          : 'bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          option.isCorrect ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-300'
                        }`}>
                          {option.id.toUpperCase()}
                        </span>
                        <span className={option.isCorrect ? 'text-green-400' : 'text-slate-300'}>
                          {option.text}
                        </span>
                        {option.isCorrect && <CheckCircle size={16} className="text-green-400 ml-auto" />}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                  <span>Créée le {question.createdAt}</span>
                  <span>•</span>
                  <span>Utilisée {question.usageCount} fois</span>
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
                <label className="block text-slate-300 font-medium mb-2">Options de réponse *</label>
                <p className="text-slate-500 text-sm mb-3">Sélectionnez la bonne réponse</p>
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={option.id} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleCorrectAnswerChange(index)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                          option.isCorrect 
                            ? 'bg-green-500 text-white' 
                            : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                        }`}
                      >
                        {option.id.toUpperCase()}
                      </button>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
                        placeholder={`Option ${option.id.toUpperCase()}`}
                      />
                      {option.isCorrect && (
                        <CheckCircle size={20} className="text-green-400" />
                      )}
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
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                  >
                    <option value="logic">Logique</option>
                    <option value="math">Mathématiques</option>
                    <option value="programming">Programmation</option>
                    <option value="ml">Machine Learning</option>
                    <option value="general">Culture IA</option>
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
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 0 })}
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
                  disabled={!formData.text || formData.options.some(o => !o.text) || !formData.options.some(o => o.isCorrect)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  {editingQuestion ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Paramètres du QCM</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-2">Questions par épreuve</label>
                <input
                  type="number"
                  value={qcmSettings.questionsPerExam}
                  onChange={(e) => setQcmSettings({ ...qcmSettings, questionsPerExam: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-2">Durée totale (minutes)</label>
                <input
                  type="number"
                  value={qcmSettings.totalDuration}
                  onChange={(e) => setQcmSettings({ ...qcmSettings, totalDuration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-2">Score minimum de réussite (%)</label>
                <input
                  type="number"
                  value={qcmSettings.passingScore}
                  onChange={(e) => setQcmSettings({ ...qcmSettings, passingScore: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                  min={0}
                  max={100}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                <span className="text-slate-300">Ordre aléatoire des questions</span>
                <button
                  onClick={() => setQcmSettings({ ...qcmSettings, randomizeQuestions: !qcmSettings.randomizeQuestions })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    qcmSettings.randomizeQuestions ? 'bg-accent' : 'bg-slate-600'
                  }`}
                >
                  <span className={`block w-4 h-4 bg-white rounded-full transition-transform ${
                    qcmSettings.randomizeQuestions ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                <span className="text-slate-300">Afficher corrections après soumission</span>
                <button
                  onClick={() => setQcmSettings({ ...qcmSettings, showCorrectAnswers: !qcmSettings.showCorrectAnswers })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    qcmSettings.showCorrectAnswers ? 'bg-accent' : 'bg-slate-600'
                  }`}
                >
                  <span className={`block w-4 h-4 bg-white rounded-full transition-transform ${
                    qcmSettings.showCorrectAnswers ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors mt-4"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQCM;
