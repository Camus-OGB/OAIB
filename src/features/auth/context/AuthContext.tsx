import React from 'react';
import { tokenStore } from '../../../lib/apiClient';
import { getMe, signOut as authSignOut, type AuthUser } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  /** Refresh le profil user (après login/signup) */
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const refreshUser = React.useCallback(async () => {
    const token = tokenStore.getAccess();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    const { data, error } = await getMe();
    if (error || !data) {
      setUser(null);
    } else {
      setUser(data);
    }
    setLoading(false);
  }, []);

  // Au montage : vérifier s'il y a un token et charger le profil
  React.useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Écouter l'événement de déconnexion forcée (token refresh échoué)
  React.useEffect(() => {
    const handler = () => {
      setUser(null);
      tokenStore.clear();
    };
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);

  const signOut = async () => {
    await authSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};