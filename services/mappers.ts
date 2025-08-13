import { Role, Ticket as FrontendTicket, TicketPriority, TicketStatus, User as FrontendUser } from '../types';
import { BackendUser } from './users.service';
import { BackendTicket } from './tickets.service';

export function mapBackendUser(user: BackendUser): FrontendUser {
  const role: Role = user.roles.includes('admin') ? Role.ADMIN : Role.USER;
  const name = user.email.split('@')[0];
  return {
    id: user._id.toString(),
    name,
    email: user.email,
    avatar: `https://www.gravatar.com/avatar/${encodeURIComponent(user.email)}?d=identicon`,
    role,
  };
}

export function mapBackendTicket(t: BackendTicket): FrontendTicket {
  return {
    id: t._id.toString(),
    title: t.title,
    description: t.description || '',
    status: (t.status as TicketStatus) || TicketStatus.OPEN,
    priority: (t.priority as TicketPriority) || TicketPriority.MEDIUM,
    assignedTo: t.assignedTo ?? null,
    createdBy: t.ownerId,
    createdAt: t.createdAt || new Date().toISOString(),
  };
}


