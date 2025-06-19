import { NextRequest } from 'next/server';
import { i18nRouter } from 'next-i18n-router';

import { i18nConfig } from '@client/i18n';

export const middleware = (request: NextRequest) => i18nRouter(request, i18nConfig);

export const config = {
  matcher: ['/((?!_next|static|api|images|fonts|favicons|media).*)']
};
