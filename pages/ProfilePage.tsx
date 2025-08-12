import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import { getMe } from '@/services/auth.service';

const ProfilePage: React.FC = () => {
    const { user, permissions } = useAuth();
    console.log('user', user);
    if (!user) {
        return <p>Loading user profile...</p>;
    }
    useEffect(() => {
      async function fetchMe() {
        const me = await getMe();
        console.log('me', me);
      }
      fetchMe();
    }, [user]);
    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">My Profile</h1>
            <Card>
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 p-4">
                    <img
                        className="h-32 w-32 rounded-full object-cover ring-4 ring-indigo-500"
                        src={user.avatar}
                        alt="User avatar"
                    />
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                        <p className="text-md text-gray-600 dark:text-gray-400">{user.email}</p>
                        <div className="mt-4">
                            <span className="px-3 py-1 text-sm font-semibold text-indigo-800 bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">My Permissions</h2>
                <Card>
                    <div className="p-4">
                        <ul className="space-y-2">
                            {permissions.map((permission) => (
                                <li key={permission} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300">
                                    {permission.split('_').join(' ').toLowerCase()}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;
