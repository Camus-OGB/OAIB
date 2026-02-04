import { supabase } from '../../../lib/supabaseClient';

export interface SignUpPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
}

export const signUp = async (payload: SignUpPayload) => {
  const { email, password, ...metadata } = payload;
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
};

export const verifySignupOtp = async (email: string, token: string) => {
  const response = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });
  const session = response.data.session;
  if (session?.access_token && session.refresh_token) {
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  }
  return response;
};

export const resendSignupOtp = async (email: string) => {
  return supabase.auth.resend({
    type: 'signup',
    email,
  });
};

export const signIn = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const sendPasswordResetOtp = async (email: string) => {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });
};

export const verifyPasswordResetOtp = async (email: string, token: string) => {
  const response = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  const session = response.data.session;
  if (session?.access_token && session.refresh_token) {
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  }
  return response;
};

export const updatePassword = async (newPassword: string) => {
  return supabase.auth.updateUser({ password: newPassword });
};
