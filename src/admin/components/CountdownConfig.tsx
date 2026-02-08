import React, { useState, useEffect } from 'react';
import { Clock, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface CountdownSettings {
  enabled: boolean;
  target_datetime: string;
  title: string;
  description: string;
}

const CountdownConfig: React.FC = () => {
  const [settings, setSettings] = useState<CountdownSettings>({
    enabled: true,
    target_datetime: '',
    title: 'Prochaine Session des Olympiades',
    description: 'Les inscriptions débuteront dans',
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // TODO: Remplacer par l'appel API réel
      const stored = localStorage.getItem('oaib_countdown_config');
      if (stored) {
        setSettings(JSON.parse(stored));
      } else {
        // Valeur par défaut : dans 30 jours
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30);
        setSettings(prev => ({
          ...prev,
          target_datetime: defaultDate.toISOString().slice(0, 16),
        }));
      }
    } catch (err) {
      setError('Erreur lors du chargement de la configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings.target_datetime) {
      setError('Veuillez sélectionner une date et heure');
      return;
    }

    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      // TODO: Remplacer par l'appel API réel pour sauvegarder en base de données
      localStorage.setItem('oaib_countdown_config', JSON.stringify(settings));

      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
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
      <div className="flex items-center gap-3 p-6 border-b border-slate-700 bg-gradient-to-r from-accent/10 to-blue-500/10">
        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
          <Clock size={24} className="text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Compte à Rebours - Page d'Accueil</h2>
          <p className="text-slate-400 text-sm">Configurez le timer affiché sur le site public</p>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 space-y-6">
        {/* Enable/Disable */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-slate-300 font-medium">Activer le compte à rebours</label>
            <p className="text-slate-500 text-sm">Afficher le timer sur la page d'accueil</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={e => setSettings({ ...settings, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>

        {settings.enabled && (
          <>
            {/* Title */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Titre du compte à rebours *
              </label>
              <input
                type="text"
                value={settings.title}
                onChange={e => setSettings({ ...settings, title: e.target.value })}
                placeholder="Ex: Prochaine Session des Olympiades"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Description
              </label>
              <input
                type="text"
                value={settings.description}
                onChange={e => setSettings({ ...settings, description: e.target.value })}
                placeholder="Ex: Les inscriptions débuteront dans"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
              />
            </div>

            {/* Target Date/Time */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Date et Heure Cible *
              </label>
              <input
                type="datetime-local"
                value={settings.target_datetime}
                onChange={e => setSettings({ ...settings, target_datetime: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
              />
              <p className="text-slate-500 text-sm mt-1">
                Le compte à rebours s'affichera jusqu'à cette date
              </p>
            </div>

            {/* Preview */}
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <p className="text-slate-400 text-xs font-medium mb-3">Aperçu :</p>
              <div className="text-center">
                <h3 className="text-white font-bold text-lg mb-2">{settings.title}</h3>
                <p className="text-slate-400 text-sm mb-3">{settings.description}</p>
                <div className="flex items-center justify-center gap-3">
                  {[
                    { label: 'Jours', value: '15' },
                    { label: 'Heures', value: '08' },
                    { label: 'Minutes', value: '42' },
                    { label: 'Secondes', value: '33' },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-800 rounded-lg p-3 min-w-[70px]">
                      <div className="text-accent text-2xl font-bold">{item.value}</div>
                      <div className="text-slate-400 text-xs mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Success Message */}
        {saveSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
            <CheckCircle size={16} />
            Configuration sauvegardée avec succès !
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || !settings.target_datetime}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save size={18} />
              Sauvegarder la Configuration
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CountdownConfig;
