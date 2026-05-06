import { NextResponse } from 'next/server';
import { clearAuthCookies, getAppUrl, getResponseCookieOptions } from '@/lib/server/auth';
import {
  Doctor,
  Hospital,
  connectMongo,
  signAuthToken,
  signTemporaryToken,
} from '@/lib/server/backend';

export async function GET(request: Request) {
  try {
    await connectMongo();
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const cookieHeader = request.headers.get('cookie') || '';
    const stateMatch = cookieHeader.match(/(?:^|;\s*)oauth_state=([^;]+)/);
    const savedState = stateMatch ? decodeURIComponent(stateMatch[1]) : null;

    if (!code || !state || !savedState || state !== savedState) {
      return NextResponse.redirect(`${getAppUrl()}/login?error=oauth_state`);
    }

    const role = state.split(':')[0] === 'hospital' ? 'hospital' : 'doctor';
    const callbackUrl = `${getAppUrl()}/api/auth/google/callback`;

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      return NextResponse.redirect(`${getAppUrl()}/login?error=oauth_token`);
    }

    const tokenData = await tokenResponse.json();
    const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!profileResponse.ok) {
      return NextResponse.redirect(`${getAppUrl()}/login?error=oauth_profile`);
    }

    const profile = await profileResponse.json();
    const email = profile.email?.toLowerCase();
    if (!email) {
      return NextResponse.redirect(`${getAppUrl()}/login?error=oauth_email`);
    }

    const existingDoctor = await Doctor.findOne({ email });
    const existingHospital = await Hospital.findOne({ email });
    const existingUser = existingDoctor || existingHospital;

    if (existingUser) {
      const existingRole = existingDoctor ? 'doctor' : 'hospital';
      existingUser.authProvider = existingUser.authProvider || 'google';
      existingUser.providerId = existingUser.providerId || profile.sub;
      await existingUser.save();

      const response = NextResponse.redirect(`${getAppUrl()}/${existingRole}/dashboard`);
      clearAuthCookies(response);
      response.cookies.set('jwt', signAuthToken(existingUser._id.toString(), existingRole), getResponseCookieOptions());
      return response;
    }

    const response = NextResponse.redirect(`${getAppUrl()}/oauth/complete?role=${role}`);
    response.cookies.set(
      'oauth_profile',
      signTemporaryToken({
        role,
        email,
        providerId: profile.sub,
        name: profile.name || email.split('@')[0],
        authProvider: 'google',
      }),
      getResponseCookieOptions(15 * 60 * 1000)
    );
    response.cookies.set('oauth_state', '', { ...getResponseCookieOptions(0), expires: new Date(0) });
    return response;
  } catch {
    return NextResponse.redirect(`${getAppUrl()}/login?error=oauth_failed`);
  }
}
