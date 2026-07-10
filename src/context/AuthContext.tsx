import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getRoleFromJwt, getUserIdFromJwt, type UserRole } from '@/lib/jwt';
export type { UserRole } from '@/lib/jwt';
import { isTokenExpired, setToken } from '@/lib/api';

interface AuthContextValue {
  role: UserRole | null;
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ROLE_STORAGE_KEY = 'ists_role';
const TOKEN_STORAGE_KEY = 'ists_access_token';

function getInitialAuth(): { role: UserRole | null; token: string | null; userId: string | null } {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token && !isTokenExpired(token)) {
    const roleFromJwt = getRoleFromJwt(token);
    if (roleFromJwt) {
      return { role: roleFromJwt, token, userId: getUserIdFromJwt(token) };
    }
  }

  // Clear stale storage if token is missing/expired or role is invalid.
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(ROLE_STORAGE_KEY);

  return { role: null, token: null, userId: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = getInitialAuth();
  const [role, setRole] = useState<UserRole | null>(initial.role);
  const [token, setTokenState] = useState<string | null>(initial.token);

  const login = (newToken: string) => {
    const roleFromJwt = getRoleFromJwt(newToken);
    setToken(newToken);
    setTokenState(newToken);

    if (roleFromJwt) {
      localStorage.setItem(ROLE_STORAGE_KEY, roleFromJwt);
      setRole(roleFromJwt);
    } else {
      setRole(null);
      localStorage.removeItem(ROLE_STORAGE_KEY);
    }
  };

  const logout = () => {
    setToken(null);
    setTokenState(null);
    setRole(null);
    localStorage.removeItem(ROLE_STORAGE_KEY);
  };

  const userId = useMemo(() => (token ? getUserIdFromJwt(token) : null), [token]);

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, [token]);

  useEffect(() => {
    const handleAuthExpired = () => {
      logout();
      window.location.href = "/login";
    };
    window.addEventListener("ists:auth:expired", handleAuthExpired);
    return () => window.removeEventListener("ists:auth:expired", handleAuthExpired);
  }, []);

  return (
    <AuthContext.Provider value={{ role, token, userId, isAuthenticated: token !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'manager':
      return '/manager-dashboard';
    case 'agent':
      return '/agent-dashboard';
    case 'staff':
    default:
      return '/staff-dash';
  }
}
