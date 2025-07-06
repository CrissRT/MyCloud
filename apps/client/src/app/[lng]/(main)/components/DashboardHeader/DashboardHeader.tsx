'use client';

import Link from 'next/link';

import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from '@client/components';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  parents?: string[];
  title: string;
}

export const DashboardHeader = ({ parents, title }: Props) => {
  const parentsSlice = parents?.slice(-2) || [];
  const { t } = useTranslation();

  return (
    <div className="flex text-3xl mb-2 font-bold w-full justify-between">
      <h1>
        {parentsSlice[0] && (
          <>
            <Link href={`/${parentsSlice[0]}`} className="text-(--text-secondary)">
              ...
            </Link>{' '}
            /{' '}
          </>
        )}
        {parentsSlice[1] && (
          <>
            <Link href={`/${parentsSlice[1]}`} className="text-(--text-secondary)">
              {parentsSlice[1]}
            </Link>{' '}
            /{' '}
          </>
        )}
        {title}
      </h1>

      <div className="flex gap-4">
        <Dropdown
          options={[
            { label: t('common.sort.sortByName'), value: 'name' },
            { label: t('common.sort.sortByDate'), value: 'date' },
            { label: t('common.sort.sortBySize'), value: 'size' }
          ]}
          size="sm"
          placeholder={t('common.sort.sortBy')}
        />

        <Button size="sm" icon={<FontAwesomeIcon icon={faUpload} />}>
          {t('common.upload')}
        </Button>
      </div>
    </div>
  );
};
