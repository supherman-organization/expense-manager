import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '../services/api';
import { type User } from '../types';

interface LoginResult {
  mustSetPassword?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  setPassword: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => localStorage.getItem('token') !== null);
  //  Cas légitime d'useEffect : synchroniser l'app avec un système externe
  // (le token stocké dans le navigateur) au chargement.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    let ignore = false;
    api
      .get('/auth/me')
      .then((res) => {
        if (!ignore) setUser(res.data);
      })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Actions déclenchées par l'utilisateur : de simples fonctions,
  // appelées depuis les gestionnaires d'événements — PAS des Effects.
  async function login(email: string, password: string): Promise<LoginResult> {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.mustSetPassword) {
      return { mustSetPassword: true };
    }
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return {};
  }

  async function setPassword(email: string, password: string): Promise<void> {
    const res = await api.post('/auth/set-password', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, setPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return ctx;
}