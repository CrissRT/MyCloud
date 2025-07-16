'use client';

import { useAuth } from '@client/hooks';
import { NavButton } from '@client/components';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

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
