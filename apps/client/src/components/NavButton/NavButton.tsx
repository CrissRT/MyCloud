'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { PropsWithChildren } from 'react';
import { Button } from '@client/components';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props extends PropsWithChildren {
  href: string;
  icon: IconDefinition;
}

export const NavButton = ({ href, icon, children }: Props) => {
  const pathname = usePathname();

  const isActive = pathname.replace(/^\/\w+/, '').startsWith(href);

  return (
    <Link href={href}>
      <Button width="full" align="left" variant={isActive ? 'filled' : 'text'} icon={<FontAwesomeIcon icon={icon} />}>
        {children}
      </Button>
    </Link>
  );
};
