import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  BrainCircuit, 
  ArrowRight,
  User,
  Phone,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { signUp, type SignUpPayload } from '../services/authService';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.birthDate) newErrors.birthDate = 'La date de naissance est requise';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    else if (formData.password.length < 8) newErrors.password = 'Minimum 8 caractères';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    if (!acceptTerms) newErrors.terms = 'Vous devez accepter les conditions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    setFormError('');

    try {
      const payload: SignUpPayload = {
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        birthDate: formData.birthDate,
      };
      const { error } = await signUp(payload);
      if (error) {
        if (error.message.includes('already registered')) {
          setFormError('Un compte existe déjà avec cet email.');
        } else {
          setFormError('Inscription impossible pour le moment.');
        }
        return;
      }

      navigate('/verification-email', { state: { email: formData.email } });
    } catch (err) {
      setFormError('Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="font-black text-white text-xl">OAIB</span>
              <span className="text-accent block text-sm font-medium">Olympiades IA Bénin</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white mb-4">
            Rejoignez l'aventure OAIB 2026
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Inscrivez-vous pour participer aux Olympiades d'Intelligence Artificielle du Bénin et représenter votre pays à l'international.
          </p>

          {/* Steps indicator */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-white' : 'text-white/50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-accent text-primary' : 'bg-white/20'
              }`}>
                {step > 1 ? <CheckCircle size={18} /> : '1'}
              </div>
              <span className="font-medium">Informations</span>
            </div>
            <div className="flex-1 h-0.5 bg-white/20">
              <div className={`h-full bg-accent transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-white' : 'text-white/50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-accent text-primary' : 'bg-white/20'
              }`}>
                2
              </div>
              <span className="font-medium">Sécurité</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/60 text-sm">
            Déjà inscrit ?{' '}
            <Link to="/connexion" className="text-accent font-bold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="font-black text-text text-xl">OAIB</span>
              <span className="text-accent block text-sm font-medium">Olympiades IA Bénin</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-border p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-text">Créer un compte</h2>
              <p className="text-text-secondary mt-2">
                {step === 1 ? 'Vos informations personnelles' : 'Sécurisez votre compte'}
              </p>
            </div>

            {/* Mobile steps */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-border'}`} />
              <div className="w-8 h-0.5 bg-border" />
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Prénom *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3.5 bg-background border rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                            errors.firstName ? 'border-benin-red' : 'border-border'
                          }`}
                          placeholder="Jean"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-benin-red text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3.5 bg-background border rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.lastName ? 'border-benin-red' : 'border-border'
                        }`}
                        placeholder="Dupont"
                      />
                      {errors.lastName && (
                        <p className="text-benin-red text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Adresse email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3.5 bg-background border rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.email ? 'border-benin-red' : 'border-border'
                        }`}
                        placeholder="votreemail@exemple.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-benin-red text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Téléphone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3.5 bg-background border rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.phone ? 'border-benin-red' : 'border-border'
                        }`}
                        placeholder="+229 97 00 00 00"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-benin-red text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Date de naissance *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3.5 bg-background border rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.birthDate ? 'border-benin-red' : 'border-border'
                        }`}
                      />
                    </div>
                    {errors.birthDate && (
                      <p className="text-benin-red text-xs mt-1">{errors.birthDate}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all"
                  >
                    Continuer
                    <ArrowRight size={18} />
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-12 py-3.5 bg-background border rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.password ? 'border-benin-red' : 'border-border'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-benin-red text-xs mt-1">{errors.password}</p>
                    )}
                    <p className="text-xs text-text-muted mt-1">
                      Minimum 8 caractères, avec majuscules et chiffres
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Confirmer le mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-12 py-3.5 bg-background border rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.confirmPassword ? 'border-benin-red' : 'border-border'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-benin-red text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="w-5 h-5 mt-0.5 rounded border-border text-primary focus:ring-primary" 
                      />
                      <span className="text-sm text-text-secondary">
                        J'accepte les{' '}
                        <Link to="/conditions" className="text-accent font-medium hover:underline">
                          Conditions d'utilisation
                        </Link>
                        {' '}et la{' '}
                        <Link to="/confidentialite" className="text-accent font-medium hover:underline">
                          Politique de confidentialité
                        </Link>
                      </span>
                    </label>
                    {errors.terms && (
                      <p className="text-benin-red text-xs mt-1">{errors.terms}</p>
                    )}
                  </div>

                  {formError && (
                    <div className="p-4 bg-benin-red/10 border border-benin-red/30 rounded-xl text-benin-red text-sm">
                      {formError}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 border border-border text-text-secondary font-bold rounded-xl hover:bg-background-alt transition-all"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          S'inscrire
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>

            <div className="mt-8 pt-6 border-t border-border text-center lg:hidden">
              <p className="text-text-secondary">
                Déjà inscrit ?{' '}
                <Link to="/connexion" className="text-accent font-bold hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-text-muted text-sm mt-6">
            © 2026 Olympiades IA Bénin. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
