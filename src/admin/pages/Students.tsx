import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  GraduationCap
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  school: string;
  city: string;
  level: string;
  status: 'pending' | 'validated' | 'rejected';
  registeredAt: string;
}

const mockStudents: Student[] = [
  { id: 1, name: 'Mensah Koffi', email: 'mensah.koffi@email.com', phone: '+229 97 00 00 01', school: 'Lycée Béhanzin', city: 'Cotonou', level: 'Terminale', status: 'validated', registeredAt: '2025-01-15' },
  { id: 2, name: 'Afi Dossou', email: 'afi.dossou@email.com', phone: '+229 97 00 00 02', school: 'Collège Notre Dame', city: 'Porto-Novo', level: '3ème', status: 'validated', registeredAt: '2025-01-18' },
  { id: 3, name: 'Kodjo Agbossou', email: 'kodjo.agb@email.com', phone: '+229 97 00 00 03', school: 'Lycée Toffa 1er', city: 'Porto-Novo', level: 'Première', status: 'pending', registeredAt: '2025-01-20' },
  { id: 4, name: 'Sena Hounton', email: 'sena.h@email.com', phone: '+229 97 00 00 04', school: 'CS Sainte Rita', city: 'Cotonou', level: 'Seconde', status: 'validated', registeredAt: '2025-01-22' },
  { id: 5, name: 'Bruno Adjaho', email: 'bruno.adj@email.com', phone: '+229 97 00 00 05', school: 'Lycée Technique', city: 'Parakou', level: 'Terminale', status: 'rejected', registeredAt: '2025-01-25' },
  { id: 6, name: 'Grace Assogba', email: 'grace.a@email.com', phone: '+229 97 00 00 06', school: 'CEG Gbégamey', city: 'Cotonou', level: '3ème', status: 'pending', registeredAt: '2025-01-28' },
  { id: 7, name: 'Eric Bankole', email: 'eric.b@email.com', phone: '+229 97 00 00 07', school: 'Lycée Coulibaly', city: 'Natitingou', level: 'Première', status: 'validated', registeredAt: '2025-02-01' },
  { id: 8, name: 'Diane Houenou', email: 'diane.h@email.com', phone: '+229 97 00 00 08', school: 'CS Les Hibiscus', city: 'Cotonou', level: 'Seconde', status: 'validated', registeredAt: '2025-02-03' },
];

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-yellow-500/10 text-yellow-400' },
  validated: { label: 'Validé', color: 'bg-accent/10 text-accent' },
  rejected: { label: 'Rejeté', color: 'bg-red-500/10 text-red-400' },
};

const AdminStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const cities = [...new Set(mockStudents.map(s => s.city))];

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.school.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    const matchesCity = selectedCity === 'all' || student.city === selectedCity;
    return matchesSearch && matchesStatus && matchesCity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Étudiants</h1>
          <p className="text-slate-400 mt-1">{mockStudents.length} étudiants inscrits</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-600 transition-colors">
          <Download size={20} />
          Exporter CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">En attente</span>
            <span className="text-2xl font-bold text-yellow-400">
              {mockStudents.filter(s => s.status === 'pending').length}
            </span>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Validés</span>
            <span className="text-2xl font-bold text-accent">
              {mockStudents.filter(s => s.status === 'validated').length}
            </span>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Rejetés</span>
            <span className="text-2xl font-bold text-red-400">
              {mockStudents.filter(s => s.status === 'rejected').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou école..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="validated">Validé</option>
            <option value="rejected">Rejeté</option>
          </select>

          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
          >
            <option value="all">Toutes les villes</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium text-sm px-6 py-4">Étudiant</th>
                <th className="text-left text-slate-400 font-medium text-sm px-6 py-4 hidden lg:table-cell">École</th>
                <th className="text-left text-slate-400 font-medium text-sm px-6 py-4 hidden md:table-cell">Ville</th>
                <th className="text-left text-slate-400 font-medium text-sm px-6 py-4">Niveau</th>
                <th className="text-left text-slate-400 font-medium text-sm px-6 py-4">Statut</th>
                <th className="text-right text-slate-400 font-medium text-sm px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{student.name}</p>
                        <p className="text-slate-400 text-sm">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 hidden lg:table-cell">{student.school}</td>
                  <td className="px-6 py-4 text-slate-300 hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-slate-400" />
                      {student.city}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-slate-300">
                      <GraduationCap size={14} className="text-accent" />
                      {student.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusConfig[student.status].color}`}>
                      {statusConfig[student.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="p-2 rounded-lg hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                      {student.status === 'pending' && (
                        <>
                          <button className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors">
                            Valider
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors">
                            Rejeter
                          </button>
                        </>
                      )}
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
            Affichage de <span className="text-white">1-{filteredStudents.length}</span> sur <span className="text-white">{filteredStudents.length}</span> étudiants
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-50" disabled>
              <ChevronLeft size={20} />
            </button>
            <button className="px-4 py-2 rounded-lg bg-accent text-primary font-medium">1</button>
            <button className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-50" disabled>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
          <div className="bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{selectedStudent.name}</h2>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusConfig[selectedStudent.status].color}`}>
                  {statusConfig[selectedStudent.status].label}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail size={18} className="text-slate-400" />
                {selectedStudent.email}
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone size={18} className="text-slate-400" />
                {selectedStudent.phone}
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <GraduationCap size={18} className="text-slate-400" />
                {selectedStudent.school} • {selectedStudent.level}
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin size={18} className="text-slate-400" />
                {selectedStudent.city}, Bénin
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="flex-1 py-3 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-600 transition-colors"
              >
                Fermer
              </button>
              {selectedStudent.status === 'pending' && (
                <button className="flex-1 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors">
                  Valider l'inscription
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
