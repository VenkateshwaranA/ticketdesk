
import React, { useState, useEffect, useCallback } from 'react';
// import { mockApi } from '../services/mockApi';
import { listUsers } from '../services/users.service';
import { mapBackendUser } from '../services/mappers';
import { User } from '../types';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import UserList from '../components/users/UserList';
import Modal from '../components/ui/Modal';
import UserForm from '../components/users/UserForm';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const { items } = await listUsers();
            setUsers(items.map(mapBackendUser));
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenModal = (user: User | null = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };
    
    const handleSaveUser = async () => {
        await fetchUsers();
        handleCloseModal();
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">User Management</h1>
            </div>

            <Card>
                {loading ? (
                    <div className="flex justify-center items-center py-8"><Spinner size="lg" /></div>
                ) : (
                    <UserList users={users} onEdit={handleOpenModal} />
                )}
            </Card>

             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUser ? 'Edit User' : 'Create New User'}>
                <UserForm
                    user={editingUser}
                    onSave={handleSaveUser}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default UsersPage;
