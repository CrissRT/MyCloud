'use client';

import Link from 'next/link';

interface Props {
  parents?: string[];
  title: string;
}

export const DashboardHeader = ({ parents, title }: Props) => {
  const parentsSlice = parents?.slice(-2) || [];

  return (
    <div className="flex text-3xl font-bold mb-4 w-full">
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
    </div>
  );
};
