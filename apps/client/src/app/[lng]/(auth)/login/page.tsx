'use client';

import { useTranslations } from 'next-intl';
import { z } from 'zod';

import { useForm } from 'react-hook-form';
import { Button, Input, Password } from '@client/components';
import { AuthLayout } from '@client/layouts';
import { routes } from '@client/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordRegex } from '@shared/utils';

const Page = () => {
  const tZod = useTranslations();

  const schema = z.object({
    email: z.string().email(),
    password: z.string().regex(passwordRegex, { message: tZod('errors.invalid_password_address') })
  });

  type LoginType = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginType>({
    resolver: zodResolver(schema)
  });

  const t = useTranslations('auth');

  const onSubmit = (data: LoginType) => {
    console.log('Login data:', data);
  };

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label={{ text: t('email') }}
          input={{ id: 'email', placeholder: t('enterEmail'), ...register('email', { required: true }) }}
          size="2xl"
          error={errors.email?.message}
        />
        <Password
          label={{ text: t('password') }}
          input={{ id: 'password', placeholder: t('enterPassword'), ...register('password', { required: true }) }}
          error={errors.password?.message}
        />
        <Button variant="outlined" color="error" width="full" type="submit">
          {t('login.buttons.login')}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Page;
