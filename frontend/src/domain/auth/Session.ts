import type { User } from './User';

export type Session = {
  user: User;
  accessToken?: string;
  refreshToken?: string;
};
