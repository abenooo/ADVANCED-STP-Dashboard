import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Only the login page is public
const publicPaths = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is the login page
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  // If it's the login page
  if (isPublicPath) {
    // If user is already logged in and tries to access login page, redirect to home
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // For all other routes, check authentication
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    // Store the attempted URL to redirect back after login
    loginUrl.searchParams.set('from', pathname);
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
