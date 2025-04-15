import { Request } from 'express';

type Role = {
  name: string;
  id: number;
};

export type User = {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  roleId: number;
};

export type UserProfile = Omit<User, 'roleId'> & { role: Role };

export interface AuthRequest extends Request {
  user: {
    email: string;
    id: number;
    role: string;
    exp: number;
    iat: number;
  };
}
