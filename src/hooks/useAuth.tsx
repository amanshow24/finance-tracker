import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiFetch } from '@/lib/api';

interface UserType {
  id: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('finance-tracker-token');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await apiFetch('/api/auth/me');
      if (response.ok && response.data?.user) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem('finance-tracker-token');
        setUser(null);
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const saveSession = (user: UserType, token: string) => {
    localStorage.setItem('finance-tracker-token', token);
    setUser(user);
  };

  const signUp = async (email: string, password: string) => {
    try {
      const response = await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok && response.data) {
        saveSession(response.data.user, response.data.token);
        return { error: null };
      }

      return {
        error: { message: response.data?.error || response.error?.message || 'Failed to sign up' },
      };
    } catch (exception: any) {
      return {
        error: { message: exception?.message || 'Failed to sign up' },
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiFetch('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok && response.data) {
        saveSession(response.data.user, response.data.token);
        return { error: null };
      }

      return {
        error: { message: response.data?.error || response.error?.message || 'Failed to sign in' },
      };
    } catch (exception: any) {
      return {
        error: { message: exception?.message || 'Failed to sign in' },
      };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('finance-tracker-token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}