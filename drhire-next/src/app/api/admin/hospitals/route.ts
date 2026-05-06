import { NextResponse } from 'next/server';
import { Hospital, connectMongo } from '@/lib/server/backend';
import { getRequestUser } from '@/lib/server/auth';

export async function GET(request: Request) {
  const auth = await getRequestUser(request, 'admin');
  if (auth.error) {
    return auth.error;
  }

  try {
    await connectMongo();
    const hospitals = await Hospital.find({}).select('-password');
    return NextResponse.json(hospitals);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
