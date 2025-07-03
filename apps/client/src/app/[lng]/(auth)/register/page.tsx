'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useGoogleServicePostAuthGoogle, useRegisterServicePostAuthRegister } from '@client/api/openapi/queries';
import { Button, DatePicker, Dropdown, GoogleOAuthButton, Input, Password } from '@client/components';
import { AuthLayout } from '@client/layouts';
import { guestRoutes, protectedRoutes, Sex, showApiErrors } from '@client/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordRegex } from '@shared/utils';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const Page = () => {
  const { t: customZod } = useTranslation('customZod');
  const { t } = useTranslation();
  const { t: zodT } = useTranslation('zod');
  const router = useRouter();

  const registerSchema = z
    .object({
      email: z.string().email(),
      password: z.string().regex(passwordRegex, { message: customZod('invalid_password_address') }),
      confirmPassword: z.string(),
      firstName: z.string().min(3).max(255),
      lastName: z.string().min(3).max(255),
      birthDate: z.string().regex(dateRegex, { message: zodT('errors.invalid_date') }),
      sex: z.nativeEnum(Sex)
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

  const { mutateAsync, isPending } = useRegisterServicePostAuthRegister({
    onSuccess: () => {
      router.push(protectedRoutes.dashboard);
    },
    onError: showApiErrors
  });

  const onSubmit = async (requestBody: RegisterType) => await mutateAsync({ requestBody });

  const { mutateAsync: googleSignIn } = useGoogleServicePostAuthGoogle({
    onSuccess: () => {
      router.push(protectedRoutes.dashboard);
    },
    onError: showApiErrors
  });

  const onGoogleSignIn = async (credential: string) => await googleSignIn({ requestBody: { credential } });

  return (
    <AuthLayout
      title={t('auth.register.createAccount')}
      description={t('auth.register.joinUs')}
      redirect={{
        href: guestRoutes.login,
        description: t('auth.register.alreadyHaveAccount'),
        linkLabel: t('auth.login.buttons.login')
      }}
    >
      <GoogleOAuthButton onSuccess={onGoogleSignIn} />
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-3 text-gray-500 text-sm">{t('auth.or')}</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label={{ text: t('auth.email') }}
          error={errors.email?.message}
          input={{ placeholder: t('auth.enterEmail'), id: 'email', ...register('email', { required: true }) }}
          size="2xl"
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
          size="2xl"
        />
        <Input
          label={{ text: t('auth.firstName') }}
          input={{
            placeholder: t('auth.enterFirstName'),
            id: 'firstName',
            ...register('firstName', { required: true })
          }}
          error={errors.firstName?.message}
          size="2xl"
        />
        <Input
          label={{ text: t('auth.lastName') }}
          input={{
            placeholder: t('auth.enterLastName'),
            id: 'lastName',
            ...register('lastName', { required: true })
          }}
          error={errors.lastName?.message}
          size="2xl"
        />
        <DatePicker
          label={{ text: t('auth.birthDate') }}
          error={errors.birthDate?.message}
          input={{ ...register('birthDate', { required: true }) }}
        />
        <Dropdown
          label={{ text: t('common.sex') }}
          options={[
            { value: Sex.MALE, label: t('common.male') },
            { value: Sex.FEMALE, label: t('common.female') },
            { value: Sex.OTHER, label: t('common.other') }
          ]}
          error={errors.sex?.message}
          input={{ ...register('sex', { required: true }) }}
        />
        <Button width="full" loading={isPending}>
          {t('auth.register.createAccount')}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Page;
