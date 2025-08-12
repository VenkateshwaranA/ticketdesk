
import React, { useState, useEffect } from 'react';
import { User, Role } from '../../types';
// import { mockApi } from '../../services/mockApi';
import { updateUser as updateUserApi } from '../../services/users.service';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

interface UserFormProps {
    user: User | null;
    onSave: () => void;
    onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role>(Role.USER);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('handleSubmit', user);
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        const updatedUser: User = { ...user, name, email, role };
        console.log('updatedUser', updatedUser);
        try {
            await updateUserApi(updatedUser.id, { roles: updatedUser.role === Role.ADMIN ? ['admin'] : ['user'] });
            onSave();
        } catch (error) {
            console.error('Failed to update user', error);
        } finally {
            setLoading(false);
        }
    };
    
    const inputClasses = "mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-70";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    if (!user) return null;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className={labelClasses}>Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} disabled />
            </div>
            <div>
                <label htmlFor="email" className={labelClasses}>Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} disabled />
            </div>
            <div>
                <label htmlFor="role" className={labelClasses}>Role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value as Role)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
};

export default UserForm;
