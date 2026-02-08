import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Trophy,
  Settings,
  LogOut,
  BrainCircuit,
  Bell,
  Menu,
  X,
  BarChart3,
  FileEdit,
  ClipboardList,
  HelpCircle,
  Globe
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Candidatures', to: '/admin/candidatures', icon: ClipboardList },
  { label: 'QCM', to: '/admin/qcm', icon: HelpCircle },
  { label: 'Épreuves', to: '/admin/epreuves', icon: FileText },
  { label: 'Résultats', to: '/admin/resultats', icon: Trophy },
  { label: 'Statistiques', to: '/admin/statistiques', icon: BarChart3 },
  { label: 'Contenu', to: '/admin/contenu', icon: FileEdit },
  { label: 'Config Site', to: '/admin/config-site', icon: Globe },
  { label: 'Utilisateurs', to: '/admin/utilisateurs', icon: Users },
  { label: 'Paramètres', to: '/admin/parametres', icon: Settings },
];

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-800 border-r-2 border-primary/20">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b-2 border-primary/20">
          <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-blue rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-black text-white">OAIB</span>
            <span className="text-xs text-primary block font-bold">Administration</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 via-accent/15 to-blue/20 text-white border-l-4 border-primary shadow-lg shadow-primary/10'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white hover:border-l-2 hover:border-primary/40'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
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
        className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-slate-800 border-r-2 border-primary/20 z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-700 text-white"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="font-black text-white">OAIB</span>
            <span className="text-xs text-accent block font-medium">Administration</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 via-accent/15 to-blue/20 text-white border-l-4 border-primary shadow-lg shadow-primary/10'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white hover:border-l-2 hover:border-primary/40'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t-2 border-primary/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-white"
            >
              <Menu size={24} />
            </button>

            {/* Title - visible on desktop, mobile shows menu button */}
            <div className="hidden lg:flex lg:flex-1 lg:items-center">
              <h1 className="text-lg font-bold text-white">Panel Administrateur</h1>
            </div>

            {/* Mobile logo/title - visible on mobile only */}
            <div className="lg:hidden flex-1 flex items-center justify-center">
              <h1 className="text-base font-bold text-white">OAIB Admin</h1>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-slate-800 transition-colors">
                <Bell size={20} className="text-slate-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Admin avatar */}
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <span className="text-primary font-bold text-sm">AD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
