import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { api } from '../lib/api';
import { getFirebaseAuth, googleProvider } from '../lib/firebase';

const AuthContext = createContext(null);
const TOKEN_KEY = 'deryk_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .me(token)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const signUp = async (email, password, displayName) => {
    const data = await api.signup(email, password, displayName);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    setUser(data.user);
    setToken(data.access_token);
  };

  const signIn = async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    setUser(data.user);
    setToken(data.access_token);
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(getFirebaseAuth(), googleProvider);
    const idToken = await result.user.getIdToken();
    const data = await api.googleAuth(idToken);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    setUser(data.user);
    setToken(data.access_token);
  };

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value = { user, token, loading, signUp, signIn, signInWithGoogle, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
