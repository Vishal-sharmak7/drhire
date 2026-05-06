import { NextResponse } from 'next/server';
import { Doctor, Job, connectMongo } from '@/lib/server/backend';
import { getRequestUser } from '@/lib/server/auth';

export async function GET(request: Request) {
  const auth = await getRequestUser(request);
  if (auth.error || !auth.user || !auth.role) {
    return auth.error!;
  }

  try {
    await connectMongo();
    if (auth.role === 'doctor') {
      const doctor = await Doctor.findById(auth.user._id).populate({
        path: 'appliedJobs',
        populate: { path: 'hospitalId', select: 'hospitalName' },
      });
      return NextResponse.json({ applications: doctor?.appliedJobs || [] });
    }

    if (auth.role === 'hospital') {
      const jobs = await Job.find({ hospitalId: auth.user._id }).populate(
        'applicants',
        'name email specialization experience resume'
      );
      return NextResponse.json({ applications: jobs });
    }

    return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
