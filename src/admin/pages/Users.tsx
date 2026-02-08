import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Shield,
  User,
  Loader2,
  X
} from 'lucide-react';
import { listUsers, createUser, updateUser, deleteUser } from '../../services/userService';
import type { AdminUser, UserRole } from '../../shared/types';

const roleColors: Record<string, string> = {
  admin: 'bg-red-500/10 text-red-400 border-red-500/20',
  moderator: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  student: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  moderator: 'Modérateur',
  student: 'Étudiant',
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', first_name: '', last_name: '', password: '', role: 'moderator' as string });
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const itemsPerPage = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('page_size', String(itemsPerPage));
      if (searchQuery) params.set('search', searchQuery);
      if (selectedRole !== 'all') params.set('role', selectedRole);
      const res = await listUsers(params.toString());
      if (res.ok) { setUsers(res.data.results ?? []); setTotalCount(res.data.count ?? 0); }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [currentPage, searchQuery, selectedRole]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await createUser(newUser);
      if (res.ok) { setShowCreateModal(false); setNewUser({ email: '', first_name: '', last_name: '', password: '', role: 'moderator' }); fetchUsers(); }
    } catch { /* ignore */ }
    finally { setCreating(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    setDeletingId(id);
    try { await deleteUser(id); fetchUsers(); } catch { /* ignore */ }
    finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Utilisateurs</h1>
          <p className="text-slate-400 mt-1">Gérez les comptes administrateurs et modérateurs</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors"
        >
          <Plus size={20} />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => { setSelectedRole(e.target.value); setCurrentPage(1); }}
              className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Modérateur</option>
              <option value="student">Étudiant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium text-sm px-6 py-4">Utilisateur</th>
                <th className="text-left text-slate-400 font-medium text-sm px-6 py-4">Rôle</th>
                <th className="text-left text-slate-400 font-medium text-sm px-6 py-4">Statut</th>
                <th className="text-left text-slate-400 font-medium text-sm px-6 py-4">Date création</th>
                <th className="text-right text-slate-400 font-medium text-sm px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
                </td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-slate-400">Aucun utilisateur trouvé</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                        {user.role === 'admin' ? (
                          <Shield size={18} className="text-red-400" />
                        ) : (
                          <User size={18} className="text-slate-300" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.first_name} {user.last_name}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${roleColors[user.role] || roleColors.student}`}>
                      {roleLabels[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-accent/10 text-accent' : 'bg-slate-500/10 text-slate-400'}`}>
                      {user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {new Date(user.date_joined).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-slate-600 text-slate-400 hover:text-white transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-600 text-slate-400 hover:text-white transition-colors">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingId === user.id}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700">
          <p className="text-slate-400 text-sm">
            Page <span className="text-white">{currentPage}</span> sur <span className="text-white">{totalPages || 1}</span> ({totalCount} utilisateurs)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <button className="px-4 py-2 rounded-lg bg-accent text-white font-medium">{currentPage}</button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Nouvel Utilisateur</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Prénom" value={newUser.first_name} onChange={e => setNewUser(p => ({ ...p, first_name: e.target.value }))} className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent" />
                <input type="text" placeholder="Nom" value={newUser.last_name} onChange={e => setNewUser(p => ({ ...p, last_name: e.target.value }))} className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent" />
              </div>
              <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent" />
              <input type="password" placeholder="Mot de passe" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent" />
              <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent">
                <option value="moderator">Modérateur</option>
                <option value="admin">Administrateur</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 border border-slate-600 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors">Annuler</button>
                <button onClick={handleCreate} disabled={creating || !newUser.email || !newUser.password || !newUser.first_name} className="flex-1 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50">
                  {creating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
