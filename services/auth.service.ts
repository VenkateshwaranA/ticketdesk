import { http, setAccessToken, API_BASE_URL } from './apiClient';
import { User, Role } from '../types';

type LoginResponse = { accessToken: string };

export async function loginWithEmailPassword(email: string, password: string): Promise<void> {
  const data = await http<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } });
  setAccessToken(data.accessToken);
}

export async function loginWithOAuth(provider: 'google', role: 'ADMIN' | 'USER'): Promise<void> {
  // Redirect to the OAuth endpoint with the role as a query parameter
  const redirectUrl = `${API_BASE_URL}/auth/${provider}?role=${encodeURIComponent(role)}`;
  window.location.href = redirectUrl;
}

export async function getMe(): Promise<{ id: string; email: string; roles: string[] } | null> {
  try {
    return await http('/auth/me');
  } catch {
    return null;
  }
}

export function mapBackendUserToFrontend(me: { id: string; email: string; roles: string[] }): User {
  const role: Role = me.roles.includes('admin') ? Role.ADMIN : Role.USER;
  return {
    id: me.id,
    name: me.email.split('@')[0],
    email: me.email,
    avatar: `https://www.gravatar.com/avatar/${encodeURIComponent(me.email)}?d=identicon`,
    role,
  };
}

export function logout(): void {
  setAccessToken(null);
}


