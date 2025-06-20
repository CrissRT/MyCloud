import { getTranslations } from 'next-intl/server';

const Page = async () => {
  const t = await getTranslations('auth.login');

  return (
    <>
      <h1 className="text-4xl mb-[0.5rem] mt-[0.67rem] text-center">{t('welcome')}</h1>
      <p className="mb-[2rem] mt-[1rem] text-(--text-secondary) text-center">{t('login')}</p>
    </>
  );
};

export default Page;
