'use client';

import { z } from 'zod';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLoginServicePostAuthLogin } from '@client/api/openapi/queries';
import { Button, Input, Password } from '@client/components';
import { AuthLayout } from '@client/layouts';
import { routes } from '@client/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordRegex } from '@shared/utils';

const Page = () => {
  const { t: customZod } = useTranslation('customZod');
  const { t } = useTranslation();

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

  const { mutateAsync } = useLoginServicePostAuthLogin({
    onSuccess: (data) => {
      console.log('Login successful:', data);
      // Handle successful login, e.g., redirect or show a success message
    },
    onError: (error) => {
      console.error('Login failed:', error);
      // Handle login error, e.g., show an error message
    }
  });

  const onSubmit = async (data: LoginType) => {
    await mutateAsync({ requestBody: { email: data.email, password: data.password } });
  };

  return (
    <AuthLayout
      title={t('auth.login.welcome')}
      description={t('auth.login.login')}
      additionalLink={{
        href: routes.forgotPassword,
        label: t('auth.login.buttons.forgetPassword')
      }}
      redirect={{
        description: t('auth.login.dontHaveAccount'),
        href: routes.register,
        linkLabel: t('auth.login.buttons.register')
      }}
    >
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
        <Button variant="outlined" color="error" width="full" type="submit">
          {t('auth.login.buttons.login')}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Page;
