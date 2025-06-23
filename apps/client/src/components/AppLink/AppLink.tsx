import { PropsWithChildren } from 'react';
import { Link } from '@client/i18n';

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
