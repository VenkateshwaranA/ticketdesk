
import React from 'react';
import { Permission } from './types';
import { HomeIcon, TicketIcon, UsersIcon, UserCircleIcon } from './components/ui/Icons';

export const MENU_ITEMS = [
  { path: '/', label: 'Dashboard', icon: HomeIcon, requiredPermission: null },
  { path: '/tickets', label: 'Tickets', icon: TicketIcon, requiredPermission: Permission.CAN_CREATE_TICKETS },
  { path: '/users', label: 'Manage Users', icon: UsersIcon, requiredPermission: Permission.CAN_MANAGE_USERS },
  { path: '/profile', label: 'Profile', icon: UserCircleIcon, requiredPermission: null },
];

export const PERMISSIONS_MAP: Record<string, Permission[]> = {
  ADMIN: [
    Permission.CAN_MANAGE_USERS,
    Permission.CAN_MANAGE_ALL_TICKETS,
    Permission.CAN_CREATE_TICKETS,
    Permission.CAN_ASSIGN_TICKETS,
  ],
  USER: [
    Permission.CAN_CREATE_TICKETS,
  ],
};
