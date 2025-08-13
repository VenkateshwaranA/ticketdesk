
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleIcon, GithubIcon, FacebookIcon, TicketIcon } from '../components/ui/Icons';
import Spinner from '../components/ui/Spinner';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (provider: 'google' , role: 'ADMIN' | 'USER') => {
        setLoadingProvider(`${provider}-${role}`);
        setError(null);
        try {
            await login(provider, role);
        } catch (err) {
            setError(`Login failed. Please try again. ${err instanceof Error ? err.message : ''}`);
            setLoadingProvider(null);
        }
    };

    const ProviderButton = ({ provider, name, icon, onClick, disabled }: { provider: string, name: string, icon: React.ReactNode, onClick: () => void, disabled: boolean }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {disabled ? <Spinner size="sm" /> : icon}
            <span className="ml-3">{name}</span>
        </button>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div>
                    <div className="flex justify-center">
                        <TicketIcon className="h-12 w-auto text-indigo-600" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Sign in to UTMS
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        User & Ticket Management System
                    </p>
                </div>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
                
                <div className="space-y-6">
                    <p className="text-center font-semibold text-gray-700 dark:text-gray-300">Login as User</p>
                    <div className="space-y-3">
                        <ProviderButton 
                            provider="google" 
                            name="Sign in with Google" 
                            icon={<GoogleIcon className="w-5 h-5" />}
                            onClick={() => handleLogin('google', 'USER')}
                            disabled={loadingProvider === 'google-USER'}
                        />
                        
                    </div>
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or</span>
                        </div>
                    </div>
                    
                    <p className="text-center font-semibold text-gray-700 dark:text-gray-300">Login as Admin</p>
                     <div className="space-y-3">
                        <ProviderButton 
                            provider="google" 
                            name="Admin Sign in" 
                            icon={<GoogleIcon className="w-5 h-5" />}
                            onClick={() => handleLogin('google', 'ADMIN')}
                            disabled={loadingProvider === 'google-ADMIN'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
