"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios autorizados (Daniel y sus 2 hermanos)
const AUTHORIZED_USERS = [
  { id: '1', username: 'daniel', password: '123456789', name: 'Daniel', role: 'Administrador Principal' },
  { id: '2', username: 'esteban', password: '123456789', name: 'Esteban', role: 'Socio Inversionista' },
  { id: '3', username: 'mateo', password: '123456789', name: 'Mateo', role: 'Socio Inversionista' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem('wealthport_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Protección de rutas
  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== '/login') {
        router.push('/login');
      } else if (user && pathname === '/login') {
        router.push('/');
      }
    }
  }, [user, pathname, isLoading, router]);

  const login = (username: string, password: string) => {
    const foundUser = AUTHORIZED_USERS.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const userData = { id: foundUser.id, name: foundUser.name, role: foundUser.role };
      setUser(userData);
      localStorage.setItem('wealthport_user', JSON.stringify(userData));
      router.push('/');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wealthport_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
