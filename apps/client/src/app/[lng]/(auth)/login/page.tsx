import { getTranslations } from 'next-intl/server';

import { Button, Input, Password } from '@client/components';
import { AuthLayout } from '@client/layouts';
import { routes } from '@client/utils';

const Page = async () => {
  const t = await getTranslations('auth');

  return (
    <AuthLayout
      title={t('login.welcome')}
      description={t('login.login')}
      additionalLink={{
        href: routes.forgotPassword,
        label: t('login.buttons.forgetPassword')
      }}
      redirect={{
        description: t('login.dontHaveAccount'),
        href: routes.register,
        linkLabel: t('login.buttons.register')
      }}
    >
      <form>
        <Input
          label={{ text: t('email') }}
          input={{ id: 'email', name: 'email', placeholder: t('enterEmail') }}
          size="2xl"
        />
        <Password
          label={{ text: t('password') }}
          input={{ id: 'password', name: 'password', placeholder: t('enterPassword') }}
        />
        <Button variant="outlined" color="error" width="full">
          {t('login.buttons.login')}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Page;
