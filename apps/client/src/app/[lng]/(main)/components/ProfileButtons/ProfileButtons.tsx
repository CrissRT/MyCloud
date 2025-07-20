'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useTranslation } from 'react-i18next';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Dropdown } from '@client/components';
import { useAuth } from '@client/hooks';
import { protectedRoutes } from '@client/utils';

export const ProfileButtons = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, logOut } = useAuth();

  if (!user || !user?.profileImage)
    return (
      <SkeletonTheme baseColor="var(--bg-color)" highlightColor="var(--secondary-bg-color)">
        <Skeleton count={1} height={32} width={120} />
      </SkeletonTheme>
    );

  return (
    <Dropdown
      button={{
        children: (
          <div className="flex items-center gap-2">
            <Image
              src={user?.profileImage}
              alt={`${user?.firstName} ${user?.lastName}`}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <span>{`${user?.firstName} ${user?.lastName}`}</span>
          </div>
        )
      }}
      options={[
        { label: t('common.settings'), value: 'settings', onClick: () => router.push(protectedRoutes.settings) },
        { label: t('auth.logOut'), value: 'logOut', onClick: async () => await logOut() }
      ]}
    />
  );
};
