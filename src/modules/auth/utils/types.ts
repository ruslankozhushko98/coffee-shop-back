import { ROLES, User } from '@prisma/client';

export type Payload = {
  userId: number;
  email: string;
  role: ROLES;
};

export type AuthObj = {
  accessToken: string;
  user: Omit<User, 'password'>;
};
