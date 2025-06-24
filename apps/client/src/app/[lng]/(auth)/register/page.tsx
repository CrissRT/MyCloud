'use client';

import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@client/layouts';
import { routes } from '@client/utils';

const Page = () => {
  const { t } = useTranslation();
  return (
    <AuthLayout
      title={t('auth.register.createAccount')}
      description={t('auth.register.joinUs')}
      redirect={{
        href: routes.login,
        description: t('auth.register.alreadyHaveAccount'),
        linkLabel: t('auth.login.buttons.login')
      }}
    ></AuthLayout>
  );
};

export default Page;
