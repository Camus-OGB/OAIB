import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Trophy, 
  BookOpen, 
  Settings, 
  LogOut,
  BrainCircuit,
  Bell,
  Menu,
  X,
  AlertTriangle,
  Clock,
  ShieldX,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../features/auth/context/AuthContext';

const allNavItems = [
  { label: 'Tableau de bord', to: '/etudiant', icon: LayoutDashboard },
  { label: 'Mon Profil', to: '/etudiant/profil', icon: User },
  { label: 'Épreuves', to: '/etudiant/epreuves', icon: FileText },
  { label: 'Mes Résultats', to: '/etudiant/resultats', icon: Trophy },
  { label: 'Ressources', to: '/etudiant/ressources', icon: BookOpen },
  { label: 'Paramètres', to: '/etudiant/parametres', icon: Settings },
];

/**
 * Bannière indiquant le statut du profil quand non approuvé.
 */
const ProfileStatusBanner: React.FC<{ status: string }> = ({ status }) => {
  const config: Record<string, { icon: React.ElementType; bg: string; text: string; message: string }> = {
    none: {
      icon: AlertTriangle,
      bg: 'bg-amber-50 border-amber-300',
      text: 'text-amber-800',
      message: 'Veuillez compléter votre profil pour accéder à toutes les fonctionnalités de la plateforme.',
    },
    incomplete: {
      icon: AlertTriangle,
      bg: 'bg-amber-50 border-amber-300',
      text: 'text-amber-800',
      message: 'Votre profil est incomplet. Veuillez le compléter pour soumettre votre candidature.',
    },
    pending: {
      icon: Clock,
      bg: 'bg-blue-50 border-blue-300',
      text: 'text-blue-800',
      message: 'Votre profil est en cours de vérification par un administrateur. Vous recevrez une notification une fois validé.',
    },
    rejected: {
      icon: ShieldX,
      bg: 'bg-red-50 border-red-300',
      text: 'text-red-800',
      message: 'Votre profil a été rejeté. Veuillez corriger les informations et soumettre à nouveau.',
    },
  };

  const c = config[status];
  if (!c) return null;
  const Icon = c.icon;

  return (
    <div className={`mx-4 lg:mx-8 mt-4 p-4 rounded-xl border ${c.bg} flex items-start gap-3`}>
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${c.text}`} />
      <div>
        <p className={`text-sm font-semibold ${c.text}`}>
          {status === 'pending' ? 'Profil en attente de validation' : status === 'rejected' ? 'Profil rejeté' : 'Profil à compléter'}
        </p>
        <p className={`text-sm mt-1 ${c.text} opacity-80`}>{c.message}</p>
      </div>
    </div>
  );
};

const StudentLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const profileStatus = user?.profile_status ?? 'none';
  const isProfileApproved = profileStatus === 'approved';

  // Si profil non approuvé, restreindre la navigation au profil uniquement
  const navItems = isProfileApproved
    ? allNavItems
    : allNavItems.filter((item) => item.to === '/etudiant/profil');

  // Rediriger vers le profil si l'utilisateur essaie d'accéder à une autre page
  const isOnProfilePage = location.pathname === '/etudiant/profil';
  if (!isProfileApproved && !isOnProfilePage) {
    return <Navigate to="/etudiant/profil" replace />;
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-50 border-r-2 border-primary/10">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b-2 border-primary/10">
          <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-blue rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-black text-text">OAIB</span>
            <span className="text-xs text-primary block font-bold">Espace Étudiant</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/etudiant'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-background-alt hover:text-text'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-slate-50 border-r border-border z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-background-alt"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-black text-text">OAIB</span>
            <span className="text-xs text-accent block font-medium">Espace Étudiant</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/etudiant'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary via-accent to-blue text-white shadow-md shadow-primary/20'
                    : 'text-text-secondary hover:bg-primary/5 hover:text-primary'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t-2 border-primary/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-background-alt"
            >
              <Menu size={24} />
            </button>

            {/* Title - visible on desktop, mobile shows menu button */}
            <div className="hidden lg:flex lg:flex-1 lg:items-center">
              <h1 className="text-lg font-bold text-text">Bienvenue, Étudiant</h1>
            </div>

            {/* Mobile logo/title - visible on mobile only */}
            <div className="lg:hidden flex-1 flex items-center justify-center">
              <h1 className="text-base font-bold text-text">OAIB</h1>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-background-alt transition-colors">
                <Bell size={20} className="text-text-secondary" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              </button>

              {/* User avatar */}
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User size={20} className="text-primary" />
              </div>
            </div>
          </div>
        </header>

        {/* Profile status banner */}
        {!isProfileApproved && <ProfileStatusBanner status={profileStatus} />}

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
