import { http, setAccessToken, API_BASE_URL } from './apiClient';
import { User, Role } from '../types';

type LoginResponse = { accessToken: string };

export async function loginWithEmailPassword(email: string, password: string): Promise<void> {
  const data = await http<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } });
  setAccessToken(data.accessToken);
}

export async function loginWithOAuth(provider: 'google' | 'github' | 'facebook'): Promise<void> {
  // For OAuth, perform a top-level redirect so the browser can follow cross-origin flows
  window.location.href = `${API_BASE_URL}/auth/${provider}`;
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


