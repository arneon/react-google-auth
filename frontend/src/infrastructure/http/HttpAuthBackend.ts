import type { AuthBackendPort } from '../../domain/auth/ports/AuthBackendPort';
import type { Session } from '../../domain/auth/Session';
import { config } from '../../shared/config';

export class HttpAuthBackend implements AuthBackendPort {
  async loginWithGoogle(idToken: string): Promise<Session> {
    const res = await fetch(`${config.apiBaseUrl}/api/users/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },      
      body: JSON.stringify({ idToken }),
      credentials: 'omit', 
      mode: 'cors',
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Auth failed (${res.status}): ${text}`);
    }
    return res.json();
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${config.apiBaseUrl}/api/users/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore
    }
  }
}
