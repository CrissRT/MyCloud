'use client';

import { useRouter } from 'next/navigation';

import { useTranslation } from 'react-i18next';
import { Dropdown } from '@client/components';
import { useAuth } from '@client/hooks';

export const ProfileButtons = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();

  return (
    <Dropdown
      button={{ children: `${user?.firstName} ${user?.lastName}` }}
      options={[
        { label: t('common.profile'), value: 'profile', onClick: () => router.push('/profile') },
        { label: t('common.profilessss'), value: 'profile', onClick: () => router.push('/profile2') }
      ]}
    />
  );
};
