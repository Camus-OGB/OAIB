/**
 * Mock Authentication Service
 * Simulates authentication without a real backend
 */

export interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin';
  created_at: string;
}

export interface MockSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: MockUser;
}

// Mock users database (stored in localStorage)
const STORAGE_KEY = 'oaib_mock_users';
const SESSION_KEY = 'oaib_mock_session';

const getStoredUsers = (): MockUser[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Default users
  const defaultUsers: MockUser[] = [
    {
      id: '1',
      email: 'admin@oaib.bj',
      firstName: 'Admin',
      lastName: 'OAIB',
      role: 'admin',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'student@oaib.bj',
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'student',
      created_at: new Date().toISOString(),
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

const saveUsers = (users: MockUser[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const getStoredSession = (): MockSession | null => {
  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) {
    const session = JSON.parse(stored) as MockSession;
    if (session.expires_at > Date.now()) {
      return session;
    }
    localStorage.removeItem(SESSION_KEY);
  }
  return null;
};

const saveSession = (session: MockSession | null) => {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

const generateToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const mockAuth = {
  getSession: async (): Promise<{ data: { session: MockSession | null } }> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { data: { session: getStoredSession() } };
  },

  signUp: async (payload: {
    email: string;
    password: string;
    options?: { data?: Record<string, string> };
  }): Promise<{ data: { user: MockUser | null }; error: Error | null }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Accept any signup - no validation
    const users = getStoredUsers();
    const existingUser = users.find(u => u.email === payload.email);
    
    // If user exists, just return it instead of error
    if (existingUser) {
      return { data: { user: existingUser }, error: null };
    }

    const newUser: MockUser = {
      id: generateToken(),
      email: payload.email,
      firstName: payload.options?.data?.firstName || 'Utilisateur',
      lastName: payload.options?.data?.lastName || 'Test',
      role: 'student',
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    return { data: { user: newUser }, error: null };
  },

  signInWithPassword: async (payload: {
    email: string;
    password: string;
  }): Promise<{ data: { session: MockSession | null; user: MockUser | null }; error: Error | null }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Accept any credentials - create a user on the fly if needed
    const users = getStoredUsers();
    let user = users.find(u => u.email === payload.email);
    
    // If user doesn't exist, create one automatically
    if (!user) {
      user = {
        id: generateToken(),
        email: payload.email,
        firstName: 'Utilisateur',
        lastName: 'Test',
        role: payload.email.includes('admin') ? 'admin' : 'student',
        created_at: new Date().toISOString(),
      };
      users.push(user);
      saveUsers(users);
    }

    // Always succeed - any password works
    const session: MockSession = {
      access_token: generateToken(),
      refresh_token: generateToken(),
      expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24h
      user,
    };

    saveSession(session);
    return { data: { session, user }, error: null };
  },

  signOut: async (): Promise<{ error: Error | null }> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    saveSession(null);
    return { error: null };
  },

  onAuthStateChange: (callback: (event: string, session: MockSession | null) => void) => {
    // Initial call
    const session = getStoredSession();
    callback('INITIAL_SESSION', session);

    // Listen to storage changes
    const handler = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) {
        const newSession = e.newValue ? JSON.parse(e.newValue) : null;
        callback('TOKEN_REFRESHED', newSession);
      }
    };
    window.addEventListener('storage', handler);

    return {
      data: {
        subscription: {
          unsubscribe: () => window.removeEventListener('storage', handler),
        },
      },
    };
  },

  resetPassword: async (email: string): Promise<{ error: Error | null }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getStoredUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      // Don't reveal if user exists or not
      return { error: null };
    }
    
    // In mock mode, just return success
    return { error: null };
  },

  updatePassword: async (_newPassword: string): Promise<{ error: Error | null }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { error: null };
  },
};

export default mockAuth;
