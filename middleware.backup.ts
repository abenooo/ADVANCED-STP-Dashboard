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
    pathname.startsWith('/public/') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next();
  }

  // Always allow access to public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Get the token from cookies (check multiple possible cookie names)
  const token = request.cookies.get('token')?.value || 
                request.cookies.get('access_token')?.value ||
                request.cookies.get('authToken')?.value;

  // Only redirect to login if there's absolutely no token and it's not already a public path
  if (!token) {
    // Prevent infinite redirects by being very specific about when to redirect
    if (pathname !== '/login' && !pathname.startsWith('/login')) {
      const loginUrl = new URL('/login', request.url);
      // Only add 'from' parameter for non-root paths
      if (pathname !== '/') {
        loginUrl.searchParams.set('from', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow all other requests to proceed
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
