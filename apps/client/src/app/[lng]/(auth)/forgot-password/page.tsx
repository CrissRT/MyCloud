'use client';

import { z } from 'zod';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@client/components';
import { AuthLayout } from '@client/layouts';
import { routes } from '@client/utils';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email()
});

type ForgotPasswordType = z.infer<typeof schema>;

const Page = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: ForgotPasswordType) => {
    console.log('Forgot password data:', data);
  };

  return (
    <AuthLayout
      title={t('auth.forgotPassword.forgotPassword')}
      description={t('auth.forgotPassword.enterEmail')}
      redirect={{
        description: t('auth.forgotPassword.rememberPassword'),
        href: routes.login,
        linkLabel: t('auth.login.buttons.login')
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          input={{ placeholder: t('auth.enterEmail'), id: 'email', ...register('email') }}
          label={{ text: t('auth.email') }}
          error={errors?.email?.message}
          size="2xl"
        />
        <Button width="full" type="submit">
          {t('auth.forgotPassword.sendResetLink')}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Page;
