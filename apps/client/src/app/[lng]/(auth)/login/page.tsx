import { getTranslations } from 'next-intl/server';

import { Button, Input } from '@client/components';
import { Password } from '@client/components';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Page = async () => {
  const t = await getTranslations('auth');

  return (
    <>
      <h1 className="text-4xl mb-2 mt-2.5 text-center">{t('login.welcome')}</h1>
      <p className="mb-8 mt-4 text-(--text-secondary) text-center">{t('login.login')}</p>
      <Input label={{ text: t('email') }} input={{ id: 'email', name: 'email' }} size="2xl" />
      <Password label={{ text: t('password') }} />
      <Button variant="outlined" color="error" width="full" icon={<FontAwesomeIcon icon={faEye} />}>
        abc
      </Button>
    </>
  );
};

export default Page;
