
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
// import { mockApi } from '../services/mockApi';
import { listTickets, createTicket as createTicketApi, updateTicket as updateTicketApi, deleteTicket as deleteTicketApi } from '../services/tickets.service';
import { mapBackendTicket } from '../services/mappers';
import { Ticket, TicketStatus } from '../types';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import TicketList from '../components/tickets/TicketList';
import Modal from '../components/ui/Modal';
import TicketForm from '../components/tickets/TicketForm';
import { PlusIcon } from '../components/ui/Icons';
import Card from '../components/ui/Card';

const TicketsPage: React.FC = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
    const [filter, setFilter] = useState<string>('all');

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const result = await listTickets();
            console.log('result', result);
            const items = Array.isArray(result) ? result : result.items;
            setTickets(items.map(mapBackendTicket));
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleOpenModal = (ticket: Ticket | null = null) => {
        setEditingTicket(ticket);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTicket(null);
    };

    const handleSaveTicket = async () => {
        await fetchTickets();
        handleCloseModal();
    };

    const filteredTickets = tickets.filter(ticket => {
        if (filter === 'all') return true;
        if (filter === 'mine') return ticket.assignedTo === user?.id;
        return ticket.status === filter;
    });
    console.log(tickets,'filteredTickets', filteredTickets);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Tickets</h1>
                <Button onClick={() => handleOpenModal()} variant="primary">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    New Ticket
                </Button>
            </div>
            
            <Card>
                <div className="flex justify-start items-center mb-4 space-x-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Filter by:</span>
                    <select onChange={(e) => setFilter(e.target.value)} value={filter} className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="all">All</option>
                        <option value="mine">My Tickets</option>
                        <option value={TicketStatus.OPEN}>Open</option>
                        <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                        <option value={TicketStatus.DONE}>Done</option>
                    </select>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-8"><Spinner size="lg" /></div>
                ) : (
                    <TicketList tickets={filteredTickets} onUpdate={fetchTickets} onEdit={handleOpenModal}/>
                )}
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTicket ? 'Edit Ticket' : 'Create New Ticket'}>
                <TicketForm
                    ticket={editingTicket}
                    onSave={handleSaveTicket}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default TicketsPage;
