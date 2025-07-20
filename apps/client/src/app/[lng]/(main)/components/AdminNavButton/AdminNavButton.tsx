'use client';

import { useTranslation } from 'react-i18next';
import { NavButton } from '@client/components';
import { useAuth } from '@client/hooks';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';

export const AdminNavButton = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user || user.role !== 'admin') return null;

  return (
    <NavButton href={'#'} icon={faUserShield}>
      {t('common.admin')}
    </NavButton>
  );
};
