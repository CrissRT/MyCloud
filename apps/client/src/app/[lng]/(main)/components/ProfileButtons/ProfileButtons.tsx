'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useTranslation } from 'react-i18next';
import { Dropdown } from '@client/components';
import { useAuth } from '@client/hooks';
import { protectedRoutes } from '@client/utils';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export const ProfileButtons = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, logOut } = useAuth();

  const profileImageSrc = user?.profileImage && `data:image/jpeg;base64,${user.profileImage}`;

  if (!user || !profileImageSrc)
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
              src={profileImageSrc}
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
        { label: t('auth.logOut'), value: 'logOut', onClick: () => logOut() }
      ]}
    />
  );
};
