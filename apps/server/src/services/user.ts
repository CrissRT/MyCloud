import { User, UserSession } from '@server/models';

export type UserRegisterParams = Partial<
  Pick<User, 'email' | 'password' | 'sex' | 'firstName' | 'lastName' | 'birthDate'> &
    Pick<UserSession, 'deviceInfo' | 'ip'>
>;

export class UsersService {
  public register() {}
}
