import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, BrainCircuit, ArrowRight, 
  Sparkles, Shield, Trophy, Users 
} from 'lucide-react';
import { signIn, getMe } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error: authError } = await signIn(email.trim(), password);
      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Veuillez vérifier votre email avant de vous connecter.');
        } else {
          setError(authError.message || 'Impossible de vous connecter pour le moment.');
        }
        return;
      }
      await refreshUser();
      
      // Attendre que l'utilisateur soit chargé et rediriger selon le rôle
      const { data: userData } = await getMe();
      if (userData?.role === 'admin' || userData?.role === 'moderator') {
        navigate('/admin');
      } else {
        navigate('/etudiant');
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Trophy, text: 'Compétition nationale d\'IA' },
    { icon: Users, text: '+1,200 candidats inscrits' },
    { icon: Shield, text: 'Plateforme sécurisée' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary to-blue">
        <motion.div 
          className="absolute top-20 left-20 w-72 h-72 bg-white/15 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="absolute inset-0 opacity-10" 
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full text-white text-sm font-semibold mb-6 border border-white/30 shadow-lg">
              <Sparkles size={16} className="text-yellow" />
              Édition 2026 ouverte
            </div>
            <h1 className="text-5xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Bienvenue dans<br />
              <span className="text-accent drop-shadow-lg">l'espace candidat</span>
            </h1>
            <p className="text-white text-lg max-w-md leading-relaxed drop-shadow-md">
              Connectez-vous pour accéder à votre tableau de bord, passer vos épreuves et suivre votre progression vers l'excellence.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.1 }} className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center border border-white/30 shadow-md">
                  <feature.icon size={20} className="text-white" />
                </div>
                <span className="font-semibold drop-shadow">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="pt-8">
            <p className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-medium">
              Pas encore inscrit ? <Link to="/inscription" className="text-white font-bold hover:text-yellow transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Créer un compte</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="font-black text-slate-800 text-xl">OAIB</span>
              <span className="text-primary block text-sm font-medium">Olympiades IA Bénin</span>
            </div>
          </motion.div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
            <div className="text-center mb-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Lock className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-black text-slate-800">Connexion</h2>
              <p className="text-slate-500 mt-2">Accédez à votre espace candidat</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-2">Adresse email</label>
                <div className="relative">
                  <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="peer w-full pl-16 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all" placeholder="votreemail@exemple.com" />
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-slate-100 text-slate-400 peer-focus:bg-primary peer-focus:text-white">
                    <Mail size={20} />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-2">Mot de passe</label>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="peer w-full pl-16 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all" placeholder="••••••••" />
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-slate-100 text-slate-400 peer-focus:bg-primary peer-focus:text-white">
                    <Lock size={20} />
                  </div>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center text-slate-400">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 rounded-md border border-slate-300 bg-slate-50 peer-checked:bg-primary peer-checked:border-primary transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                  <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">Se souvenir de moi</span>
                </label>
                <Link to="/mot-de-passe-oublie" className="text-sm text-primary font-medium hover:text-primary/80 transition-colors">Mot de passe oublié ?</Link>
              </div>

              <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 py-4 bg-red text-white font-bold rounded-xl hover:bg-red-light hover:shadow-lg hover:shadow-red/30 transition-all disabled:opacity-50">
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Se connecter</span><ArrowRight size={18} /></>}
              </motion.button>
            </form>

          </div>

          <p className="text-center text-slate-400 text-sm mt-6">© 2026 Olympiades IA Bénin. Tous droits réservés.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
