import { PropsWithChildren } from 'react';
import { AppLink } from '@client/components';

interface Props extends PropsWithChildren {
  title: string;
  description: string;
  additionalLink?: {
    href: string;
    label: string;
  };
  redirect: {
    description: string;
    href: string;
    linkLabel: string;
  };
}

export const AuthLayout = ({ children, additionalLink, title, description, redirect }: Props) => {
  return (
    <>
      <h1 className="text-4xl mb-2 mt-2.5 text-center">{title}</h1>
      <p className="mb-8 mt-4 text-(--text-secondary) text-center">{description}</p>

      {children}

      <div className="flex justify-center mt-6 flex-col items-center gap-3 mb-2.5">
        {additionalLink && (
          <AppLink href={additionalLink.href} className="text-(--link-color) no-underline hover:underline">
            {additionalLink.label}
          </AppLink>
        )}

        <p>
          {redirect.description} <AppLink href={redirect.href}>{redirect.linkLabel}</AppLink>
        </p>
      </div>
    </>
  );
};
