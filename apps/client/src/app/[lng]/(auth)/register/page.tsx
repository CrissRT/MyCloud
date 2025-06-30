'use client';

import { z } from 'zod';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, DatePicker, Input, Password } from '@client/components';
import { AuthLayout } from '@client/layouts';
import { routes } from '@client/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordRegex } from '@shared/utils';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const Page = () => {
  const { t: customZod } = useTranslation('customZod');
  const { t } = useTranslation();
  const { t: zodT } = useTranslation('zod');

  const registerSchema = z
    .object({
      email: z.string().email(),
      password: z.string().regex(passwordRegex, { message: customZod('invalid_password_address') }),
      confirmPassword: z.string(),
      firstName: z.string().min(3).max(255),
      lastName: z.string().min(3).max(255),
      birthDate: z.string().regex(dateRegex, { message: zodT('errors.invalid_date') })
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: customZod('password_not_matched'),
      path: ['confirmPassword']
    });

  type RegisterType = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterType) => {
    console.log('Registration data:', data);
  };

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label={{ text: t('auth.email') }}
          error={errors.email?.message}
          input={{ placeholder: t('auth.enterEmail'), id: 'email', ...register('email', { required: true }) }}
        />
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
        />
        <div className="flex gap-4 max-md:gap-0 max-md:flex-col">
          <Input
            label={{ text: t('auth.firstName') }}
            input={{
              placeholder: t('auth.enterFirstName'),
              id: 'firstName',
              ...register('firstName', { required: true })
            }}
            error={errors.firstName?.message}
            size="lg"
          />
          <Input
            label={{ text: t('auth.lastName') }}
            input={{
              placeholder: t('auth.enterLastName'),
              id: 'lastName',
              ...register('lastName', { required: true })
            }}
            size="lg"
            error={errors.lastName?.message}
          />
        </div>
        <DatePicker
          label={{ text: t('auth.birthDate') }}
          error={errors.birthDate?.message}
          input={{ ...register('birthDate', { required: true }) }}
        />
        <Button width="full">{t('auth.register.createAccount')}</Button>
      </form>
    </AuthLayout>
  );
};

export default Page;
