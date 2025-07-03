import { ThemeProvider } from 'next-themes';

import { PropsWithChildren } from 'react';
import { NotificationContainer } from '@client/components';
import { getGoogleSSOClientId, PromiseLanguage } from '@client/utils';
import { config } from '@fortawesome/fontawesome-svg-core';

import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import { APIProvider, AppI18nextProvider, AuthProvider, QueryClientContext } from '@client/contexts';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
    <html lang={lng} suppressHydrationWarning className="h-full w-full min-w-[320px] min-h-full">
      <body className="antialiased w-full h-full text-(--text-primary) min-h-full">
        <AuthProvider>
          <GoogleOAuthProvider clientId={getGoogleSSOClientId()}>
            <AppI18nextProvider>
              <QueryClientContext>
                <APIProvider>
                  <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
                    {children}
                    <NotificationContainer />
                  </ThemeProvider>
                </APIProvider>
              </QueryClientContext>
            </AppI18nextProvider>
          </GoogleOAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
