import { NextResponse } from 'next/server';
import { Doctor, Hospital, Job, connectMongo } from '@/lib/server/backend';
import { getRequestUser } from '@/lib/server/auth';

export async function GET(request: Request) {
  const auth = await getRequestUser(request, 'admin');
  if (auth.error) {
    return auth.error;
  }

  try {
    await connectMongo();
    const doctors = await Doctor.countDocuments();
    const hospitals = await Hospital.countDocuments();
    const pendingHospitals = await Hospital.countDocuments({ status: 'pending' });
    const jobs = await Job.countDocuments();

    return NextResponse.json({ doctors, hospitals, pendingHospitals, jobs });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
