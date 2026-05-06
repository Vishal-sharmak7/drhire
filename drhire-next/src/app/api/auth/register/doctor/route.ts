import { NextResponse } from 'next/server';
import { Doctor, connectMongo, serializeUser, signAuthToken } from '@/lib/server/backend';
import { getResponseCookieOptions } from '@/lib/server/auth';

export async function POST(request: Request) {
  try {
    await connectMongo();
    const body = await request.json();
    const email = String(body.email).toLowerCase();

    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) {
      return NextResponse.json({ message: 'Doctor already exists' }, { status: 400 });
    }

    const doctor = await Doctor.create({
      name: body.name,
      email,
      password: body.password,
      specialization: body.specialization,
      experience: body.experience,
      licenseNumber: body.licenseNumber,
      skills: body.skills || [],
      authProvider: 'credentials',
    });

    const response = NextResponse.json(serializeUser(doctor, 'doctor'), { status: 201 });
    response.cookies.set('jwt', signAuthToken(doctor._id.toString(), 'doctor'), getResponseCookieOptions());
    return response;
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
