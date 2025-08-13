
import React from 'react';
import { Ticket, TicketStatus, TicketPriority, Permission } from '../../types';
// import { mockApi } from '../../services/mockApi';
import { updateTicket as updateTicketApi, deleteTicket as deleteTicketApi } from '../../services/tickets.service';
import { useAuth } from '../../contexts/AuthContext';
import { TrashIcon, PencilIcon, CheckCircleIcon } from '../ui/Icons';
import TicketStatusBadge from './TicketStatusBadge';
import Card from '../ui/Card';

interface TicketItemProps {
    ticket: Ticket;
    onUpdate: () => void;
    onEdit?: (ticket: Ticket) => void;
    isListItem?: boolean;
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket, onUpdate, onEdit, isListItem = true }) => {
    const { user, hasPermission } = useAuth();
    const canEdit = user?.id === ticket.createdBy || hasPermission(Permission.CAN_MANAGE_ALL_TICKETS);
    const canDelete = hasPermission(Permission.CAN_MANAGE_ALL_TICKETS);

    const handleDelete = async () => {
        console.log('handleDelete', ticket);
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            await deleteTicketApi(ticket.id);
            onUpdate();
        }
    };

    const handleComplete = async () => {
        await updateTicketApi(ticket.id, { status: TicketStatus.DONE as unknown as any });
        onUpdate();
    }

    const canChangeStatusOrPriority = hasPermission(Permission.CAN_MANAGE_ALL_TICKETS);
    
    const priorityClasses: Record<TicketPriority, string> = {
        [TicketPriority.LOW]: 'text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900',
        [TicketPriority.MEDIUM]: 'text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-900',
        [TicketPriority.HIGH]: 'text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900',
    };

    const content = (
        <>
            <div className="flex-grow">
                <p className="text-md font-medium text-gray-900 dark:text-white truncate">{ticket.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{`#${ticket.id} opened ${new Date(ticket.createdAt).toLocaleDateString()}`}</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <TicketStatusBadge status={ticket.status} />
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityClasses[ticket.priority]}`}>
                    {ticket.priority}
                </span>
                <div className="flex items-center space-x-2">
                    {canEdit && onEdit && (
                        <button onClick={() => onEdit(ticket)} className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"><PencilIcon className="w-5 h-5" /></button>
                    )}
                    {ticket.status !== TicketStatus.DONE && canEdit && (
                        <button onClick={handleComplete} className="text-gray-400 hover:text-green-600 dark:hover:text-green-400"><CheckCircleIcon className="w-5 h-5" /></button>
                    )}
                    {canDelete && (
                        <button onClick={handleDelete} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"><TrashIcon className="w-5 h-5" /></button>
                    )}
                </div>
            </div>
        </>
    );

    if (isListItem) {
        return (
            <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{ticket.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{ticket.description}...</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                        <TicketStatusBadge status={ticket.status} />
                        {/* {canChangeStatusOrPriority && (
                            <select
                                className="text-xs border rounded px-1 py-0.5 dark:bg-gray-700 dark:border-gray-600"
                                value={ticket.status}
                                onChange={async (e) => { await updateTicketApi(ticket.id, { status: e.target.value as any }); onUpdate(); }}
                            >
                                {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        )} */}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityClasses[ticket.priority]}`}>
                            {ticket.priority}
                        </span>
                        {/* {canChangeStatusOrPriority && (
                            <select
                                className="text-xs border rounded px-1 py-0.5 dark:bg-gray-700 dark:border-gray-600"
                                value={ticket.priority}
                                onChange={async (e) => { await updateTicketApi(ticket.id, { priority: e.target.value as any }); onUpdate(); }}
                            >
                                {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        )} */}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {canEdit && onEdit && (
                        <button onClick={() => onEdit(ticket)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</button>
                    )}
                    {canDelete && (
                        <button onClick={handleDelete} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Delete</button>
                    )}
                </td>
            </tr>
        );
    }

    return (
        <Card className="flex flex-col md:flex-row justify-between items-start md:items-center">
            {content}
        </Card>
    );
};

export default TicketItem;
