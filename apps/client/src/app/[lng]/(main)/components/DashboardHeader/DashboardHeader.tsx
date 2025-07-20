'use client';

import Link from 'next/link';

import { useTranslation } from 'react-i18next';
import { Button, Dropdown, SegmentedControl } from '@client/components';
import { faList, faTableCellsLarge, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

interface Props {
  parents?: string[];
  title: string;
  layout: 'grid' | 'list' | null;
  onChangeLayout: (value: string) => void;
}

export const DashboardHeader = ({ parents, title, layout, onChangeLayout }: Props) => {
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

      <div className="flex gap-4 items-center">
        <Dropdown
          options={[
            { label: t('common.sort.sortByName'), value: 'name' },
            { label: t('common.sort.sortByDate'), value: 'date' },
            { label: t('common.sort.sortBySize'), value: 'size' }
          ]}
          size="sm"
          placeholder={t('common.sort.sortBy')}
        />
        {/* TODO: add sort functionality */}

        {layout ? (
          <SegmentedControl
            options={[
              { value: 'grid', icon: <FontAwesomeIcon icon={faTableCellsLarge} /> },
              { value: 'list', icon: <FontAwesomeIcon icon={faList} /> }
            ]}
            value={layout}
            onChange={(value) => onChangeLayout(value)}
            size="sm"
          />
          // TODO: add layout change functionality
        ) : (
          <SkeletonTheme baseColor="var(--bg-color)" highlightColor="var(--secondary-bg-color)">
            <Skeleton count={1} height={32} width={110} />
          </SkeletonTheme>
        )}

        <Button size="sm" icon={<FontAwesomeIcon icon={faUpload} />}>
          {t('common.upload')}
        </Button>
      </div>
    </div>
  );
};
