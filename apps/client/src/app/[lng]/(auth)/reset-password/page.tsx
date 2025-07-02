'use client';

import { z } from 'zod';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Password } from '@client/components';
import { AuthLayout } from '@client/layouts';
import { routes } from '@client/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordRegex } from '@shared/utils';

const Page = () => {
  const { t } = useTranslation();
  const { t: customZodT } = useTranslation('customZod');

  const schema = z
    .object({
      password: z.string().regex(passwordRegex, { message: customZodT('invalid_password_address') }),
      confirmPassword: z.string().regex(passwordRegex, { message: customZodT('invalid_password_address') })
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: customZodT('password_not_matched'),
      path: ['confirmPassword']
    });

  type SchemaType = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SchemaType>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (requestBody: SchemaType) => {
    console.log('Resetting password with:', requestBody);
  };

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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Password
          label={{ text: t('auth.password') }}
          error={errors.password?.message}
          input={{ placeholder: t('auth.enterPassword'), id: 'password', ...register('password', { required: true }) }}
        />
        <Password
          label={{ text: t('auth.confirmPassword') }}
          error={errors.confirmPassword?.message}
          input={{
            placeholder: t('auth.enterConfirmPassword'),
            id: 'confirmPassword',
            ...register('confirmPassword', { required: true })
          }}
          size="2xl"
        />
        <Button width="full" type="submit">
          {t('auth.resetPassword.resetPassword')}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Page;
