import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';

import { PropsWithChildren } from 'react';
import { PromiseLanguage } from '@client/utils';
import { config } from '@fortawesome/fontawesome-svg-core';

import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import { QueryClientContext } from '@client/contexts';

import '@client/styles/globals.css';
import '@client/styles/theme.css';

const RootLayout = async ({
  children,
  params
}: {
  params: PromiseLanguage;
} & PropsWithChildren) => {
  const { lng } = await params;

  return (
    <html lang={lng} suppressHydrationWarning className="h-full w-full min-w-[320px]">
      <body className="antialiased w-full h-full text-(--text-primary)">
        <NextIntlClientProvider>
          <QueryClientContext>
            <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </QueryClientContext>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
