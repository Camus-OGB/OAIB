/**
 * Auth Service — appelle le backend Django (JWT).
 * Remplace l'ancien mock par de vrais appels API.
 */
import api, { tokenStore, type ApiError } from '../../../lib/apiClient';

// ── Types ─────────────────────────────────────────────────────
export interface SignUpPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
}

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  birth_date?: string;
  role: 'student' | 'admin' | 'moderator';
  is_active: boolean;
  profile_status?: 'none' | 'incomplete' | 'pending' | 'approved' | 'rejected';
}

interface TokenPair {
  access: string;
  refresh: string;
}

interface LoginResponse extends TokenPair {
  user?: AuthUser;
}

// Helper pour formater les réponses à l'ancienne interface { data, error }
function ok<T>(data: T) {
  return { data, error: null as null };
}
function fail(err: ApiError) {
  return { data: null as null, error: new Error(err.message) };
}

// ── Inscription ───────────────────────────────────────────────
export const signUp = async (payload: SignUpPayload) => {
  const res = await api.post<{ id: number; email: string }>(
    '/auth/register/',
    {
      email: payload.email,
      password: payload.password,
      password_confirm: payload.password,
      first_name: payload.firstName,
      last_name: payload.lastName,
      phone: payload.phone,
      birth_date: payload.birthDate,
    },
    { auth: false },
  );

  if (res.error) return fail(res.error);
  return ok({ user: res.data });
};

// ── Vérification OTP (inscription) ───────────────────────────
export const verifySignupOtp = async (email: string, token: string) => {
  const res = await api.post<TokenPair>(
    '/auth/otp/verify/',
    { email, code: token, purpose: 'email_verify' },
    { auth: false },
  );

  if (res.error) return fail(res.error);

  // Stocker les JWT si le backend les renvoie après vérification
  if (res.data.access) {
    tokenStore.set(res.data.access, res.data.refresh);
  }
  return ok(res.data);
};

// ── Renvoyer OTP (inscription) ───────────────────────────────
export const resendSignupOtp = async (email: string) => {
  const res = await api.post(
    '/auth/otp/request/',
    { email, purpose: 'email_verify' },
    { auth: false },
  );

  if (res.error) return fail(res.error);
  return ok(res.data);
};

// ── Connexion ─────────────────────────────────────────────────
export const signIn = async (email: string, password: string) => {
  const res = await api.post<LoginResponse>(
    '/auth/login/',
    { email, password },
    { auth: false },
  );

  if (res.error) return fail(res.error);

  // Stocker les tokens
  tokenStore.set(res.data.access, res.data.refresh);

  // Récupérer le profil utilisateur
  const meRes = await api.get<AuthUser>('/auth/me/');
  const user = meRes.error ? null : meRes.data;

  return ok({ session: { access_token: res.data.access, refresh_token: res.data.refresh, user }, user });
};

// ── Déconnexion ───────────────────────────────────────────────
export const signOut = async () => {
  tokenStore.clear();
  return { error: null };
};

// ── Mot de passe oublié — envoyer OTP ────────────────────────
export const sendPasswordResetOtp = async (email: string) => {
  const res = await api.post(
    '/auth/otp/request/',
    { email, purpose: 'password_reset' },
    { auth: false },
  );

  if (res.error) return fail(res.error);
  return ok(res.data);
};

// ── Mot de passe oublié — vérifier OTP ───────────────────────
export const verifyPasswordResetOtp = async (email: string, token: string) => {
  const res = await api.post(
    '/auth/otp/verify/',
    { email, code: token, purpose: 'password_reset' },
    { auth: false },
  );

  if (res.error) return fail(res.error);
  return ok(res.data);
};

// ── Réinitialiser le mot de passe ─────────────────────────────
export const updatePassword = async (newPassword: string) => {
  const res = await api.post(
    '/auth/password/reset/',
    { new_password: newPassword, new_password_confirm: newPassword },
    { auth: false },
  );

  if (res.error) return fail(res.error);
  return ok(res.data);
};

// ── Changer le mot de passe (utilisateur connecté) ────────────
export const changePassword = async (currentPassword: string, newPassword: string) => {
  const res = await api.post('/auth/change-password/', {
    old_password: currentPassword,
    new_password: newPassword,
    new_password_confirm: newPassword,
  });
  if (res.error) return fail(res.error);
  return ok(res.data);
};

// ── Récupérer le profil connecté ─────────────────────────────
export const getMe = async () => {
  const res = await api.get<AuthUser>('/auth/me/');
  if (res.error) return fail(res.error);
  return ok(res.data);
};
