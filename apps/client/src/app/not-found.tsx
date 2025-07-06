'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useTranslation } from 'react-i18next';
import { AppLink, Button } from '@client/components';
import { guestRoutes } from '@client/utils';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NotFound = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const goBack = () => router.back();

  return (
    <div className="w-full h-full max-w-full flex flex-col px-16 py-12 justify-between bg-(--bg-color) max-lg:gap-6 max-md:px-4 max-md-py-2">
      <div className="flex gap-24 justify-center max-lg:flex-col max-lg:items-center max-lg:gap-12">
        <div className="flex flex-col gap-12 max-lg:gap-6">
          <div className="text-(--text-primary) text-9xl font-bold max-lg:text-center">404</div>

          <FontAwesomeIcon icon={faCircleExclamation} className="text-8xl text-(--error-color)" />
        </div>

        <div className="flex flex-col gap-8 text-balance w-fit max-w-full">
          <h1 className="w-fit font-bold text-4xl">{t('errors.notFound.pageNotFound')}</h1>

          <p className="w-fit text-xl">{t('errors.notFound.pageNotFoundDescription')}</p>

          <div className="bg-(--secondary-bg-color) rounded-lg border-(--border-color) border p-6 w-max max-w-full">
            <h3 className="w-fit text-xl">{t('errors.notFound.whatCanDo')}</h3>

            <ul className="list-disc text-(--text-secondary) ml-8 mt-3">
              <li>{t('errors.notFound.checkTypos')}</li>
              <li>{t('errors.notFound.goBackPrevPage')}</li>
              <li>{t('errors.notFound.visitHomeePage')}</li>
              <li>{t('errors.notFound.useSearch')}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-6">
        <div className="w-full flex justify-center gap-6">
          <Link href="#">
            <Button size="md">{t('errors.notFound.goHomePage')}</Button>
          </Link>
          <Button variant="outlined" onClick={goBack} size="md">
            {t('errors.notFound.goBack')}
          </Button>
        </div>

        <div className="w-full flex gap-4 justify-center">
          <AppLink href={guestRoutes.login}>{t('auth.login.buttons.login')}</AppLink>
          <AppLink href={guestRoutes.register}>{t('auth.login.buttons.register')}</AppLink>
        </div>
      </div>
    </div>
  );
};
// TODO: add links to go home page and go back

export default NotFound;
