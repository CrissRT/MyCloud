'use client';

import { useRouter } from 'next/navigation';

import { useTranslation } from 'react-i18next';
import { Dropdown } from '@client/components';
import { useAuth } from '@client/hooks';
import { protectedRoutes } from '@client/utils';

export const ProfileButtons = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, logOut } = useAuth();

  return (
    <Dropdown
      button={{ children: `${user?.firstName} ${user?.lastName}` }}
      options={[
        { label: t('common.settings'), value: 'settings', onClick: () => router.push(protectedRoutes.settings) },
        { label: t('auth.logOut'), value: 'logOut', onClick: () => logOut() }
      ]}
    />
  );
};
