import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, BrainCircuit, ArrowRight, ArrowLeft,
  User, Phone, Calendar, CheckCircle, Sparkles, Shield, Award
} from 'lucide-react';
import { signUp, type SignUpPayload } from '../services/authService';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', birthDate: '', password: '', confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
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
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    if (!acceptTerms) newErrors.terms = 'Vous devez accepter les conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => { if (step === 1 && validateStep1()) setStep(2); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setIsLoading(true);
    setFormError('');
    try {
      const payload: SignUpPayload = {
        email: formData.email.trim(), password: formData.password, firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(), phone: formData.phone.trim(), birthDate: formData.birthDate,
      };
      const { error } = await signUp(payload);
      if (error) {
        setFormError(error.message.includes('already registered') ? 'Un compte existe déjà avec cet email.' : 'Inscription impossible pour le moment.');
        return;
      }
      navigate('/verification-email', { state: { email: formData.email } });
    } catch { setFormError('Une erreur inattendue est survenue.'); } finally { setIsLoading(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const InputField = ({ name, label, type = 'text', icon: Icon, placeholder }: { name: string; label: string; type?: string; icon: React.ElementType; placeholder: string }) => (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2">{label}</label>
      <div className={`relative transition-all duration-300 ${focusedField === name ? 'scale-[1.02]' : ''}`}>
        <div className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${focusedField === name ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
          <Icon size={20} />
        </div>
        <input type={type} name={name} value={formData[name as keyof typeof formData]} onChange={handleChange} onFocus={() => setFocusedField(name)} onBlur={() => setFocusedField(null)}
          className={`w-full pl-16 pr-4 py-4 bg-slate-50 border rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all ${errors[name] ? 'border-red-400' : 'border-slate-200'}`}
          placeholder={placeholder} />
      </div>
      {errors[name] && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500" />{errors[name]}</motion.p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        <motion.div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="font-black text-white text-2xl tracking-tight">OAIB</span>
              <span className="text-accent block text-sm font-semibold">Olympiades IA Bénin</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white/90 text-sm font-medium mb-6 border border-white/20">
              <Sparkles size={16} className="text-accent" />
              Inscriptions ouvertes
            </div>
            <h1 className="text-5xl font-black text-white mb-6 leading-tight">
              Rejoignez<br /><span className="text-accent">l'aventure OAIB</span>
            </h1>
            <p className="text-white/70 text-lg max-w-md leading-relaxed">
              Participez aux Olympiades d'Intelligence Artificielle du Bénin et représentez votre pays à l'international.
            </p>
          </motion.div>

          {/* Steps */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${step >= 1 ? 'bg-accent text-primary' : 'bg-white/10 text-white/50'}`}>
                {step > 1 ? <CheckCircle size={24} /> : '1'}
              </div>
              <div><p className="font-semibold text-white">Informations personnelles</p><p className="text-white/60 text-sm">Prénom, nom, email, téléphone</p></div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${step >= 2 ? 'bg-accent text-primary' : 'bg-white/10 text-white/50'}`}>2</div>
              <div><p className={`font-semibold ${step >= 2 ? 'text-white' : 'text-white/50'}`}>Sécurité du compte</p><p className="text-white/60 text-sm">Mot de passe et conditions</p></div>
            </div>
          </motion.div>

          <div className="pt-8">
            <p className="text-white/80">Déjà inscrit ? <Link to="/connexion" className="text-accent font-bold hover:text-accent/80 transition-colors">Se connecter</Link></p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <div><span className="font-black text-slate-800 text-xl">OAIB</span><span className="text-primary block text-sm font-medium">Olympiades IA Bénin</span></div>
          </motion.div>

          {/* Mobile steps */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-accent text-white' : 'bg-slate-200 text-slate-500'}`}>{step > 1 ? <CheckCircle size={18} /> : '1'}</div>
            <div className={`w-16 h-1 rounded-full ${step >= 2 ? 'bg-accent' : 'bg-slate-200'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-accent text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
            <div className="text-center mb-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                {step === 1 ? <User className="w-8 h-8 text-white" /> : <Shield className="w-8 h-8 text-white" />}
              </motion.div>
              <h2 className="text-2xl font-black text-slate-800">Créer un compte</h2>
              <p className="text-slate-500 mt-2">{step === 1 ? 'Vos informations personnelles' : 'Sécurisez votre compte'}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField name="firstName" label="Prénom *" icon={User} placeholder="Jean" />
                      <InputField name="lastName" label="Nom *" icon={User} placeholder="Dupont" />
                    </div>
                    <InputField name="email" label="Email *" type="email" icon={Mail} placeholder="votreemail@exemple.com" />
                    <InputField name="phone" label="Téléphone *" type="tel" icon={Phone} placeholder="+229 97 00 00 00" />
                    <InputField name="birthDate" label="Date de naissance *" type="date" icon={Calendar} placeholder="" />
                    <motion.button type="button" onClick={handleNextStep} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all">
                      <span>Continuer</span><ArrowRight size={20} />
                    </motion.button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Mot de passe *</label>
                      <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                        <div className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${focusedField === 'password' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}><Lock size={20} /></div>
                        <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                          className={`w-full pl-16 pr-14 py-4 bg-slate-50 border rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all ${errors.password ? 'border-red-400' : 'border-slate-200'}`} placeholder="••••••••" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 transition-all">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.password && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1.5">{errors.password}</motion.p>}
                      <p className="text-xs text-slate-400 mt-1.5">Minimum 8 caractères</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Confirmer *</label>
                      <div className={`relative transition-all duration-300 ${focusedField === 'confirmPassword' ? 'scale-[1.02]' : ''}`}>
                        <div className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${focusedField === 'confirmPassword' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}><Lock size={20} /></div>
                        <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField(null)}
                          className={`w-full pl-16 pr-14 py-4 bg-slate-50 border rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all ${errors.confirmPassword ? 'border-red-400' : 'border-slate-200'}`} placeholder="••••••••" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 transition-all">
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1.5">{errors.confirmPassword}</motion.p>}
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-primary/30 transition-all">
                      <div className="relative mt-0.5">
                        <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="peer sr-only" />
                        <div className="w-5 h-5 rounded-md border border-slate-300 bg-white peer-checked:bg-primary peer-checked:border-primary transition-all" />
                        <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                      </div>
                      <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">J'accepte les <Link to="/conditions" className="text-primary font-medium hover:underline">Conditions d'utilisation</Link> et la <Link to="/confidentialite" className="text-primary font-medium hover:underline">Politique de confidentialité</Link></span>
                    </label>
                    {errors.terms && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs">{errors.terms}</motion.p>}

                    {formError && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{formError}</motion.div>}

                    <div className="flex gap-3">
                      <motion.button type="button" onClick={() => setStep(1)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 flex items-center justify-center gap-2 py-4 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all">
                        <ArrowLeft size={18} /><span>Retour</span>
                      </motion.button>
                      <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50">
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>S'inscrire</span><ArrowRight size={18} /></>}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

          </div>

          <p className="text-center text-slate-400 text-sm mt-6">© 2026 Olympiades IA Bénin. Tous droits réservés.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
