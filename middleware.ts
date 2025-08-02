import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public paths that don't require authentication
const publicPaths = ['/login', '/debug-auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and other Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public/')
  ) {
    return NextResponse.next();
  }

  // Check if the current path is public
  const isPublicPath = publicPaths.includes(pathname);

  // Get the token from cookies (check both 'token' and 'access_token')
  const token = request.cookies.get('token')?.value || request.cookies.get('access_token')?.value;

  // If it's the login page
  if (isPublicPath) {
    // If user is already logged in and tries to access login page, redirect to home
    if (token && token.trim() !== '') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // For all other routes, check authentication
  if (!token || token.trim() === '') {
    // Prevent redirect loop by checking if we're already going to login
    if (pathname === '/login') {
      return NextResponse.next();
    }
    
    const loginUrl = new URL('/login', request.url);
    // Only add 'from' parameter if it's not the root path to avoid loops
    if (pathname !== '/') {
      loginUrl.searchParams.set('from', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - .well-known (for SSL certificates)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/|.well-known).*)',
  ],
};
