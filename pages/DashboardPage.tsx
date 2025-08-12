
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
// import { mockApi } from '../services/mockApi';
import { listTickets } from '../services/tickets.service';
import { mapBackendTicket } from '../services/mappers';
import { Ticket, TicketStatus } from '../types';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import TicketList from '../components/tickets/TicketList';
import { ChartBarIcon, ChartPieIcon, CheckCircleIcon, ClockIcon } from '../components/ui/Icons';

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <Card>
        <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-800">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    </Card>
);


const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const result = await listTickets();
                const items = Array.isArray(result) ? result : result.items;
                setTickets(items.map(mapBackendTicket));
            } catch (error) {
                console.error("Failed to fetch tickets", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const userTickets = useMemo(() => tickets.filter(t => t.assignedTo === user?.id || t.createdBy === user?.id), [tickets, user]);

    const stats = useMemo(() => {
        return {
            open: userTickets.filter(t => t.status === TicketStatus.OPEN).length,
            inProgress: userTickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
            done: userTickets.filter(t => t.status === TicketStatus.DONE).length,
            total: userTickets.length
        };
    }, [userTickets]);

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Welcome back, {user?.name}!</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Tickets" value={stats.total} icon={<ChartBarIcon className="h-6 w-6 text-indigo-500"/>} />
                <StatCard title="Open Tickets" value={stats.open} icon={<ClockIcon className="h-6 w-6 text-indigo-500"/>} />
                <StatCard title="In Progress" value={stats.inProgress} icon={<ChartPieIcon className="h-6 w-6 text-indigo-500"/>} />
                <StatCard title="Completed" value={stats.done} icon={<CheckCircleIcon className="h-6 w-6 text-indigo-500"/>} />
            </div>

            <Card>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">My Recent Tickets</h2>
                {userTickets.length > 0 ? (
                    <TicketList tickets={userTickets.slice(0, 5)} onUpdate={() => {}} />
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">You have no tickets assigned or created by you.</p>
                )}
            </Card>
        </div>
    );
};

export default DashboardPage;
