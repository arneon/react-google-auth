import type { AuthBackendPort } from '../ports/AuthBackendPort';
import type { Session } from '../Session';

export class AuthenticateWithGoogle {
  constructor(private backend: AuthBackendPort) {}

  async execute(idToken: string): Promise<Session> {
    if (!idToken) throw new Error('Invalid Google ID token');
    return this.backend.loginWithGoogle(idToken);
  }
}
