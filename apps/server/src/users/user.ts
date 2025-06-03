export enum Role {
  USER = 'user',
  ADMIN = 'admin'
}

export enum Sex {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  role: Role;
  sex: Sex;
}

export interface UserSession {
  id: number;
  userId: number;
  deviceInfo: string;
  ip: string;
  refreshToken: string | null;
  createdAt: Date;
  lastActive: Date;
}
