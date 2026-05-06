import { NextResponse } from 'next/server';
import { Job, connectMongo } from '@/lib/server/backend';
import { getRequestUser } from '@/lib/server/auth';

export async function GET(request: Request) {
  const auth = await getRequestUser(request, 'admin');
  if (auth.error) {
    return auth.error;
  }

  try {
    await connectMongo();
    const jobs = await Job.find({}).populate('hospitalId', 'hospitalName location');
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
