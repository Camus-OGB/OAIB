import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Mail, ArrowRight, RefreshCw, CheckCircle, Sparkles } from 'lucide-react';
import { verifySignupOtp, resendSignupOtp } from '../services/authService';

const OTPVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'votre@email.com';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => { if (i < 6) newOtp[i] = char; });
    setOtp(newOtp);
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setError('Veuillez entrer le code complet'); return; }
    setIsLoading(true);
    setError('');
    try {
      const { error: verifyError } = await verifySignupOtp(email, code);
      if (verifyError) { setError('Code incorrect ou expiré.'); return; }
      setIsVerified(true);
      setTimeout(() => navigate('/etudiant'), 2000);
    } catch { setError('Échec de la vérification, veuillez réessayer.'); } finally { setIsLoading(false); }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError('');
    try {
      const { error: resendError } = await resendSignupOtp(email);
      if (resendError) { setError('Impossible de renvoyer le code pour le moment.'); return; }
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch { setError('Impossible de renvoyer le code.'); } finally { setIsResending(false); }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md text-center">
          <div className="bg-white rounded-3xl border border-slate-200 p-12 shadow-xl">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/30">
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Email vérifié !</h2>
            <p className="text-slate-600 mb-6">Votre compte a été créé avec succès. Redirection en cours...</p>
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex relative overflow-hidden">
      {/* Background effects */}
      <motion.div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity }} />

      {/* Left Panel - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative z-10 bg-primary">
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6 }}
          className="max-w-lg"
        >
          <div className="flex items-center gap-4 mb-8">
            <motion.div 
              className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <BrainCircuit className="w-9 h-9 text-white" />
            </motion.div>
            <div>
              <span className="font-black text-white text-3xl">OAIB</span>
              <span className="text-white/80 block text-base font-medium">Olympiades IA Bénin</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-black text-white mb-4 leading-tight">
            Vérifiez votre
            <span className="text-accent"> email</span>
          </h1>
          <p className="text-white/80 text-lg mb-6">
            Un code de vérification a été envoyé à votre adresse email. Entrez ce code pour activer votre compte.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full text-white font-medium border border-white/30 mb-8">
            <Sparkles size={14} className="text-accent" />
            <span className="max-w-[280px] truncate">{email}</span>
          </div>

          {/* Visual illustration */}
          <div className="relative">
            <motion.div 
              className="w-full h-48 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center border border-white/30"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Mail className="w-10 h-10 text-white" />
                </motion.div>
                <motion.div 
                  className="flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-accent rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </motion.div>
                <motion.div 
                  className="flex gap-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {['1', '2', '3', '4', '5', '6'].map((num, i) => (
                    <motion.div
                      key={i}
                      className="w-8 h-10 bg-white/20 border border-white/30 rounded-lg flex items-center justify-center text-white font-bold"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                    >
                      {num}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - OTP Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="font-black text-slate-800 text-xl">OAIB</span>
              <span className="text-primary block text-sm font-medium">Olympiades IA Bénin</span>
            </div>
          </motion.div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
            <div className="text-center mb-6">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: 'spring', delay: 0.2 }} 
                className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/30"
              >
                <Mail className="w-7 h-7 text-white" />
              </motion.div>
              <h2 className="text-xl font-black text-slate-800">Saisissez le code</h2>
              <p className="text-slate-500 mt-1 text-sm">Code à 6 chiffres</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                {error}
              </motion.div>
            )}

            {/* OTP Input */}
            <div className="mb-6">
              <p className="text-slate-500 text-sm text-center mb-4">Entrez le code à 6 chiffres</p>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-slate-50 border-2 rounded-xl text-slate-800 focus:outline-none focus:border-primary focus:bg-primary/5 focus:ring-4 focus:ring-primary/20 focus:scale-105 transition-all duration-200 ${
                      error ? 'border-red-400 bg-red-50' : digit ? 'border-primary bg-primary/10' : 'border-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <motion.button
              onClick={handleVerify}
              disabled={isLoading || otp.some(d => !d)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Vérifier mon compte</span>
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>

            {/* Resend code */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-500 text-sm text-center mb-3">Vous n'avez pas reçu le code ?</p>
              <motion.button
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
                whileHover={{ scale: resendCooldown > 0 ? 1 : 1.02 }}
                whileTap={{ scale: resendCooldown > 0 ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-primary font-semibold hover:bg-primary/5 hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isResending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <RefreshCw size={16} className="animate-pulse" />
                    <span>Renvoyer dans {resendCooldown}s</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    <span>Renvoyer le code</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Back link */}
            <div className="mt-6 text-center">
              <Link to="/inscription" className="text-slate-500 hover:text-primary transition-colors inline-flex items-center gap-2 text-sm">
                ← Retour à l'inscription
              </Link>
            </div>
          </div>

          <p className="text-center text-slate-400 text-xs mt-6">© 2026 Olympiades IA Bénin. Tous droits réservés.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
