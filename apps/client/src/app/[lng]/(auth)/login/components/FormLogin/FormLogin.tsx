'use client';

import { useTranslations } from 'next-intl';

import { Button, Input, Password } from '@client/components';

export const FormLogin = () => {
  const t = useTranslations('auth');

  return (
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
  );
};
