import { NextResponse } from 'next/server';
import { Doctor, connectMongo } from '@/lib/server/backend';
import { getRequestUser } from '@/lib/server/auth';

export async function GET(request: Request) {
  const auth = await getRequestUser(request, 'admin');
  if (auth.error) {
    return auth.error;
  }

  try {
    await connectMongo();
    const users = await Doctor.find({}).select('-password');
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
