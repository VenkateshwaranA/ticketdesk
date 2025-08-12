
import React from 'react';
import { TicketStatus } from '../../types';

interface TicketStatusBadgeProps {
    status: TicketStatus;
}

const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({ status }) => {
    const statusClasses: Record<TicketStatus, string> = {
        [TicketStatus.OPEN]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        [TicketStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        [TicketStatus.DONE]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

export default TicketStatusBadge;
