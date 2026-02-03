import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Mail,
  Shield,
  Globe,
  Palette,
  Database,
  Users,
  Clock,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Trash2,
  Edit2,
  Key
} from 'lucide-react';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  lastLogin: string;
  status: 'active' | 'inactive';
}

const mockNotifications: NotificationSetting[] = [
  { id: '1', label: 'Nouvelle inscription', description: 'Quand un candidat s\'inscrit', email: true, push: true },
  { id: '2', label: 'Dossier complet', description: 'Quand un dossier est prêt à valider', email: true, push: false },
  { id: '3', label: 'QCM terminé', description: 'Quand un candidat termine son QCM', email: false, push: true },
  { id: '4', label: 'Rapport hebdomadaire', description: 'Résumé des statistiques de la semaine', email: true, push: false },
];

const mockAdmins: AdminUser[] = [
  { id: '1', name: 'Admin Principal', email: 'admin@oaib.bj', role: 'super_admin', lastLogin: '2026-01-30 14:30', status: 'active' },
  { id: '2', name: 'Jean Koffi', email: 'jean.koffi@oaib.bj', role: 'admin', lastLogin: '2026-01-30 10:15', status: 'active' },
  { id: '3', name: 'Marie Dossou', email: 'marie.dossou@oaib.bj', role: 'moderator', lastLogin: '2026-01-28 16:45', status: 'active' },
  { id: '4', name: 'Paul Houénou', email: 'paul.h@oaib.bj', role: 'moderator', lastLogin: '2026-01-20 09:00', status: 'inactive' },
];

type SettingsTab = 'general' | 'notifications' | 'security' | 'users' | 'maintenance';

const tabs = [
  { id: 'general', label: 'Général', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'users', label: 'Administrateurs', icon: Users },
  { id: 'maintenance', label: 'Maintenance', icon: Database },
];

