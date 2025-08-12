
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MENU_ITEMS } from '../../constants';
import { TicketIcon } from '../ui/Icons';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const { hasPermission } = useAuth();

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            <div className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30 lg:relative lg:translate-x-0 lg:z-auto`}>
                <div className="flex items-center justify-center mt-8">
                   <div className="flex items-center">
                        <TicketIcon className="w-8 h-8 text-indigo-500" />
                        <span className="text-gray-800 dark:text-white text-2xl font-semibold ml-2">UTMS</span>
                    </div>
                </div>

                <nav className="mt-10">
                    {MENU_ITEMS.map((item) => (
                        (item.requiredPermission === null || hasPermission(item.requiredPermission)) && (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end
                                className={({ isActive }) => 
                                    `flex items-center mt-4 py-2 px-6 transition-colors duration-200 ${
                                    isActive 
                                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-r-4 border-indigo-500' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`
                                }
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon className="w-6 h-6" />
                                <span className="mx-3">{item.label}</span>
                            </NavLink>
                        )
                    ))}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
