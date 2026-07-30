import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/user';
import { dataRepository } from '../repositories/dataRepository';
import { logger } from '../services/logger';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check saved email or default to Admin (Shreya Agarwal)
    const savedEmail = localStorage.getItem('infineo_user_email') || 'infineo.live@gmail.com';
    dataRepository.getUserByEmail(savedEmail).then((user) => {
      if (user && user.active) {
        setCurrentUser(user);
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const user = await dataRepository.getUserByEmail(email);
      if (user && user.active) {
        setCurrentUser(user);
        localStorage.setItem('infineo_user_email', user.email);
        logger.info(`User logged in: ${user.email} (${user.role})`);
        setIsLoading(false);
        return true;
      }
      logger.warn(`Login failed for email: ${email}`);
    } catch (err) {
      logger.error(`Login error for email: ${email}`, { error: err });
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    if (currentUser) {
      logger.info(`User logged out: ${currentUser.email}`);
    }
    setCurrentUser(null);
    localStorage.removeItem('infineo_user_email');
  };

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
