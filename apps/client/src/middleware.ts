import { NextRequest, NextResponse } from 'next/server';
import { i18nRouter } from 'next-i18n-router';

import { i18nConfig } from './i18n/settings';
import { guestRoutes, protectedRoutes } from './utils';

export function middleware(request: NextRequest) {
  // handle locale routing
  const response = i18nRouter(request, i18nConfig);

  const { pathname } = request.nextUrl;
  const userSession = request.cookies.get('user_session');

  // guest-only pages: prevent logged-in users from accessing
  const cleanPath = pathname.replace(/^\/\w+|\/$/g, '');
  if (Object.values(guestRoutes).includes(cleanPath) && userSession)
    return NextResponse.redirect(new URL(protectedRoutes.dashboard, request.url));

  // protected routes: redirect to login if user is not authenticated
  if (Object.values(protectedRoutes).includes(cleanPath) && !userSession)
    return NextResponse.redirect(new URL(guestRoutes.login, request.url));

  return response;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
