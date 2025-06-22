import { getTranslations } from 'next-intl/server';

import { AppLink } from '@client/components';
import { routes } from '@client/utils';

import { FormLogin } from './components';

const Page = async () => {
  const t = await getTranslations('auth');

  return (
    <>
      <h1 className="text-4xl mb-2 mt-2.5 text-center">{t('login.welcome')}</h1>
      <p className="mb-8 mt-4 text-(--text-secondary) text-center">{t('login.login')}</p>
      <FormLogin />

      <div className="flex justify-center mt-6 flex-col items-center gap-3">
        <AppLink href={routes.register}>{t('login.buttons.forgetPassword')}</AppLink>

        <p>
          {t('login.dontHaveAccount')} <AppLink href={routes.register}>{t('login.buttons.register')}</AppLink>
        </p>
      </div>
    </>
  );
};

export default Page;
