import { getTranslations } from 'next-intl/server';

import { Input } from '@client/components';
import { Password } from '@client/components';

const Page = async () => {
  const t = await getTranslations('auth');

  return (
    <>
      <h1 className="text-4xl mb-2 mt-2.5 text-center">{t('login.welcome')}</h1>
      <p className="mb-8 mt-4 text-(--text-secondary) text-center">{t('login.login')}</p>
      <Input label={{ text: t('email') }} input={{ id: 'email', name: 'email' }} size="2xl" />
      <Password label={{ text: t('password') }} />
    </>
  );
};

export default Page;
