// FIX: Provide full implementation for the AuthContext.
import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextType {
  currentUser: string | null;
  login: (user: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useLocalStorage<string | null>('currentUser', null);

  const login = useCallback((user: string) => {
    setCurrentUser(user);
  }, [setCurrentUser]);

  const logout = useCallback(() => {
    if (currentUser) {
      localStorage.removeItem(`transactions_${currentUser}`);
      localStorage.removeItem(`budgets_${currentUser}`);
    }
    setCurrentUser(null);
  }, [setCurrentUser, currentUser]);

  const value = { currentUser, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
