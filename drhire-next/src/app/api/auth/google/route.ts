import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { getAppUrl, getResponseCookieOptions } from '@/lib/server/auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const role = url.searchParams.get('role') === 'hospital' ? 'hospital' : 'doctor';

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json({ message: 'Google OAuth is not configured' }, { status: 500 });
  }

  const state = `${role}:${crypto.randomBytes(24).toString('hex')}`;
  const callbackUrl = `${getAppUrl()}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
    state,
  });

  const response = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  response.cookies.set('oauth_state', state, getResponseCookieOptions(10 * 60 * 1000));
  return response;
}
