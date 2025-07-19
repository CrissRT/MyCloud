'use client';

import { DashboardHeader } from '@client/app/[lng]/(main)/components';
import { ItemGrid } from '@client/components';

const Page = () => {
  return (
    <>
      <DashboardHeader title="Dashboard" />
      <div className='pt-4'>
        <ItemGrid />
      </div>
    </>
  );
};

export default Page;