const roleConfig = {
  super_admin: { label: 'Super Admin', className: 'bg-red-500/10 text-red-400' },
  admin: { label: 'Admin', className: 'bg-blue-500/10 text-blue-400' },
  moderator: { label: 'Modérateur', className: 'bg-green-500/10 text-green-400' },
};

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [notifications, setNotifications] = useState<NotificationSetting[]>(mockNotifications);
  const [admins] = useState<AdminUser[]>(mockAdmins);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'OAIB - Olympiades d\'IA du Bénin',
    siteDescription: 'Compétition nationale d\'Intelligence Artificielle',
    contactEmail: 'contact@oaib.bj',
    supportEmail: 'support@oaib.bj',
    maxFileSize: 10, // MB
    allowedFileTypes: 'pdf,jpg,png',
    registrationOpen: true,
    maintenanceMode: false,
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorRequired: false,
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChar: true,
    requireNumber: true,
  });

  const handleNotificationToggle = (id: string, type: 'email' | 'push') => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, [type]: !n[type] } : n
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Paramètres enregistrés avec succès');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Paramètres</h1>
          <p className="text-slate-400 mt-1">Configuration de la plateforme</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          Enregistrer
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-2">
        <div className="flex overflow-x-auto gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent text-primary'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-6">
          <h3 className="text-white font-bold text-lg">Paramètres généraux</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Nom du site</label>
              <input
                type="text"
                value={generalSettings.siteName}
                onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-2">Description</label>
              <input
                type="text"
                value={generalSettings.siteDescription}
                onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-2">Email de contact</label>
              <input
                type="email"
                value={generalSettings.contactEmail}
                onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-2">Email support</label>
              <input
                type="email"
                value={generalSettings.supportEmail}
                onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-2">Taille max fichier (MB)</label>
              <input
                type="number"
                value={generalSettings.maxFileSize}
                onChange={(e) => setGeneralSettings({ ...generalSettings, maxFileSize: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-2">Types de fichiers autorisés</label>
              <input
                type="text"
                value={generalSettings.allowedFileTypes}
                onChange={(e) => setGeneralSettings({ ...generalSettings, allowedFileTypes: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700 space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
              <div>
                <p className="text-white font-medium">Inscriptions ouvertes</p>
                <p className="text-slate-400 text-sm">Autoriser les nouvelles inscriptions</p>
              </div>
              <button
                onClick={() => setGeneralSettings({ ...generalSettings, registrationOpen: !generalSettings.registrationOpen })}
                className={`w-14 h-7 rounded-full transition-colors ${
                  generalSettings.registrationOpen ? 'bg-green-500' : 'bg-slate-600'
                }`}
              >
                <span className={`block w-5 h-5 bg-white rounded-full transition-transform mx-1 ${
                  generalSettings.registrationOpen ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div>
                <p className="text-white font-medium flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-400" />
                  Mode maintenance
                </p>
                <p className="text-slate-400 text-sm">Rendre le site inaccessible temporairement</p>
              </div>
              <button
                onClick={() => setGeneralSettings({ ...generalSettings, maintenanceMode: !generalSettings.maintenanceMode })}
                className={`w-14 h-7 rounded-full transition-colors ${
                  generalSettings.maintenanceMode ? 'bg-red-500' : 'bg-slate-600'
                }`}
              >
                <span className={`block w-5 h-5 bg-white rounded-full transition-transform mx-1 ${
                  generalSettings.maintenanceMode ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-6">
          <h3 className="text-white font-bold text-lg">Préférences de notification</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Notification</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium text-sm">
                    <Mail size={16} className="inline mr-2" />
                    Email
                  </th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium text-sm">
                    <Bell size={16} className="inline mr-2" />
                    Push
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {notifications.map((notif) => (
                  <tr key={notif.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="text-white font-medium">{notif.label}</p>
                      <p className="text-slate-400 text-sm">{notif.description}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleNotificationToggle(notif.id, 'email')}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notif.email ? 'bg-accent' : 'bg-slate-600'
                        }`}
                      >
                        <span className={`block w-4 h-4 bg-white rounded-full transition-transform mx-1 ${
                          notif.email ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleNotificationToggle(notif.id, 'push')}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notif.push ? 'bg-accent' : 'bg-slate-600'
                        }`}
                      >
                        <span className={`block w-4 h-4 bg-white rounded-full transition-transform mx-1 ${
                          notif.push ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-6">
          <h3 className="text-white font-bold text-lg">Paramètres de sécurité</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Expiration session (minutes)</label>
              <input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-2">Tentatives de connexion max</label>
              <input
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-2">Longueur min mot de passe</label>
              <input
                type="number"
                value={securitySettings.passwordMinLength}
                onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700 space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
              <div>
                <p className="text-white font-medium">Authentification 2FA obligatoire</p>
                <p className="text-slate-400 text-sm">Exiger l'authentification à deux facteurs pour tous les admins</p>
              </div>
              <button
                onClick={() => setSecuritySettings({ ...securitySettings, twoFactorRequired: !securitySettings.twoFactorRequired })}
                className={`w-14 h-7 rounded-full transition-colors ${
                  securitySettings.twoFactorRequired ? 'bg-accent' : 'bg-slate-600'
                }`}
              >
                <span className={`block w-5 h-5 bg-white rounded-full transition-transform mx-1 ${
                  securitySettings.twoFactorRequired ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
              <div>
                <p className="text-white font-medium">Caractère spécial obligatoire</p>
                <p className="text-slate-400 text-sm">Les mots de passe doivent contenir un caractère spécial</p>
              </div>
              <button
                onClick={() => setSecuritySettings({ ...securitySettings, requireSpecialChar: !securitySettings.requireSpecialChar })}
                className={`w-14 h-7 rounded-full transition-colors ${
                  securitySettings.requireSpecialChar ? 'bg-accent' : 'bg-slate-600'
                }`}
              >
                <span className={`block w-5 h-5 bg-white rounded-full transition-transform mx-1 ${
                  securitySettings.requireSpecialChar ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
              <div>
                <p className="text-white font-medium">Chiffre obligatoire</p>
                <p className="text-slate-400 text-sm">Les mots de passe doivent contenir un chiffre</p>
              </div>
              <button
                onClick={() => setSecuritySettings({ ...securitySettings, requireNumber: !securitySettings.requireNumber })}
                className={`w-14 h-7 rounded-full transition-colors ${
                  securitySettings.requireNumber ? 'bg-accent' : 'bg-slate-600'
                }`}
              >
                <span className={`block w-5 h-5 bg-white rounded-full transition-transform mx-1 ${
                  securitySettings.requireNumber ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">Administrateurs</h3>
            <button
              onClick={() => { setEditingUser(null); setShowUserModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors"
            >
              <Plus size={18} />
              Ajouter
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-6 text-slate-400 font-medium text-sm">Utilisateur</th>
                <th className="text-left py-3 px-6 text-slate-400 font-medium text-sm">Rôle</th>
                <th className="text-left py-3 px-6 text-slate-400 font-medium text-sm">Dernière connexion</th>
                <th className="text-left py-3 px-6 text-slate-400 font-medium text-sm">Statut</th>
                <th className="text-left py-3 px-6 text-slate-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold">
                        {admin.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white font-medium">{admin.name}</p>
                        <p className="text-slate-400 text-sm">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${roleConfig[admin.role].className}`}>
                      {roleConfig[admin.role].label}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 text-sm">{admin.lastLogin}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      admin.status === 'active' 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-slate-600 text-slate-400'
                    }`}>
                      {admin.status === 'active' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {admin.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setEditingUser(admin); setShowUserModal(true); }}
                        className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white">
                        <Key size={16} />
                      </button>
                      {admin.role !== 'super_admin' && (
                        <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-white font-bold text-lg mb-4">Actions de maintenance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors text-left">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Database className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Sauvegarder la base de données</p>
                  <p className="text-slate-400 text-sm">Dernière sauvegarde: 30/01/2026 02:00</p>
                </div>
              </button>
              <button className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors text-left">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <RefreshCw className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Vider le cache</p>
                  <p className="text-slate-400 text-sm">Libérer l'espace temporaire</p>
                </div>
              </button>
              <button className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors text-left">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Globe className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Regénérer les liens</p>
                  <p className="text-slate-400 text-sm">Mettre à jour les URLs du site</p>
                </div>
              </button>
              <button className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-colors text-left">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Réinitialiser les données de test</p>
                  <p className="text-red-400 text-sm">Action irréversible</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-white font-bold text-lg mb-4">Logs système</h3>
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm h-64 overflow-y-auto">
              <p className="text-slate-500">[2026-01-30 14:32:15] INFO: Admin Principal logged in</p>
              <p className="text-slate-500">[2026-01-30 14:30:00] INFO: Cache cleared successfully</p>
              <p className="text-green-400">[2026-01-30 14:28:45] SUCCESS: Database backup completed</p>
              <p className="text-slate-500">[2026-01-30 14:15:22] INFO: New registration: user@email.com</p>
              <p className="text-yellow-400">[2026-01-30 14:10:00] WARNING: High memory usage detected (85%)</p>
              <p className="text-slate-500">[2026-01-30 14:00:00] INFO: Scheduled task: Email digest sent</p>
              <p className="text-slate-500">[2026-01-30 12:45:33] INFO: QCM completed by user #1234</p>
              <p className="text-red-400">[2026-01-30 12:30:00] ERROR: Failed to send notification to user #5678</p>
              <p className="text-slate-500">[2026-01-30 12:00:00] INFO: System health check passed</p>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingUser ? 'Modifier l\'administrateur' : 'Nouvel administrateur'}
              </h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-2">Nom complet</label>
                <input
                  type="text"
                  defaultValue={editingUser?.name || ''}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={editingUser?.email || ''}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                  placeholder="email@oaib.bj"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-2">Rôle</label>
                <select
                  defaultValue={editingUser?.role || 'moderator'}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                >
                  <option value="moderator">Modérateur</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Mot de passe temporaire</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                    placeholder="••••••••"
                  />
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 py-3 border border-slate-600 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors"
                >
                  {editingUser ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
