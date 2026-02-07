import { mockAuth } from '../../../lib/mockAuth';

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
  return mockAuth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
};

export const verifySignupOtp = async (_email: string, _token: string) => {
  // Mock: OTP verification always succeeds
  await new Promise(resolve => setTimeout(resolve, 500));
  const session = await mockAuth.getSession();
  return { data: session.data, error: null };
};

export const resendSignupOtp = async (_email: string) => {
  // Mock: Always succeeds
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: {}, error: null };
};

export const signIn = async (email: string, password: string) => {
  return mockAuth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return mockAuth.signOut();
};

export const sendPasswordResetOtp = async (email: string) => {
  return mockAuth.resetPassword(email);
};

export const verifyPasswordResetOtp = async (_email: string, _token: string) => {
  // Mock: OTP verification always succeeds
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: {}, error: null };
};

export const updatePassword = async (newPassword: string) => {
  return mockAuth.updatePassword(newPassword);
};
