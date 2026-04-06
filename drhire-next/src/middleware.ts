import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected paths grouped by role
const protectedPaths: Record<string, string[]> = {
  doctor: ['/doctor/dashboard', '/doctor/edit-profile'],
  hospital: ['/hospital/dashboard', '/hospital/edit-profile'],
  admin: ['/admin/dashboard'],
};

const publicAuthPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Check if trying to access protected routes
  const allProtectedPaths = Object.values(protectedPaths).flat();
  const isProtectedRoute = allProtectedPaths.some((path) => pathname.startsWith(path));

  // Check if trying to access auth pages while logged in
  const isAuthPage = publicAuthPaths.some((path) => pathname === path);

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isAuthPage && token) {
    // We can't decode JWT in middleware without a library, so redirect to a generic dashboard
    // The client-side will handle role-based redirect
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/doctor/:path*',
    '/hospital/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};