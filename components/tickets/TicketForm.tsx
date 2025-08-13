
import React, { useState, useEffect } from 'react';
import { Ticket, TicketStatus, TicketPriority, User, Permission } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { createTicket as createTicketApi, updateTicket as updateTicketApi } from '../../services/tickets.service';
import { listUsers } from '../../services/users.service';
import { mapBackendUser } from '../../services/mappers';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

interface TicketFormProps {
    ticket: Ticket | null;
    onSave: () => void;
    onCancel: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ ticket, onSave, onCancel }) => {
    const { user, hasPermission } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TicketStatus>(TicketStatus.OPEN);
    const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
    const [assignedTo, setAssignedTo] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const canAssign = hasPermission(Permission.CAN_ASSIGN_TICKETS);
    console.log(ticket, "ticket", users,)
    useEffect(() => {
        if (ticket) {
            setTitle(ticket.title);
            setDescription(ticket.description);
            setStatus(ticket.status);
            setPriority(ticket.priority);
            setAssignedTo(ticket.assignedTo);
        } else {
            setAssignedTo(user?.id ?? null);
        }

        if (canAssign) {
            listUsers()
              .then(({ items }) => setUsers(items.map(mapBackendUser)))
              .catch(() => setUsers([]));
        }
    }, [ticket, user, canAssign]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const ticketData = {
            title,
            description,
            ...(typeof assignedTo === 'string' && assignedTo ? { assignedTo } : {}),
            ...(typeof status === 'string' && status ? { status } : {}),
            ...(typeof priority === 'string' && priority ? { priority } : {}),
        } as any;

        try {
            if (ticket) {
                await updateTicketApi(ticket.id, ticketData);
            } else {
                await createTicketApi({
                    title,
                    description,
                    ownerId: user!.id,
                    ...(typeof assignedTo === 'string' && assignedTo ? { assignedTo } : {}),
                    ...(typeof status === 'string' && status ? { status } : {}),
                    ...(typeof priority === 'string' && priority ? { priority } : {}),
                });
            }
            onSave();
        } catch (error) {
            console.error('Failed to save ticket', error);
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className={labelClasses}>Title</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} required />
            </div>
            <div>
                <label htmlFor="description" className={labelClasses}>Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputClasses} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="status" className={labelClasses}>Status</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value as TicketStatus)} className={inputClasses}>
                        {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="priority" className={labelClasses}>Priority</label>
                    <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)} className={inputClasses}>
                        {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>
            {canAssign && (
                <div>
                    <label htmlFor="assignedTo" className={labelClasses}>Assign To</label>
                    <select id="assignedTo" value={assignedTo || ''} onChange={(e) => setAssignedTo(e.target.value || null)} className={inputClasses}>
                        <option value="">Unassigned</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                </div>
            )}
            <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : (ticket ? 'Update Ticket' : 'Create Ticket')}
                </Button>
            </div>
        </form>
    );
};

export default TicketForm;
