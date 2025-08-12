import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import { listTickets } from '../services/tickets.service';
import { listUsers } from '../services/users.service';
import { mapBackendTicket, mapBackendUser } from '../services/mappers';
import TicketList from '../components/tickets/TicketList';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import { Ticket, User } from '../types';

const AdminPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoadingTickets(true);
    try {
      const result = await listTickets();
      const items = Array.isArray(result) ? result : result.items;
      setTickets(items.map(mapBackendTicket));
    } catch (e) {
      console.error('Failed to fetch tickets', e);
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const { items } = await listUsers();
      console.log(await listUsers(),"SAa")

      setUsers(items.map(mapBackendUser));
    } catch (e) {
      console.error('Failed to fetch users', e);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, [fetchTickets, fetchUsers]);

  const handleOpenUserModal = (user: User) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async () => {
    await fetchUsers();
    handleCloseUserModal();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">All Tickets</h2>
            {/* Could add filters/actions here if needed */}
          </div>
          {loadingTickets ? (
            <div className="flex justify-center items-center py-8"><Spinner size="lg" /></div>
          ) : (
            <TicketList tickets={tickets} onUpdate={fetchTickets} />
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Users</h2>
          </div>
          {loadingUsers ? (
            <div className="flex justify-center items-center py-8"><Spinner size="lg" /></div>
          ) : (
            <UserList users={users} onEdit={handleOpenUserModal} />
          )}
        </Card>
      </div>

      <Modal isOpen={isUserModalOpen} onClose={handleCloseUserModal} title={editingUser ? 'Edit User' : 'Edit User'}>
        <UserForm user={editingUser} onSave={handleSaveUser} onCancel={handleCloseUserModal} />
      </Modal>
    </div>
  );
};

export default AdminPage;


