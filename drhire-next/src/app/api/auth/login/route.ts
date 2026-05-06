import { NextResponse } from 'next/server';
import { Admin, Doctor, Hospital, serializeUser, signAuthToken } from '@/lib/server/backend';
import { connectMongo } from '@/lib/server/backend';
import { getResponseCookieOptions } from '@/lib/server/auth';

type LoginUser = {
  _id: { toString(): string };
  email: string;
  name?: string;
  hospitalName?: string;
  specialization?: string;
  experience?: number;
  licenseNumber?: string;
  skills?: string[];
  location?: string;
  description?: string;
  status?: string;
  resume?: string;
  matchPassword(password: string): Promise<boolean>;
};

export async function POST(request: Request) {
  try {
    await connectMongo();
    const { email, password } = await request.json();
    const normalizedEmail = String(email).toLowerCase();

    let user = (await Admin.findOne({ email: normalizedEmail })) as LoginUser | null;
    let role: 'admin' | 'doctor' | 'hospital' = 'admin';

    if (!user) {
      user = (await Doctor.findOne({ email: normalizedEmail })) as LoginUser | null;
      role = 'doctor';
    }

    if (!user) {
      user = (await Hospital.findOne({ email: normalizedEmail })) as LoginUser | null;
      role = 'hospital';
    }

    if (!user || !(await user.matchPassword(password))) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const response = NextResponse.json(serializeUser(user, role));
    response.cookies.set('jwt', signAuthToken(user._id.toString(), role), getResponseCookieOptions());
    return response;
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
