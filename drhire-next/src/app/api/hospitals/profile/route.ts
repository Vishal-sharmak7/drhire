import { NextResponse } from 'next/server';
import { Hospital, connectMongo } from '@/lib/server/backend';
import { getRequestUser } from '@/lib/server/auth';

export async function GET(request: Request) {
  const auth = await getRequestUser(request, 'hospital');
  if (auth.error || !auth.user) {
    return auth.error!;
  }

  try {
    await connectMongo();
    const hospital = await Hospital.findById(auth.user._id).populate('jobsPosted').select('-password');
    if (!hospital) {
      return NextResponse.json({ message: 'Hospital not found' }, { status: 404 });
    }

    return NextResponse.json(hospital);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
