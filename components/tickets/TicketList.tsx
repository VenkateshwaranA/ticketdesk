
import React from 'react';
import { Ticket } from '../../types';
import TicketItem from './TicketItem';

interface TicketListProps {
    tickets: Ticket[];
    onUpdate: () => void;
    onEdit?: (ticket: Ticket) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onUpdate, onEdit }) => {
    console.log('tickets', tickets);
    if (tickets.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-4">No tickets found.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <div className="min-w-full">
                {/* Desktop view */}
                <div className="hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {tickets.map(ticket => (
                                <TicketItem key={ticket.id} ticket={ticket} onUpdate={onUpdate} onEdit={onEdit} isListItem={true} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile view */}
                <div className="block md:hidden space-y-4">
                    {tickets.map(ticket => (
                        <TicketItem key={ticket.id} ticket={ticket} onUpdate={onUpdate} onEdit={onEdit} isListItem={false} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TicketList;
