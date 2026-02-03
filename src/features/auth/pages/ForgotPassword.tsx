import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, BrainCircuit, ArrowRight, ArrowLeft, CheckCircle, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
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
    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error: otpError } = await sendPasswordResetOtp(email.trim());
      if (otpError) {
        setError('Impossible d\'envoyer le code. Vérifiez votre email.');
        return;
      }
      setCode(['', '', '', '', '', '']);
      setResendCooldown(60);
      setStep('code');
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const codeString = code.join('');
    if (codeString.length !== 6) {
      setError('Veuillez entrer le code complet');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error: verifyError } = await verifyPasswordResetOtp(email.trim(), codeString);
      if (verifyError) {
        setError('Code incorrect ou expiré.');
        return;
      }
      setStep('reset');
    } catch (err) {
      setError('Vérification impossible pour le moment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error: updateError } = await updatePassword(newPassword);
      if (updateError) {
        setError('Impossible de mettre à jour le mot de passe.');
        return;
      }
      await signOut();
      setStep('success');
    } catch (err) {
      setError('Une erreur est survenue pendant la mise à jour.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError('');
    try {
      const { error: resendError } = await sendPasswordResetOtp(email.trim());
      if (resendError) {
        setError('Impossible de renvoyer le code.');
        return;
      }
      setCode(['', '', '', '', '', '']);
      setResendCooldown(60);
    } catch (err) {
      setError('Erreur lors de l\'envoi du code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <BrainCircuit className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="font-black text-text text-xl">OAIB</span>
            <span className="text-accent block text-sm font-medium">Olympiades IA Bénin</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-border p-8 shadow-xl">
          {/* Step: Enter Email */}
          {step === 'email' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-black text-text">Mot de passe oublié</h2>
                <p className="text-text-secondary mt-2">
                  Entrez votre email pour recevoir un code de réinitialisation
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-benin-red/10 border border-benin-red/30 rounded-xl text-benin-red text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSendCode} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="votreemail@exemple.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Envoyer le code
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Step: Enter Code */}
          {step === 'code' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-black text-text">Vérification</h2>
                <p className="text-text-secondary mt-2">
                  Un code a été envoyé à
                </p>
                <p className="font-bold text-text">{email}</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-benin-red/10 border border-benin-red/30 rounded-xl text-benin-red text-sm text-center">
                  {error}
                </div>
              )}

              <div className="flex justify-center gap-3 mb-6">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-xl font-bold bg-background border-2 rounded-xl text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                      digit ? 'border-primary' : 'border-border'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={isLoading || code.some(d => !d)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Vérifier
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || isResending}
                className="w-full mt-3 inline-flex items-center justify-center gap-2 text-accent font-semibold disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                    Renvoi en cours...
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <RefreshCw size={16} />
                    Renvoyer dans {resendCooldown}s
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    Renvoyer le code
                  </>
                )}
              </button>

              <button
                onClick={() => setStep('email')}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 text-text-secondary hover:text-text transition-colors"
              >
                <ArrowLeft size={18} />
                Changer d'email
              </button>
            </>
          )}

          {/* Step: Reset Password */}
          {step === 'reset' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-black text-text">Nouveau mot de passe</h2>
                <p className="text-text-secondary mt-2">
                  Créez un nouveau mot de passe sécurisé
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-benin-red/10 border border-benin-red/30 rounded-xl text-benin-red text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                      className="w-full pl-12 pr-12 py-3.5 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                  <p className="text-xs text-text-muted mt-1">
                    Minimum 8 caractères
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      className="w-full pl-12 pr-12 py-3.5 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Réinitialiser
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-text mb-2">Mot de passe réinitialisé !</h2>
              <p className="text-text-secondary mb-6">
                Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.
              </p>
              <button
                onClick={() => navigate('/connexion')}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all"
              >
                Se connecter
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Back to login link */}
          {step !== 'success' && (
            <div className="mt-8 pt-6 border-t border-border text-center">
              <Link to="/connexion" className="text-text-secondary hover:text-text transition-colors">
                ← Retour à la connexion
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-text-muted text-sm mt-6">
          © 2026 Olympiades IA Bénin. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
