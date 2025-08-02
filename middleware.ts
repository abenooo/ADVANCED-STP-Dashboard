import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login', '/register', '/forgot-password', '/api/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and public paths
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public/') ||
    pathname.includes('.') ||
    publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))
  ) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('token')?.value || 
               request.cookies.get('access_token')?.value;

  // If no token, redirect to login
  if (!token) {
    console.log('No auth token found, redirecting to login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For now, just check if token exists
  // In a real app, you might want to verify the token's signature
  // or check its expiration
  try {
    // Simple check if token exists and looks valid (starts with ey...)
    if (!token.startsWith('ey')) {
      throw new Error('Invalid token format');
    }
    
    // Token looks valid, proceed with the request
    return NextResponse.next();
  } catch (error) {
    console.error('Token validation failed:', error);
    
    // Clear invalid cookies and redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    
    const response = NextResponse.redirect(loginUrl);
    
    // Clear all auth cookies
    ['token', 'access_token'].forEach(cookie => {
      response.cookies.delete(cookie);
    });
    
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public/|.well-known).*)',
  ],
};
