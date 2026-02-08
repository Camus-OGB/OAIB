import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, BrainCircuit, ArrowRight, ArrowLeft, CheckCircle, Lock, Eye, EyeOff, RefreshCw, KeyRound } from 'lucide-react';
import { sendPasswordResetOtp, verifyPasswordResetOtp, updatePassword, signOut } from '../services/authService';

type Step = 'email' | 'code' | 'reset' | 'success';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Veuillez entrer votre email'); return; }
    setIsLoading(true);
    setError('');
    try {
      const { error: otpError } = await sendPasswordResetOtp(email.trim());
      if (otpError) { setError("Impossible d'envoyer le code. Vérifiez votre email."); return; }
      setCode(['', '', '', '', '', '']);
      setResendCooldown(60);
      setStep('code');
    } catch { setError('Une erreur est survenue. Veuillez réessayer.'); } finally { setIsLoading(false); }
  };

  const handleVerifyCode = async () => {
    const codeString = code.join('');
    if (codeString.length !== 6) { setError('Veuillez entrer le code complet'); return; }
    setIsLoading(true);
    setError('');
    try {
      const { error: verifyError } = await verifyPasswordResetOtp(email.trim(), codeString);
      if (verifyError) { setError('Code incorrect ou expiré.'); return; }
      setStep('reset');
    } catch { setError('Vérification impossible pour le moment.'); } finally { setIsLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères'); return; }
    if (newPassword !== confirmPassword) { setError('Les mots de passe ne correspondent pas'); return; }
    setIsLoading(true);
    setError('');
    try {
      const { error: updateError } = await updatePassword(newPassword);
      if (updateError) { setError('Impossible de mettre à jour le mot de passe.'); return; }
      await signOut();
      setStep('success');
    } catch { setError('Une erreur est survenue pendant la mise à jour.'); } finally { setIsLoading(false); }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError('');
    if (value && index < 5) document.getElementById(`code-${index + 1}`)?.focus();
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) document.getElementById(`code-${index - 1}`)?.focus();
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError('');
    try {
      const { error: resendError } = await sendPasswordResetOtp(email.trim());
      if (resendError) { setError('Impossible de renvoyer le code.'); return; }
      setCode(['', '', '', '', '', '']);
      setResendCooldown(60);
    } catch { setError("Erreur lors de l'envoi du code."); } finally { setIsResending(false); }
  };

  const stepIcons = { email: KeyRound, code: Mail, reset: Lock, success: CheckCircle };
  const StepIcon = stepIcons[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-blue flex items-center justify-center p-6 relative overflow-hidden">
      <motion.div className="absolute top-20 left-20 w-72 h-72 bg-white/15 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow/25 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <BrainCircuit className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="font-black text-white text-xl drop-shadow">OAIB</span>
            <span className="text-accent block text-sm font-semibold drop-shadow">Olympiades IA Bénin</span>
          </div>
        </motion.div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
          <AnimatePresence mode="wait">
            {/* Step: Email */}
            {step === 'email' && (
              <motion.div key="email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="text-center mb-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                    <StepIcon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-black text-slate-800">Mot de passe oublié</h2>
                  <p className="text-slate-500 mt-2">Entrez votre email pour recevoir un code</p>
                </div>

                {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</motion.div>}

                <form onSubmit={handleSendCode} className="space-y-5">
                  <div>
                    <label htmlFor="email-reset" className="block text-sm font-medium text-slate-600 mb-2">Adresse email</label>
                    <div className="relative">
                      <input id="email-reset" name="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} className="peer w-full pl-16 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all" placeholder="votreemail@exemple.com" />
                      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-slate-100 text-slate-400 peer-focus:bg-primary peer-focus:text-white">
                        <Mail size={20} />
                      </div>
                    </div>
                  </div>
                  <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-light hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50">
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Envoyer le code</span><ArrowRight size={18} /></>}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Step: Code */}
            {step === 'code' && (
              <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                    <Mail className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-black text-slate-800">Vérification</h2>
                  <p className="text-slate-500 mt-2">Code envoyé à <span className="text-slate-800 font-semibold">{email}</span></p>
                </div>

                {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">{error}</motion.div>}

                <div className="flex justify-center gap-3 mb-6">
                  {code.map((digit, index) => (
                    <motion.input key={index} id={`code-${index}`} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleCodeChange(index, e.target.value)} onKeyDown={(e) => handleCodeKeyDown(index, e)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`w-12 h-14 text-center text-xl font-bold bg-slate-50 border-2 rounded-xl text-slate-800 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all ${digit ? 'border-primary bg-primary/10' : 'border-slate-300'}`} />
                  ))}
                </div>

                <motion.button onClick={handleVerifyCode} disabled={isLoading || code.some(d => !d)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-light hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Vérifier</span><ArrowRight size={18} /></>}
                </motion.button>

                <div className="mt-4 flex justify-between">
                  <button onClick={() => setStep('email')} className="text-slate-500 hover:text-primary transition-colors inline-flex items-center gap-1 text-sm"><ArrowLeft size={16} />Changer d'email</button>
                  <button onClick={handleResendCode} disabled={resendCooldown > 0 || isResending} className="text-primary font-semibold text-sm disabled:opacity-50 inline-flex items-center gap-1">
                    {isResending ? <><div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />Envoi...</> : resendCooldown > 0 ? <><RefreshCw size={14} />{resendCooldown}s</> : <><RefreshCw size={14} />Renvoyer</>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step: Reset */}
            {step === 'reset' && (
              <motion.div key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                    <Lock className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-black text-slate-800">Nouveau mot de passe</h2>
                  <p className="text-slate-500 mt-2">Créez un nouveau mot de passe sécurisé</p>
                </div>

                {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</motion.div>}

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-slate-600 mb-2">Nouveau mot de passe</label>
                    <div className="relative">
                      <input id="new-password" name="newPassword" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setError(''); }} className="peer w-full pl-16 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all" placeholder="••••••••" />
                      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-slate-100 text-slate-400 peer-focus:bg-primary peer-focus:text-white"><Lock size={20} /></div>
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center text-slate-400">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">Minimum 8 caractères</p>
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-600 mb-2">Confirmer</label>
                    <div className="relative">
                      <input id="confirm-password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }} className="peer w-full pl-16 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all" placeholder="••••••••" />
                      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-slate-100 text-slate-400 peer-focus:bg-primary peer-focus:text-white"><Lock size={20} /></div>
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center text-slate-400">{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                  </div>
                  <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-light hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50">
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Réinitialiser</span><ArrowRight size={18} /></>}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Step: Success */}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-24 h-24 bg-gradient-to-br from-green-500 to-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Mot de passe réinitialisé !</h2>
                <p className="text-slate-600 mb-6">Votre mot de passe a été modifié avec succès.</p>
                <motion.button onClick={() => navigate('/connexion')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-light hover:shadow-lg hover:shadow-primary/30 transition-all">
                  <span>Se connecter</span><ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {step !== 'success' && (
            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <Link to="/connexion" className="text-slate-500 hover:text-primary transition-colors">← Retour à la connexion</Link>
            </div>
          )}
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">© 2026 Olympiades IA Bénin. Tous droits réservés.</p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
