import { NextResponse } from 'next/server';
import { Hospital, connectMongo, serializeUser, signAuthToken } from '@/lib/server/backend';
import { getResponseCookieOptions } from '@/lib/server/auth';

export async function POST(request: Request) {
  try {
    await connectMongo();
    const body = await request.json();
    const email = String(body.email).toLowerCase();

    const hospitalExists = await Hospital.findOne({ email });
    if (hospitalExists) {
      return NextResponse.json({ message: 'Hospital already exists' }, { status: 400 });
    }

    const hospital = await Hospital.create({
      hospitalName: body.hospitalName,
      email,
      password: body.password,
      location: body.location,
      description: body.description,
      authProvider: 'credentials',
    });

    const response = NextResponse.json(serializeUser(hospital, 'hospital'), { status: 201 });
    response.cookies.set('jwt', signAuthToken(hospital._id.toString(), 'hospital'), getResponseCookieOptions());
    return response;
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
