import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Camera } from 'lucide-react';

const StudentProfile: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-text">Mon Profil</h1>
        <p className="text-text-secondary mt-1">Gérez vos informations personnelles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border p-6 text-center">
            {/* Avatar */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-16 h-16 text-primary" />
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg hover:bg-accent-light transition-colors">
                <Camera className="w-5 h-5 text-primary" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-text">Jean Dupont</h2>
            <p className="text-text-secondary">jean.dupont@email.com</p>

            <div className="mt-4 pt-4 border-t border-border">
              <span className="inline-flex px-4 py-1.5 bg-accent/10 text-accent text-sm font-bold rounded-full">
                Participant OAIB 2026
              </span>
            </div>

            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">Cotonou, Bénin</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">Inscrit le 15 Jan 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text">Informations personnelles</h2>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors">
                <Edit2 size={16} />
                Modifier
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Prénom</label>
                <input
                  type="text"
                  value="Jean"
                  disabled
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Nom</label>
                <input
                  type="text"
                  value="Dupont"
                  disabled
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    value="jean.dupont@email.com"
                    disabled
                    className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-text disabled:opacity-60"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="tel"
                    value="+229 97 00 00 00"
                    disabled
                    className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-text disabled:opacity-60"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary mb-2">Établissement</label>
                <input
                  type="text"
                  value="Université d'Abomey-Calavi"
                  disabled
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Niveau d'études</label>
                <input
                  type="text"
                  value="Licence 3 - Informatique"
                  disabled
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Date de naissance</label>
                <input
                  type="text"
                  value="15/05/2003"
                  disabled
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text disabled:opacity-60"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
