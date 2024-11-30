import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Attempt to retrieve the token from cookies
  const token = request.cookies.get('protectionToken')?.value;

  let isAuthenticated = false;

  // Verify JWT token
  if (token) {
    try {
      await jwtVerify(
        token,
        new TextEncoder().encode(process.env.NEXT_PUBLIC_PROTECTION_TOKEN_SECRET)
      );
      isAuthenticated = true;
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  }

  // Redirect authenticated users from login/register to dashboard
  if (['/login', '/register', '/'].includes(path) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect authenticated routes
  const protectedPaths = ['/dashboard'];
  if (protectedPaths.some((protectedPath) => path.startsWith(protectedPath)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard',
    '/',
  ],
};
