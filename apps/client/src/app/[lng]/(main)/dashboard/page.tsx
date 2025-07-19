'use client';

import { DashboardHeader } from '@client/app/[lng]/(main)/components';
import { ItemGrid } from '@client/components';
import { iconsMap } from '@client/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        {layout === 'grid' ? (
          <div className="grid-auto-fill-200 gap-6">
            <ItemGrid link="#" title="Projects" description="4 items" icon="folder" />
          </div>
        ) : (
          <div>
            <div className="font-bold text-(--text-secondary) grid-5-cols gap-4 px-4 py-3 rounded border-b-1 border-(--border-color)">
              <span>Name</span>
              <span>Genre</span>
              <span>Size</span>
              <span>Modified</span>
              <span></span>
            </div>
            <div className="text-(--text-primary) grid-5-cols px-4 py-3 gap-4 rounded border-b-1 border-(--border-color)">
              <span className="text-ellipsis overflow-hidden">
                <FontAwesomeIcon icon={iconsMap.folder.icon} color={iconsMap.folder.color} /> Action Movie.mp4
              </span>
              <span className="text-ellipsis overflow-hidden">Action Movie.mp4</span>
              <span className="text-ellipsis overflow-hidden">Action Movie.mp4</span>
              <span className="text-ellipsis overflow-hidden">Action Movie.mp4</span>
              <span className="text-ellipsis overflow-hidden">Action Movie.mp4</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
