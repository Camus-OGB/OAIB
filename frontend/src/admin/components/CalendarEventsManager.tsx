import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  CheckCircle,
} from 'lucide-react';

interface CalendarEvent {
  id?: number;
  month: string;
  date: string;
  title: string;
  description: string;
  color: string;
  display_order: number;
}

const colorOptions = [
  { value: 'bg-primary', label: 'Primaire (Bleu foncé)' },
  { value: 'bg-primary-light', label: 'Bleu clair' },
  { value: 'bg-accent', label: 'Accent (Vert)' },
  { value: 'bg-accent-dark', label: 'Vert foncé' },
  { value: 'bg-benin-yellow', label: 'Jaune Bénin' },
  { value: 'bg-benin-red', label: 'Rouge Bénin' },
  { value: 'bg-benin-green', label: 'Vert Bénin' },
];

const monthOptions = [
  'JANVIER', 'FEVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
  'JUILLET', 'AOUT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DECEMBRE',
];

const emptyEvent: CalendarEvent = {
  month: 'JANVIER',
  date: '01',
  title: '',
  description: '',
  color: 'bg-primary',
  display_order: 0,
};

const CalendarEventsManager: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CalendarEvent>(emptyEvent);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      // TODO: Remplacer par l'appel API réel
      const stored = localStorage.getItem('oaib_calendar_events');
      if (stored) {
        setEvents(JSON.parse(stored));
      } else {
        // Valeurs par défaut
        const defaultEvents: CalendarEvent[] = [
          { id: 1, month: 'JANVIER', date: '15', title: 'Ouverture Inscriptions', description: 'Début de la période d\'inscription en ligne', color: 'bg-primary', display_order: 1 },
          { id: 2, month: 'FEVRIER', date: '28', title: 'Clôture Inscriptions', description: 'Date limite pour soumettre votre candidature', color: 'bg-accent-dark', display_order: 2 },
          { id: 3, month: 'MARS', date: '01-31', title: 'Formation en Ligne', description: 'Accès aux modules de formation IA', color: 'bg-accent', display_order: 3 },
          { id: 4, month: 'AVRIL', date: '05', title: 'Examens Préliminaires', description: 'Tests en ligne de logique et programmation', color: 'bg-primary-light', display_order: 4 },
          { id: 5, month: 'MAI', date: '10', title: 'Fin Qualificatifs', description: 'Dernier jour des événements régionaux', color: 'bg-benin-yellow', display_order: 5 },
          { id: 6, month: 'JUIN', date: '15-16', title: 'Grande Finale', description: 'Hackathon 24h à Cotonou', color: 'bg-benin-red', display_order: 6 },
        ];
        setEvents(defaultEvents);
        localStorage.setItem('oaib_calendar_events', JSON.stringify(defaultEvents));
      }
    } catch (err) {
      console.error('Erreur chargement événements', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ ...emptyEvent, display_order: events.length + 1 });
    setShowModal(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingId(event.id || null);
    setFormData(event);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setSaving(true);
    try {
      let updatedEvents: CalendarEvent[];

      if (editingId) {
        // Modifier
        updatedEvents = events.map(e => (e.id === editingId ? { ...formData, id: editingId } : e));
      } else {
        // Créer
        const newId = Math.max(...events.map(e => e.id || 0), 0) + 1;
        updatedEvents = [...events, { ...formData, id: newId }];
      }

      // Trier par display_order
      updatedEvents.sort((a, b) => a.display_order - b.display_order);

      // TODO: Remplacer par l'appel API réel
      localStorage.setItem('oaib_calendar_events', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
      setShowModal(false);
    } catch (err) {
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${title}" ?`)) return;

    try {
      const updatedEvents = events.filter(e => e.id !== id);
      // TODO: Remplacer par l'appel API réel
      localStorage.setItem('oaib_calendar_events', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
    } catch (err) {
      alert('Erreur lors de la suppression.');
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Calendar size={24} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Calendrier 2026 - Dates Clés</h2>
            <p className="text-slate-400 text-sm">Gérer les événements affichés sur la page Programme</p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {/* Events Grid */}
      <div className="p-6">
        {events.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            Aucun événement. Cliquez sur "Ajouter" pour en créer un.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(event => (
              <div key={event.id} className="bg-slate-700/50 rounded-xl overflow-hidden border border-slate-600 group">
                {/* Color header */}
                <div className={`${event.color} text-white p-3 text-center`}>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80">{event.month}</p>
                  <p className="text-2xl font-black mt-1">{event.date}</p>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-white font-bold mb-1">{event.title}</h3>
                  <p className="text-slate-400 text-sm mb-3">{event.description}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(event)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-600 hover:bg-blue-500/20 text-slate-300 hover:text-blue-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Edit2 size={14} />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(event.id!, event.title)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-600 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Modifier l\'événement' : 'Nouvel événement'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Month & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Mois *</label>
                  <select
                    value={formData.month}
                    onChange={e => setFormData({ ...formData, month: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                  >
                    {monthOptions.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Date(s) *</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    placeholder="Ex: 15 ou 15-16"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Ouverture Inscriptions"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Début de la période d'inscription en ligne"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent resize-none"
                  rows={3}
                />
              </div>

              {/* Color & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Couleur *</label>
                  <select
                    value={formData.color}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                  >
                    {colorOptions.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Ordre d'affichage</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                    min={1}
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <p className="text-slate-400 text-xs font-medium mb-3">Aperçu :</p>
                <div className="bg-white rounded-xl overflow-hidden max-w-xs">
                  <div className={`${formData.color} text-white p-3 text-center`}>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-80">{formData.month}</p>
                    <p className="text-2xl font-black mt-1">{formData.date || '?'}</p>
                  </div>
                  <div className="p-4">
                    <h3 className="text-slate-900 font-bold mb-1">{formData.title || 'Titre de l\'événement'}</h3>
                    <p className="text-slate-600 text-sm">{formData.description || 'Description de l\'événement'}</p>
                  </div>
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
                  disabled={saving || !formData.title || !formData.description}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
                  {editingId ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarEventsManager;
