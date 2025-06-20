import { getTranslations } from 'next-intl/server';

import { Input } from '@client/components';

const Page = async () => {
  const t = await getTranslations('auth');

  return (
    <>
      <h1 className="text-4xl mb-[0.5rem] mt-[0.67rem] text-center">{t('login.welcome')}</h1>
      <p className="mb-[2rem] mt-[1rem] text-(--text-secondary) text-center">{t('login.login')}</p>
      <Input label={{ text: t('email') }} input={{ id: 'email', name: 'email' }} />
      <Input label={{ text: t('password') }} input={{ id: 'password', name: 'password' }} />
    </>
  );
};

export default Page;
