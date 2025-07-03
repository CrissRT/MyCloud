import { NextRequest, NextResponse } from 'next/server';
import { i18nRouter } from 'next-i18n-router';

import { i18nConfig } from './i18n/settings';
import { guestRoutes } from './utils';

export function middleware(request: NextRequest) {
  // handle locale routing
  const response = i18nRouter(request, i18nConfig);

  const { pathname } = request.nextUrl;
  // guest-only pages: prevent logged-in users from accessing
  const cleanPath = pathname.replace(/^\/\w+|\/$/g, '');
  if (Object.values(guestRoutes).includes(cleanPath)) {
    const userSession = request.cookies.get('user_session');
    if (userSession) return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
