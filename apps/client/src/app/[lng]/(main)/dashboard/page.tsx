'use client';

import { DashboardHeader } from '@client/app/[lng]/(main)/components';
import { ItemGrid } from '@client/components';
import { useState } from 'react';

const Page = () => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  // TODO : fetch layout from user preferences or default to 'grid'

  const onChangeLayout = (value: string) => {
    switch (value) {
      case 'grid':
        setLayout('grid');
        break;
      case 'list':
        setLayout('list');
        break;
      default:
        setLayout('grid');
    }
  };

  return (
    <>
      <DashboardHeader title="Dashboard" layout={layout} onChangeLayout={onChangeLayout} />
      <div className="pt-4">
        {layout === 'grid' && <ItemGrid link="#" title="Projects" description="4 items" icon="folder" />}
      </div>
    </>
  );
};

export default Page;
