import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleIcon, TicketIcon } from '../components/ui/Icons';
import Spinner from '../components/ui/Spinner';

const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login('google', 'ADMIN');
    } catch (err) {
      setError(`Login failed. Please try again. ${err instanceof Error ? err.message : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="flex justify-center">
          <TicketIcon className="h-12 w-auto text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Admin Sign in</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            {error}
          </div>
        )}
        <button
          onClick={handleAdminLogin}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Spinner size="sm" /> : <GoogleIcon className="w-5 h-5" />}
          <span className="ml-3">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default AdminLoginPage;


