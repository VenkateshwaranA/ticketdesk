
export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export enum Permission {
    CAN_MANAGE_USERS = 'CAN_MANAGE_USERS',
    CAN_MANAGE_ALL_TICKETS = 'CAN_MANAGE_ALL_TICKETS',
    CAN_CREATE_TICKETS = 'CAN_CREATE_TICKETS',
    CAN_ASSIGN_TICKETS = 'CAN_ASSIGN_TICKETS',
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: Role;
}

export enum TicketStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export enum TicketPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    assignedTo: string | null;
    createdBy: string;
    createdAt: string;
}
