import Link from 'next/link';

import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren, React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const AppLink = ({ children, href, ...rest }: Props) => {
  return (
    <Link href={href} {...rest} className="text-(--link-color) no-underline hover:underline">
      {children}
    </Link>
  );
};
