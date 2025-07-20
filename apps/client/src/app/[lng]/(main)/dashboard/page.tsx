'use client';

import { useMeServiceGetAccountMeKey, usePreferencesServicePatchAccountPreferences } from '@client/api/openapi/queries';
import { DashboardHeader } from '@client/app/[lng]/(main)/components';
import { ItemGrid } from '@client/components';
import { useAuth } from '@client/hooks';
import { iconsMap, showApiErrors } from '@client/utils';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const Page = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [layout, setLayout] = useState<'grid' | 'list' | null>(user?.layout || null);

  const { mutate } = usePreferencesServicePatchAccountPreferences({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [useMeServiceGetAccountMeKey] });
      setLayout(user?.layout || 'grid');
    },
    onError: showApiErrors
  });

  useEffect(() => {
    if (user?.layout) setLayout(user.layout);
  }, [user?.layout]);

  const onChangeLayout = (value: string) => {
    let newLayout: 'grid' | 'list' = 'grid';
    if (value !== 'grid') newLayout = 'list';

    mutate({ requestBody: { layout: newLayout } });
  };

  const renderLayout = () => {
    switch (layout) {
      case 'grid':
        return (
          <div className="grid-auto-fill-200 gap-6">
            <ItemGrid link="#" title="Projects" description="4 items" icon="folder" />
          </div>
        );
      case 'list':
        return (
          <div>
            <div className="font-bold text-(--text-secondary) grid-5-cols gap-4 px-4 py-3 rounded-2xl border-b-1 border-(--border-color)">
              <span>Name</span>
              <span>Genre</span>
              <span>Size</span>
              <span>Modified</span>
              <span></span>
            </div>
            <div className="text-(--text-primary) grid-5-cols px-4 py-3 gap-4 rounded-2xl border-b-1 border-(--border-color) cursor-pointer hover:bg-(--secondary-bg-color)">
              <span className="text-ellipsis overflow-hidden">
                <FontAwesomeIcon icon={iconsMap.folder.icon} color={iconsMap.folder.color} /> Action Movie.mp4
              </span>
              <span className="text-ellipsis overflow-hidden">Action Movie.mp4</span>
              <span className="text-ellipsis overflow-hidden">Action Movie.mp4</span>
              <span className="text-ellipsis overflow-hidden">Action Movie.mp4</span>
              <span className="text-ellipsis overflow-hidden">
                <FontAwesomeIcon icon={faEllipsis} />
              </span>
            </div>
          </div>
        );
      default:
        return (
          <SkeletonTheme baseColor="var(--bg-color)" highlightColor="var(--secondary-bg-color)">
            <Skeleton count={3} height="200px" width="100%" />
          </SkeletonTheme>
        );
    }
  };

  return (
    <>
      <DashboardHeader title="Dashboard" layout={layout} onChangeLayout={onChangeLayout} />
      <div className="pt-4">{renderLayout()}</div>
    </>
  );
};

export default Page;
