import type { Session } from '../Session';

export interface AuthBackendPort {
  loginWithGoogle(idToken: string): Promise<Session>;
  logout(): Promise<void>;
}
