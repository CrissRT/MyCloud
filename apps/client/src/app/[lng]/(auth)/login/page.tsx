'use client';

import { z } from 'zod';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useGoogleServicePostAuthGoogle, useLoginServicePostAuthLogin } from '@client/api/openapi/queries';
import { Button, GoogleOAuthButton, Input, Password } from '@client/components';
import { useAuth } from '@client/hooks';
import { AuthLayout } from '@client/layouts';
import { guestRoutes, showApiErrors } from '@client/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordRegex } from '@shared/utils';

const Page = () => {
  const { t: customZod } = useTranslation('customZod');
  const { t } = useTranslation();
  const { login } = useAuth();

  const schema = z.object({
    email: z.string().email(),
    password: z.string().regex(passwordRegex, { message: customZod('invalid_password_address') })
  });

  type LoginType = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginType>({
    resolver: zodResolver(schema)
  });

  const { mutateAsync, isPending } = useLoginServicePostAuthLogin({
    onSuccess: async () => await login(),
    onError: showApiErrors
  });

  const onSubmit = async (data: LoginType) =>
    await mutateAsync({ requestBody: { email: data.email, password: data.password } });

  const { mutateAsync: googleLogin } = useGoogleServicePostAuthGoogle({
    onSuccess: async () => await login(),
    onError: showApiErrors
  });

  const onGoogleLogin = async (credential: string) => await googleLogin({ requestBody: { credential } });

  return (
    <AuthLayout
      title={t('auth.login.welcome')}
      description={t('auth.login.login')}
      additionalLink={{
        href: guestRoutes.forgotPassword,
        label: t('auth.login.buttons.forgetPassword')
      }}
      redirect={{
        description: t('auth.login.dontHaveAccount'),
        href: guestRoutes.register,
        linkLabel: t('auth.login.buttons.register')
      }}
    >
      <GoogleOAuthButton onSuccess={onGoogleLogin} />
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-3 text-gray-500 text-sm">{t('auth.or')}</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label={{ text: t('auth.email') }}
          input={{ id: 'email', placeholder: t('auth.enterEmail'), ...register('email', { required: true }) }}
          size="2xl"
          error={errors.email?.message}
        />
        <Password
          label={{ text: t('auth.password') }}
          input={{
            id: 'password',
            placeholder: t('auth.enterPassword'),
            ...register('password', { required: true })
          }}
          error={errors.password?.message}
        />
        <Button width="full" type="submit" loading={isPending}>
          {t('auth.login.buttons.login')}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Page;
