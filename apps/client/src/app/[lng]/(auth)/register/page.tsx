'use client';

import { useTranslation } from 'react-i18next';
import { Input, Password } from '@client/components';
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
    >
      <form>
        <Input label={{ text: t('auth.email') }} input={{ placeholder: t('auth.enterEmail') }} />
        <Password label={{ text: t('auth.password') }} input={{ placeholder: t('auth.enterPassword') }} />
        <Password label={{ text: t('auth.confirmPassword') }} input={{ placeholder: t('auth.enterConfirmPassword') }} />
        <div className="flex gap-4 max-md:gap-0 max-md:flex-col">
          <Input label={{ text: t('auth.firstName') }} input={{ placeholder: t('auth.enterFirstName') }} size="lg" />
          <Input label={{ text: t('auth.lastName') }} input={{ placeholder: t('auth.enterLastName') }} size="lg" />
        </div>
      </form>
    </AuthLayout>
  );
};

export default Page;
