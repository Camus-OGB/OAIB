import React, { useState } from 'react';
import { 
  Bell, 
  Lock, 
  Eye, 
  EyeOff,
  Shield,
  Smartphone,
  Mail,
  Globe,
  Moon,
  Sun,
  Check,
  AlertCircle,
  Save,
  Trash2
} from 'lucide-react';

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

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: false,
    examReminders: true,
    resultAlerts: true,
    newsUpdates: false,
  });

  const [language, setLanguage] = useState('fr');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePassword = () => {
    // TODO: Implement password change
    console.log('Changing password...');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveNotifications = () => {
    // TODO: Save notification settings
    console.log('Saving notifications...', notifications);
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
        <div className="bg-white rounded-2xl border border-border p-6">
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

            <button
              onClick={handleSavePassword}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
            >
              <Save size={18} />
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
        <div className="bg-white rounded-2xl border border-border p-6">
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

        {/* Appearance section */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-benin-yellow/10 rounded-xl flex items-center justify-center">
              <Sun className="w-5 h-5 text-benin-yellow" />
            </div>
            <div>
              <h2 className="font-bold text-text">Apparence</h2>
              <p className="text-sm text-text-secondary">Personnalisez l'interface</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Theme selection */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">Thème</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', icon: Sun, label: 'Clair' },
                  { value: 'dark', icon: Moon, label: 'Sombre' },
                  { value: 'system', icon: Smartphone, label: 'Système' },
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value as typeof theme)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme === value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <Icon size={24} className={theme === value ? 'text-primary' : 'text-text-muted'} />
                    <span className={`text-sm font-medium ${theme === value ? 'text-primary' : 'text-text'}`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language selection */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Langue</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary appearance-none"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
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
