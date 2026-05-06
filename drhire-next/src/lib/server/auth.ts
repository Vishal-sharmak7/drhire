import { NextResponse } from 'next/server';
import { connectMongo, findUserByRole, getCookieOptions, verifyToken } from '@/lib/server/backend';

export function getAppUrl() {
  return process.env.APP_URL || 'http://localhost:3000';
}

export function getResponseCookieOptions(maxAge = 24 * 60 * 60 * 1000) {
  return getCookieOptions(maxAge) as {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax' | 'none';
    path: string;
    maxAge: number;
  };
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set('jwt', '', {
    ...getResponseCookieOptions(0),
    expires: new Date(0),
  });
  response.cookies.set('oauth_state', '', {
    ...getResponseCookieOptions(0),
    expires: new Date(0),
  });
  response.cookies.set('oauth_profile', '', {
    ...getResponseCookieOptions(0),
    expires: new Date(0),
  });
}

export async function getRequestUser(request: Request, requiredRole?: 'doctor' | 'hospital' | 'admin') {
  await connectMongo();
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/(?:^|;\s*)jwt=([^;]+)/);
  const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

  if (!token) {
    return { error: NextResponse.json({ message: 'Not authorized, no token' }, { status: 401 }) };
  }

  try {
    const payload = verifyToken(token) as { id: string; role: 'doctor' | 'hospital' | 'admin' };
    if (requiredRole && payload.role !== requiredRole) {
      return {
        error: NextResponse.json({ message: `Not authorized as a ${requiredRole}` }, { status: 403 }),
      };
    }

    const user = await findUserByRole(payload.role, payload.id);
    if (!user) {
      return { error: NextResponse.json({ message: 'User not found' }, { status: 401 }) };
    }

    return { user, role: payload.role };
  } catch {
    return { error: NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 }) };
  }
}
