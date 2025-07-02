'use client';

import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@client/layouts';
import { routes } from '@client/utils';

const Page = () => {
  const { t } = useTranslation();
  return (
    <AuthLayout
      title={t('auth.resetPassword.resetPassword')}
      description={t('auth.resetPassword.resetDescription')}
      redirect={{
        description: t('auth.forgotPassword.rememberPassword'),
        href: routes.login,
        linkLabel: t('auth.login.buttons.login')
      }}
    >
      <form></form>
    </AuthLayout>
  );
};

export default Page;
