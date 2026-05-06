import { NextResponse } from 'next/server';
import { clearAuthCookies, getResponseCookieOptions } from '@/lib/server/auth';
import {
  Doctor,
  Hospital,
  connectMongo,
  signAuthToken,
  verifyToken,
} from '@/lib/server/backend';

type OAuthUser = {
  _id: { toString(): string };
  email: string;
  name?: string;
  hospitalName?: string;
};

export async function POST(request: Request) {
  try {
    await connectMongo();
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/(?:^|;\s*)oauth_profile=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    if (!token) {
      return NextResponse.json({ message: 'OAuth registration session expired' }, { status: 401 });
    }

    const profile = verifyToken(token) as {
      role: 'doctor' | 'hospital';
      email: string;
      providerId: string;
      name: string;
    };
    const body = await request.json();

    let user: OAuthUser;
    if (profile.role === 'hospital') {
      if (!body.hospitalName || !body.location) {
        return NextResponse.json({ message: 'Hospital name and location are required' }, { status: 400 });
      }
      user = await Hospital.create({
        hospitalName: body.hospitalName,
        email: profile.email,
        location: body.location,
        description: body.description,
        authProvider: 'google',
        providerId: profile.providerId,
      });
    } else {
      if (!body.specialization || !body.experience || !body.licenseNumber) {
        return NextResponse.json(
          { message: 'Specialization, experience, and license number are required' },
          { status: 400 }
        );
      }
      user = await Doctor.create({
        name: body.name || profile.name,
        email: profile.email,
        specialization: body.specialization,
        experience: Number(body.experience),
        licenseNumber: body.licenseNumber,
        authProvider: 'google',
        providerId: profile.providerId,
      });
    }

    const response = NextResponse.json({
      _id: user._id,
      email: user.email,
      name: user.name || user.hospitalName,
      role: profile.role,
    });
    clearAuthCookies(response);
    response.cookies.set('jwt', signAuthToken(user._id.toString(), profile.role), getResponseCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ message: 'OAuth registration session expired' }, { status: 401 });
  }
}
