import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BrainCircuit, Mail, ArrowRight, RefreshCw, CheckCircle } from 'lucide-react';
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

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only keep last digit
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    // Focus last filled input or first empty
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Veuillez entrer le code complet');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error: verifyError } = await verifySignupOtp(email, code);
      if (verifyError) {
        setError('Code incorrect ou expiré.');
        return;
      }

      setIsVerified(true);
      setTimeout(() => {
        navigate('/etudiant');
      }, 2000);
    } catch (err) {
      setError('Échec de la vérification, veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setError('');
    try {
      const { error: resendError } = await resendSignupOtp(email);
      if (resendError) {
        setError('Impossible de renvoyer le code pour le moment.');
        return;
      }
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError('Impossible de renvoyer le code.');
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-3xl border border-border p-12 shadow-xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-text mb-2">Email vérifié !</h2>
            <p className="text-text-secondary mb-6">
              Votre compte a été créé avec succès. Vous allez être redirigé vers votre espace candidat.
            </p>
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </div>
    );
  }

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
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-text">Vérification email</h2>
            <p className="text-text-secondary mt-2">
              Un code à 6 chiffres a été envoyé à
            </p>
            <p className="font-bold text-text">{email}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-benin-red/10 border border-benin-red/30 rounded-xl text-benin-red text-sm text-center">
              {error}
            </div>
          )}

          {/* OTP Input */}
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 text-center text-xl font-bold bg-background border-2 rounded-xl text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                  error ? 'border-benin-red' : digit ? 'border-primary' : 'border-border'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading || otp.some(d => !d)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Resend code */}
          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm mb-2">
              Vous n'avez pas reçu le code ?
            </p>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className="inline-flex items-center gap-2 text-accent font-bold hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
            >
              {isResending ? (
                <>
                  <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  Envoi en cours...
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
          </div>

          {/* Back link */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link to="/inscription" className="text-text-secondary hover:text-text transition-colors">
              ← Retour à l'inscription
            </Link>
          </div>
        </div>

        <p className="text-center text-text-muted text-sm mt-6">
          © 2026 Olympiades IA Bénin. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
