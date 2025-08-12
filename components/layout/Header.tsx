
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MenuIcon, LogoutIcon } from '../ui/Icons';
import { useLocation } from 'react-router-dom';
import { MENU_ITEMS } from '../../constants';

interface HeaderProps {
    setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const getPageTitle = () => {
        const currentPath = location.pathname === '/' ? '/' : location.pathname;
        const currentItem = MENU_ITEMS.find(item => item.path === currentPath);
        return currentItem ? currentItem.label : 'Dashboard';
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="flex-shrink-0 flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <div className="flex items-center">
                <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden">
                   <MenuIcon className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white ml-4 lg:ml-0">{getPageTitle()}</h1>
            </div>

            <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 focus:outline-none">
                    <img className="h-9 w-9 rounded-full object-cover" src={user?.avatar} alt="Your avatar" />
                    <span className="hidden md:block font-medium text-gray-700 dark:text-gray-200">{user?.name}</span>
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl z-20">
                        <a href="#/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setDropdownOpen(false)}>Profile</a>
                        <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <LogoutIcon className="w-5 h-5 mr-2" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
