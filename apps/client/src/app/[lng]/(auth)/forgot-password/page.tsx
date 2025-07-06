'use client';

import { z } from 'zod';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useForgotPasswordServicePostAuthForgotPassword } from '@client/api/openapi/queries';
import { Button, Input } from '@client/components';
import { AuthLayout } from '@client/layouts';
import { guestRoutes, showApiErrors } from '@client/utils';
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

  const { mutateAsync, isPending } = useForgotPasswordServicePostAuthForgotPassword({
    onSuccess: (data) => {
      console.log('Forgot password email sent successfully:', data);
    },
    onError: showApiErrors
  });

  const onSubmit = async (requestBody: ForgotPasswordType) => {
    await mutateAsync({ requestBody });
  };

  return (
    <AuthLayout
      title={t('auth.forgotPassword.forgotPassword')}
      description={t('auth.forgotPassword.enterEmail')}
      redirect={{
        description: t('auth.forgotPassword.rememberPassword'),
        href: guestRoutes.login,
        linkLabel: t('auth.login.buttons.login')
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          input={{ placeholder: t('auth.enterEmail'), id: 'email', ...register('email') }}
          label={{ text: t('auth.email') }}
          error={errors?.email?.message}
          size="xl"
        />
        <Button width="full" type="submit" loading={isPending} size="xl">
          {t('auth.forgotPassword.sendResetLink')}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Page;
