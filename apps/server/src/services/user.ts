import { TFunction } from 'i18next';

import { User, UserSession } from '@server/models';
import { BadRequestError } from '@server/utils';

export type UserRegisterParams = Partial<
  Pick<User, 'email' | 'password' | 'sex' | 'firstName' | 'lastName' | 'birthDate'> &
    Pick<UserSession, 'deviceInfo' | 'ip'>
>;

export class UsersService {
  public register(params: UserRegisterParams, t: TFunction) {
    const missingFields = Object.entries(params)
      .filter(([, value]) => !value)
      .map(([key]) => key);
    const missingDeviceInfo = missingFields.filter((field) => field === 'deviceInfo' || field === 'ip');

    if (missingFields.length > 0)
      throw new BadRequestError(t('missingFields', { fields: missingFields.join(', ') }), undefined, missingFields);

    if (missingDeviceInfo.length > 0)
      throw new BadRequestError(t('missingData', { data: missingDeviceInfo.join(', ') }), missingDeviceInfo);
  }
}
