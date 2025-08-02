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

  // If we have a token, verify it with the backend
  try {
    const verifyRes = await fetch('http://localhost:3000/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!verifyRes.ok) {
      throw new Error('Invalid token');
    }

    // Token is valid, proceed with the request
    return NextResponse.next();
  } catch (error) {
    console.error('Token verification failed:', error);
    
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
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!api|_next/static|_next/image|favicon.ico|public/|.well-known).*)',
  ],
};
