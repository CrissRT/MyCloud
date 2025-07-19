'use client';

import { DashboardHeader } from '@client/app/[lng]/(main)/components';
import { ItemGrid } from '@client/components';

const Page = () => {
  return (
    <>
      <DashboardHeader title="Dashboard" />
      <div className='pt-4'>
        <ItemGrid link="#" title="Projects" description="4 items" icon="folder" />
      </div>
    </>
  );
};

export default Page;
