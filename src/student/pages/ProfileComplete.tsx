import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit2, 
  Camera,
  School,
  BookOpen,
  Users,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Save,
  X,
  Trash2,
  Eye
} from 'lucide-react';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  address: string;
  city: string;
  country: string;
}

interface SchoolInfo {
  establishment: string;
  level: string;
  class: string;
  averageGrade: string;
  mathGrade: string;
  scienceGrade: string;
}

interface TutorInfo {
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  email: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'pending' | 'verified' | 'rejected';
}

const StudentProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'school' | 'tutor' | 'documents'>('personal');
  const [isEditing, setIsEditing] = useState(false);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '+229 97 00 00 00',
    birthDate: '2008-05-15',
    gender: 'male',
    address: '123 Rue des Fleurs',
    city: 'Cotonou',
    country: 'Bénin',
  });

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({
    establishment: 'Lycée Béhanzin',
    level: 'Terminale',
    class: 'Terminale D',
    averageGrade: '15.5',
    mathGrade: '17',
    scienceGrade: '16',
  });

  const [tutorInfo, setTutorInfo] = useState<TutorInfo>({
    firstName: 'Marie',
    lastName: 'Dupont',
    relationship: 'Mère',
    phone: '+229 96 00 00 00',
    email: 'marie.dupont@email.com',
  });

  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Bulletin_T1_2025.pdf', type: 'bulletin', size: '1.2 MB', uploadDate: '15 Jan 2026', status: 'verified' },
    { id: '2', name: 'Bulletin_T2_2025.pdf', type: 'bulletin', size: '1.4 MB', uploadDate: '15 Jan 2026', status: 'pending' },
    { id: '3', name: 'Certificat_scolarite.pdf', type: 'certificate', size: '0.8 MB', uploadDate: '15 Jan 2026', status: 'verified' },
  ]);

  const isMinor = () => {
    const birthDate = new Date(personalInfo.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age < 18;
  };

  // Calculate profile completion
  const calculateCompletion = () => {
    let completed = 0;
    const total = 4;

    // Personal info
    if (personalInfo.firstName && personalInfo.lastName && personalInfo.email && personalInfo.phone) completed++;
    // School info
    if (schoolInfo.establishment && schoolInfo.level && schoolInfo.averageGrade) completed++;
    // Tutor (only if minor)
    if (!isMinor() || (tutorInfo.firstName && tutorInfo.phone)) completed++;
    // Documents
    if (documents.some(d => d.status === 'verified')) completed++;

    return Math.round((completed / total) * 100);
  };

  const handleSave = () => {
    // TODO: Save to backend
    setIsEditing(false);
    console.log('Saving profile...', { personalInfo, schoolInfo, tutorInfo });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: 'bulletin',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'pending',
      };
      setDocuments(prev => [...prev, newDoc]);
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const getStatusBadge = (status: Document['status']) => {
    const config = {
      pending: { label: 'En attente', className: 'bg-benin-yellow/10 text-benin-yellow', icon: AlertCircle },
      verified: { label: 'Vérifié', className: 'bg-green-100 text-green-600', icon: CheckCircle },
      rejected: { label: 'Rejeté', className: 'bg-red-100 text-benin-red', icon: X },
    };
    const { label, className, icon: Icon } = config[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${className}`}>
        <Icon size={12} />
        {label}
      </span>
    );
  };

  const tabs = [
    { id: 'personal', label: 'Infos Personnelles', icon: User },
    { id: 'school', label: 'Infos Scolaires', icon: School },
    { id: 'tutor', label: 'Tuteur', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-text">Mon Profil</h1>
          <p className="text-text-secondary mt-1">Gérez votre dossier de candidature</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
          >
            <Edit2 size={18} />
            Modifier
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 border border-border text-text-secondary font-bold rounded-xl hover:bg-background-alt transition-colors"
            >
              <X size={18} />
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
            >
              <Save size={18} />
              Enregistrer
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border p-6 text-center sticky top-24">
            {/* Avatar */}
            <div className="relative w-28 h-28 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                <User className="w-14 h-14 text-primary" />
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg hover:bg-accent-light transition-colors cursor-pointer">
                  <Camera className="w-5 h-5 text-primary" />
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              )}
            </div>

            <h2 className="text-xl font-bold text-text">{personalInfo.firstName} {personalInfo.lastName}</h2>
            <p className="text-text-secondary text-sm">{personalInfo.email}</p>

            <div className="mt-4 pt-4 border-t border-border">
              <span className="inline-flex px-4 py-1.5 bg-accent/10 text-accent text-sm font-bold rounded-full">
                Candidat OAIB 2026
              </span>
            </div>

            {/* Profile completion */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-text-secondary">Dossier complété</span>
                <span className="font-bold text-primary">{calculateCompletion()}%</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${calculateCompletion()}%` }}
                />
              </div>
            </div>

            {/* Quick info */}
            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">{personalInfo.city}, {personalInfo.country}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <School className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">{schoolInfo.establishment}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">Inscrit le 15 Jan 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form sections */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-border mb-6 overflow-hidden">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-text-secondary hover:text-text hover:bg-background-alt'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                  {tab.id === 'tutor' && isMinor() && (
                    <span className="px-1.5 py-0.5 bg-benin-red/10 text-benin-red text-xs font-bold rounded">
                      Requis
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="text-lg font-bold text-text mb-6">Informations personnelles</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Prénom *</label>
                  <input
                    type="text"
                    value={personalInfo.firstName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Nom *</label>
                  <input
                    type="text"
                    value={personalInfo.lastName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Téléphone *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Date de naissance *</label>
                  <input
                    type="date"
                    value={personalInfo.birthDate}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, birthDate: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Genre *</label>
                  <select
                    value={personalInfo.gender}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                  >
                    <option value="male">Masculin</option>
                    <option value="female">Féminin</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-2">Adresse</label>
                  <input
                    type="text"
                    value={personalInfo.address}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Ville *</label>
                  <input
                    type="text"
                    value={personalInfo.city}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Pays *</label>
                  <input
                    type="text"
                    value={personalInfo.country}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          )}

          {/* School Info Tab */}
          {activeTab === 'school' && (
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="text-lg font-bold text-text mb-6">Informations scolaires</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-2">Établissement *</label>
                  <div className="relative">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      value={schoolInfo.establishment}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, establishment: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                      placeholder="Nom de l'établissement"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Niveau *</label>
                  <select
                    value={schoolInfo.level}
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, level: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Seconde">Seconde</option>
                    <option value="Première">Première</option>
                    <option value="Terminale">Terminale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Classe / Série *</label>
                  <input
                    type="text"
                    value={schoolInfo.class}
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, class: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                    placeholder="Ex: Terminale D"
                  />
                </div>
                
                <div className="md:col-span-2 pt-4 border-t border-border">
                  <h4 className="font-bold text-text mb-4 flex items-center gap-2">
                    <BookOpen size={18} />
                    Notes académiques
                  </h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Moyenne générale *</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={schoolInfo.averageGrade}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, averageGrade: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                      placeholder="Ex: 15.5"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">/20</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Note en Mathématiques *</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={schoolInfo.mathGrade}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, mathGrade: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                      placeholder="Ex: 17"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">/20</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Note en Sciences *</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={schoolInfo.scienceGrade}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, scienceGrade: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                      placeholder="Ex: 16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">/20</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tutor Info Tab */}
          {activeTab === 'tutor' && (
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-text">Informations du tuteur légal</h3>
                  <p className="text-sm text-text-secondary mt-1">Requis pour les candidats mineurs</p>
                </div>
                {isMinor() && (
                  <span className="px-3 py-1 bg-benin-red/10 text-benin-red text-sm font-bold rounded-full">
                    Obligatoire
                  </span>
                )}
              </div>

              {!isMinor() && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-700">
                      Vous êtes majeur(e), cette section est optionnelle.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Prénom {isMinor() && '*'}
                  </label>
                  <input
                    type="text"
                    value={tutorInfo.firstName}
                    onChange={(e) => setTutorInfo({ ...tutorInfo, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Nom {isMinor() && '*'}
                  </label>
                  <input
                    type="text"
                    value={tutorInfo.lastName}
                    onChange={(e) => setTutorInfo({ ...tutorInfo, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Lien de parenté {isMinor() && '*'}
                  </label>
                  <select
                    value={tutorInfo.relationship}
                    onChange={(e) => setTutorInfo({ ...tutorInfo, relationship: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Père">Père</option>
                    <option value="Mère">Mère</option>
                    <option value="Tuteur légal">Tuteur légal</option>
                    <option value="Oncle">Oncle</option>
                    <option value="Tante">Tante</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Téléphone {isMinor() && '*'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="tel"
                      value={tutorInfo.phone}
                      onChange={(e) => setTutorInfo({ ...tutorInfo, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="email"
                      value={tutorInfo.email}
                      onChange={(e) => setTutorInfo({ ...tutorInfo, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:border-primary disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-text">Documents justificatifs</h3>
                  <p className="text-sm text-text-secondary mt-1">Uploadez vos bulletins scolaires (PDF uniquement)</p>
                </div>
              </div>

              {/* Upload zone */}
              <label className="block mb-6 cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-bold text-text mb-1">Cliquez pour uploader un document</p>
                  <p className="text-sm text-text-secondary">ou glissez-déposez un fichier PDF (max 5 MB)</p>
                </div>
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </label>

              {/* Documents list */}
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-4 p-4 bg-background rounded-xl">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text truncate">{doc.name}</p>
                      <p className="text-sm text-text-secondary">{doc.size} • {doc.uploadDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(doc.status)}
                      <button className="p-2 hover:bg-white rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-text-muted" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-benin-red" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {documents.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary">Aucun document uploadé</p>
                </div>
              )}

              {/* Required documents info */}
              <div className="mt-6 p-4 bg-benin-yellow/10 border border-benin-yellow/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-benin-yellow shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-text">Documents requis</p>
                    <ul className="text-sm text-text-secondary mt-2 space-y-1 list-disc list-inside">
                      <li>Bulletin du 1er trimestre de l'année en cours</li>
                      <li>Bulletin du 2ème trimestre (si disponible)</li>
                      <li>Certificat de scolarité</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
