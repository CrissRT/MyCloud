import Image from 'next/image';

import { PropsWithChildren } from 'react';
import { Button, NavButton } from '@client/components';
import createServerI18n from '@client/i18n/i18n.server';
import { getUser, PromiseLanguage, protectedRoutes } from '@client/utils';
import { faBell, faHouse, faStar, faTrash, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ProfileButtons } from './components';

interface Props extends PropsWithChildren {
  params: PromiseLanguage;
}

const DashboardLayout = async ({ children, params }: Props) => {
  const user = await getUser();
  const { lng } = await params;
  const { t } = await createServerI18n(lng);

  return (
    <div className="flex h-screen bg-[var(--bg-color)]">
      <aside className="w-64 h-screen overflow-y-auto bg-(--secondary-bg-color) border-r-(--border-color)">
        <div className="sticky top-0 left-0 w-full h-full p-4">
          <div className="mx-auto my-6 w-fit">
            <Image src="/logo.png" alt="Logo" width={30} height={30} className="rounded inline-block align-middle" />
            <span className="inline-block align-middle ml-2 text-2xl">MyCloud</span>
          </div>

          <nav className="flex flex-col gap-2">
            <NavButton href={protectedRoutes.dashboard} icon={faHouse}>
              {t('common.myFiles')}
            </NavButton>

            <NavButton href={'#'} icon={faStar}>
              {t('common.favorites')}
            </NavButton>
            <NavButton href={'#'} icon={faTrash}>
              {t('common.trash')}
            </NavButton>
            {user && user.role === 'admin' && (
              <NavButton href={'#'} icon={faUserShield}>
                {t('common.admin')}
              </NavButton>
            )}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-end">
          <div className="flex gap-4">
            <Button icon={<FontAwesomeIcon icon={faBell} />} size="sm" variant="text"></Button>
            <ProfileButtons />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
