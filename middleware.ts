import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/services/tokenService';

// Auth pages where logged-in users shouldn't linger
const AUTH_PAGES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
];

// Public routes accessible without authentication
const PUBLIC_PATHS = [
  '/',
  ...AUTH_PAGES,
];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Allow static assets, Next.js internals, and files with extensions
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for public pages
  const isPublicPage = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isAuthPage = AUTH_PAGES.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  // Verify session cookie
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const isAuthenticated = Boolean(session && session.userId);

  // If user is already authenticated and visits login/signup, redirect to dashboard or specified redirect
  if (isAuthenticated && isAuthPage) {
    const redirectUrl = req.nextUrl.searchParams.get('redirect');
    const target = redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')
      ? redirectUrl
      : '/dashboard';
    return NextResponse.redirect(new URL(target, req.url));
  }

  // If route is public and user is not authenticated (or is on landing page), let them proceed
  if (isPublicPage) {
    return NextResponse.next();
  }

  // Route is protected - require authentication
  if (!isAuthenticated) {
    // If it's an API request, return 401 Unauthorized JSON
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required. Access denied.' },
        { status: 401 }
      );
    }

    // For page requests, redirect to /login with redirect query param
    const loginUrl = new URL('/login', req.url);
    const fullPath = pathname + search;
    if (fullPath !== '/' && fullPath !== '') {
      loginUrl.searchParams.set('redirect', fullPath);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
