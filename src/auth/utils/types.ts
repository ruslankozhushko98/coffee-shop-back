import { User } from 'src/auth/entities';

export type Payload = {
  userId: number;
  email: string;
};

export type AuthObj = {
  accessToken: string;
  user: Omit<User, 'password' | 'publicKey'>;
};
