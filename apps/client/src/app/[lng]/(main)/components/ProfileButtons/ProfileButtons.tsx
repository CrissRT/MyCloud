'use client';

import { useRouter } from 'next/navigation';

import { useTranslation } from 'react-i18next';
import { Dropdown } from '@client/components';

export const ProfileButtons = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Dropdown
      button={{ children: 'asdasd' }}
      options={[
        { label: t('common.profile'), value: 'profile', onClick: () => router.push('/profile') },
        { label: t('common.profilessss'), value: 'profile', onClick: () => router.push('/profile2') }
      ]}
    />
  );
};
