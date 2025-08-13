import React, { createContext, useState, useContext, useEffect, useCallback, useMemo, memo } from 'react';
import { User, Permission } from '../types';
import { PERMISSIONS_MAP } from '../constants';
import { getMe, loginWithOAuth, logout as authLogout, mapBackendUserToFrontend, loginWithEmailPassword } from '../services/auth.service';
import { setAccessToken, getAccessToken } from '../services/apiClient';
import Spinner from '../components/ui/Spinner';

// Define interfaces for better type safety
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  permissions: Permission[];
  login: (provider: 'google', role?: 'ADMIN' | 'USER', email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  loading: boolean;
  error: string | null;
}

// Create context with proper typing
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default context value for initialization
const defaultContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  permissions: [],
  login: async () => { },
  logout: async () => { },
  hasPermission: () => false,
  loading: false,
  error: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized permission checker
  const hasPermission = useCallback((permission: Permission): boolean => {
    return permissions.includes(permission);
  }, [permissions]);

  // Memoized user loading function
  const loadUserFromStorage = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Handle OAuth token from query string (no hash routing)
      const url = new URL(window.location.href);
      const tokenParam = url.searchParams.get('token');
      if (tokenParam) {
        setAccessToken(tokenParam);
        url.searchParams.delete('token');
        const cleaned = url.pathname + (url.search ? url.search : '');
        window.history.replaceState(null, '', cleaned);
      }

      // No sessionStorage caching; always rely on API when token exists

      // Fetch user if token exists
      const token = getAccessToken();
      if (token) {
        const me = await getMe();
        if (me) {
          const mapped = mapBackendUserToFrontend(me);
          setUser(mapped);
          setPermissions(PERMISSIONS_MAP[mapped.role] || []);
          // User stored only in memory; re-fetch from API when needed
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      // Clear in-memory state only; no session storage
      setAccessToken(null);
      setUser(null);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle login
  const login = useCallback(async (
    provider: 'google',
    role?: 'ADMIN' | 'USER',
    email?: string,
    password?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (provider !== 'google' && (!email || !password)) {
        throw new Error('Invalid login credentials');
      }

      // Perform login
      if (provider === 'google') {
        await loginWithOAuth(provider,role);
      } else if (email && password) {
        await loginWithEmailPassword(email, password);
      }

      const me = await getMe();
      // if (!me) throw new Error('Failed to fetch user profile');

      const mapped = mapBackendUserToFrontend(me);
      setUser(mapped);
      setPermissions(PERMISSIONS_MAP[mapped.role] || []);
    } catch (err) {
      // setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle logout
  const logout = useCallback(async () => {
    try {
      await authLogout();
      setUser(null);
      setPermissions([]);
      setAccessToken(null);
      // No session storage to clear
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    }
  }, []);

  // Load user on mount
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (mounted) {
        await loadUserFromStorage();
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [loadUserFromStorage]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    isAuthenticated: !!user,
    user,
    permissions,
    login,
    logout,
    hasPermission,
    loading,
    error,
  }), [user, permissions, login, logout, hasPermission, loading, error]);

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow">
          {error}
          <button onClick={() => setError(null)} className="ml-4">×</button>
        </div>
      )}
    </AuthContext.Provider>
  );
});

// Custom hook for accessing auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};