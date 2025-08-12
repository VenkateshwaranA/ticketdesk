import { http } from './apiClient';

export type BackendUser = {
  _id: any; id: string; email: string; roles: string[] 
};

export async function listUsers(q?: string): Promise<{ items: BackendUser[] }> {
  // const query = q ? `?search=${encodeURIComponent(q)}` : '';
  // console.log('query', query);
  return http(`/users`);
}

export async function updateUser(id: string, body: Partial<BackendUser>): Promise<{ id: string }> {
  return http(`/users/${id}`, { method: 'PATCH', body });
}


