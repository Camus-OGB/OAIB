import React, { useState } from 'react';
import { 
  Bell, 
  Lock, 
  Eye, 
  EyeOff,
  Shield,
  Smartphone,
  Mail,
  Check,
  AlertCircle,
  Save,
  Trash2,
  Loader2
} from 'lucide-react';
import { changePassword } from '../../features/auth/services/authService';

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  examReminders: boolean;
  resultAlerts: boolean;
  newsUpdates: boolean;
}

const StudentSettings: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [saving, setSaving] = useState(false);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: false,
    examReminders: true,
    resultAlerts: true,
    newsUpdates: false,
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePassword = async () => {
    setPasswordError('');
    if (!currentPassword || !newPassword) { setPasswordError('Remplissez tous les champs'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Les mots de passe ne correspondent pas'); return; }
    if (newPassword.length < 8) { setPasswordError('Minimum 8 caractères'); return; }
    setSaving(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.error) { setPasswordError(res.error?.message || 'Erreur, vérifiez votre mot de passe actuel'); setSaving(false); return; }
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch { setPasswordError('Erreur réseau'); }
    finally { setSaving(false); }
  };

  const handleSaveNotifications = () => {
    // Notification preferences are stored client-side for now
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-text">Paramètres</h1>
        <p className="text-text-secondary mt-1">Gérez vos préférences et la sécurité de votre compte</p>
      </div>

      {/* Success message */}
      {saveSuccess && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
          <Check className="w-5 h-5" />
          <span className="font-medium">Modifications enregistrées avec succès !</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security section */}
        <div className="bg-white/80 rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-text">Sécurité</h2>
              <p className="text-sm text-text-secondary">Modifiez votre mot de passe</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Mot de passe actuel
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-text-muted mt-1">
                Minimum 8 caractères, avec majuscules et chiffres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-benin-red">
                {passwordError}
              </div>
            )}

            <button
              onClick={handleSavePassword}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Mettre à jour le mot de passe
            </button>
          </div>

          {/* Two-factor auth */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-text-muted" />
                <div>
                  <p className="font-medium text-text">Authentification à deux facteurs</p>
                  <p className="text-sm text-text-secondary">Sécurisez davantage votre compte</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  twoFactorEnabled ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    twoFactorEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications section */}
        <div className="bg-white/80 rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-bold text-text">Notifications</h2>
              <p className="text-sm text-text-secondary">Gérez vos préférences</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Email notifications */}
            <div className="flex items-center justify-between p-3 bg-background rounded-xl">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-text-muted" />
                <div>
                  <p className="font-medium text-text">Notifications par email</p>
                  <p className="text-xs text-text-secondary">Recevoir les alertes par email</p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationChange('email')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.email ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications.email ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* SMS notifications */}
            <div className="flex items-center justify-between p-3 bg-background rounded-xl">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-text-muted" />
                <div>
                  <p className="font-medium text-text">Notifications SMS</p>
                  <p className="text-xs text-text-secondary">Recevoir les alertes par SMS</p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationChange('sms')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.sms ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications.sms ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <p className="text-sm font-medium text-text-secondary">Types de notifications</p>
              
              {/* Exam reminders */}
              <div className="flex items-center justify-between">
                <span className="text-text">Rappels d'épreuves</span>
                <button
                  onClick={() => handleNotificationChange('examReminders')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.examReminders ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span 
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.examReminders ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Result alerts */}
              <div className="flex items-center justify-between">
                <span className="text-text">Alertes de résultats</span>
                <button
                  onClick={() => handleNotificationChange('resultAlerts')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.resultAlerts ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span 
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.resultAlerts ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* News updates */}
              <div className="flex items-center justify-between">
                <span className="text-text">Actualités OAIB</span>
                <button
                  onClick={() => handleNotificationChange('newsUpdates')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.newsUpdates ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span 
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.newsUpdates ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={handleSaveNotifications}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
            >
              <Save size={18} />
              Enregistrer les préférences
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-benin-red" />
            </div>
            <div>
              <h2 className="font-bold text-benin-red">Zone de danger</h2>
              <p className="text-sm text-text-secondary">Actions irréversibles</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-xl">
              <h3 className="font-bold text-text mb-1">Supprimer mon compte</h3>
              <p className="text-sm text-text-secondary mb-4">
                Cette action est irréversible. Toutes vos données seront définitivement supprimées.
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-benin-red text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
                <Trash2 size={18} />
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;
