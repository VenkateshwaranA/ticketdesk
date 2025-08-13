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
  login: (provider: 'google' , role?: 'ADMIN' | 'USER', email?: string, password?: string) => Promise<void>;
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
  login: async () => {},
  logout: async () => {},
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
      // Handle OAuth token from URL
      const hash = window.location.hash;
      const match = hash.match(/token=([^&]+)/);
      
      if (match) {
        const token = decodeURIComponent(match[1]);
        setAccessToken(token);
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }

      // Check cached user in sessionStorage
      const storedUser = sessionStorage.getItem('utms_user');
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setPermissions(PERMISSIONS_MAP[parsedUser.role] || []);
          return;
        } catch (parseError) {
          console.warn('Failed to parse stored user:', parseError);
          sessionStorage.removeItem('utms_user');
        }
      }

      // Fetch user if token exists
      const token = getAccessToken();
      if (token) {
        const me = await getMe();
        if (me) {
          const mapped = mapBackendUserToFrontend(me);
          setUser(mapped);
          setPermissions(PERMISSIONS_MAP[mapped.role] || []);
          sessionStorage.setItem('utms_user', JSON.stringify(mapped));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      sessionStorage.removeItem('utms_user');
      setAccessToken(null);
      setUser(null);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle login
  const login = useCallback(async (
    provider: 'google' ,
    role?: 'ADMIN' | 'USER',
    email?: string,
    password?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (provider !== 'google' && provider !== 'github' && provider !== 'facebook' && (!email || !password)) {
        throw new Error('Invalid login credentials');
      }

      // Perform login
      if (provider === 'google' || provider === 'github' || provider === 'facebook') {
        await loginWithOAuth(provider);
      } else if (email && password) {
        await loginWithEmailPassword(email, password);
      }

      const me = await getMe();
      if (!me) throw new Error('Failed to fetch user profile');

      const mapped = mapBackendUserToFrontend(me);
      setUser(mapped);
      setPermissions(PERMISSIONS_MAP[mapped.role] || []);
      sessionStorage.setItem('utms_user', JSON.stringify(mapped));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
      sessionStorage.removeItem('utms_user');
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