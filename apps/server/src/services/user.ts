import { User, UserSession } from '@server/models/user';

export type UserRegisterParams = Pick<User, 'email' | 'password' | 'sex' | 'firstName' | 'lastName'> &
  Pick<UserSession, 'deviceInfo' | 'ip'>;

export class UsersService {
  public register() {
    return {
    //   id: Math.floor(Math.random() * 10000), // Random
    //   status: 'Happy',
    //   ...userCreationParams
    };
  }
}
