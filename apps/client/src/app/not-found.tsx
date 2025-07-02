'use client';

import { useTranslation } from 'react-i18next';
import { AppLink, Button } from '@client/components';
import { routes } from '@client/utils';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full flex flex-col px-16 py-12 justify-between bg-(--bg-color) max-lg:gap-6 max-md:px-4 max-md-py-2">
      <div className="flex gap-24 justify-center max-lg:flex-col max-lg:items-center max-lg:gap-12">
        <div className="flex flex-col gap-12 max-lg:gap-6">
          <div className="text-(--text-primary) text-9xl font-bold max-lg:text-center">404</div>

          <FontAwesomeIcon icon={faCircleExclamation} className="text-8xl text-(--error-color)" />
        </div>

        <div className="flex flex-col gap-8 text-balance w-fit">
          <h1 className="w-fit font-bold text-4xl">{t('errors.notFound.pageNotFound')}</h1>

          <p className="w-fit text-xl">{t('errors.notFound.pageNotFoundDescription')}</p>

          <div className="bg-(--secondary-bg-color) rounded-lg border-(--border-color) border p-6 w-max">
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
          <Button>{t('errors.notFound.goHomePage')}</Button>
          <Button variant="outlined">{t('errors.notFound.goBack')}</Button>
        </div>

        <div className="w-full flex gap-4 justify-center">
          <AppLink href={routes.login}>{t('auth.login.buttons.login')}</AppLink>
          <AppLink href={routes.register}>{t('auth.login.buttons.register')}</AppLink>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
