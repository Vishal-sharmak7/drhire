import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type UserRole = 'doctor' | 'hospital' | 'admin';

const protectedPaths: Record<string, string[]> = {
  doctor: ['/doctor/dashboard', '/doctor/edit-profile'],
  hospital: ['/hospital/dashboard', '/hospital/edit-profile'],
  admin: ['/admin/dashboard'],
};

const publicAuthPaths = ['/login', '/register'];

function decodeJwtRole(token: string): UserRole | null {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized));
    return decoded.role || null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('jwt')?.value;

  const allProtectedPaths = Object.values(protectedPaths).flat();
  const isProtectedRoute = allProtectedPaths.some((path) => pathname.startsWith(path));
  const isAuthPage = publicAuthPaths.some((path) => pathname === path);

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    const role = decodeJwtRole(token);
    if (role) {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/doctor/:path*', '/hospital/:path*', '/admin/:path*', '/login', '/register'],
};
