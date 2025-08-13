import { http } from './apiClient';

export type BackendTicket = {
  _id: any;
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  assignedTo?: string | null;
  status?: 'OPEN' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt?: string;
};

export async function listTickets(ownerId?: string): Promise<{ items: BackendTicket[] } | BackendTicket[]> {
  const query = ownerId ? `?ownerId=${encodeURIComponent(ownerId)}` : '';
  // Gateway uses /tickets?q=..., ticket service uses ownerId. Gateway returns passthrough from service.
  return http(`/tickets${query}`);
}

export async function createTicket(body: Partial<BackendTicket>): Promise<{ id: string }> {
  return http('/tickets', { method: 'POST', body });
}

export async function updateTicket(id: string, body: Partial<BackendTicket>): Promise<{ id: string }> {
  return http(`/tickets/${id}`, { method: 'PATCH', body });
}

export async function deleteTicket(id: string): Promise<{ id: string }> {
  return http(`/tickets/${id}`, { method: 'DELETE' });
}


