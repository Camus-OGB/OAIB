import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Shield,
  User
} from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  avatar?: string;
}

const mockUsers: UserData[] = [
  { id: 1, name: 'Admin Principal', email: 'admin@oaib.bj', role: 'admin', status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Marie Adjovi', email: 'marie.adjovi@oaib.bj', role: 'moderator', status: 'active', createdAt: '2024-02-20' },
  { id: 3, name: 'Jean Hounnou', email: 'jean.hounnou@oaib.bj', role: 'moderator', status: 'inactive', createdAt: '2024-03-10' },
  { id: 4, name: 'Koffi Agbossou', email: 'koffi.agbossou@oaib.bj', role: 'user', status: 'active', createdAt: '2024-04-05' },
  { id: 5, name: 'Afi Dossou', email: 'afi.dossou@oaib.bj', role: 'user', status: 'suspended', createdAt: '2024-04-12' },
  { id: 6, name: 'Pascal Tossou', email: 'pascal.tossou@oaib.bj', role: 'moderator', status: 'active', createdAt: '2024-05-01' },
];

const roleColors = {
  admin: 'bg-red-500/10 text-red-400 border-red-500/20',
  moderator: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  user: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const statusColors = {
  active: 'bg-accent/10 text-accent',
  inactive: 'bg-slate-500/10 text-slate-400',
  suspended: 'bg-red-500/10 text-red-400',
};

const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Utilisateurs</h1>
          <p className="text-slate-400 mt-1">Gérez les comptes administrateurs et modérateurs</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors">
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-slate-400" size={20} />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Modérateur</option>
              <option value="user">Utilisateur</option>
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
              {filteredUsers.map((user) => (
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
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${roleColors[user.role]}`}>
                      {user.role === 'admin' ? 'Admin' : user.role === 'moderator' ? 'Modérateur' : 'Utilisateur'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                      {user.status === 'active' ? 'Actif' : user.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-slate-600 text-slate-400 hover:text-white transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-600 text-slate-400 hover:text-white transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors">
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
            Affichage de <span className="text-white">1-{filteredUsers.length}</span> sur <span className="text-white">{filteredUsers.length}</span> utilisateurs
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              <ChevronLeft size={20} />
            </button>
            <button className="px-4 py-2 rounded-lg bg-accent text-primary font-medium">1</button>
            <button className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
