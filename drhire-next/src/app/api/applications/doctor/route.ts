import { NextResponse } from 'next/server';
import { Doctor, connectMongo } from '@/lib/server/backend';
import { getRequestUser } from '@/lib/server/auth';

export async function GET(request: Request) {
  const auth = await getRequestUser(request, 'doctor');
  if (auth.error || !auth.user) {
    return auth.error!;
  }

  try {
    await connectMongo();
    const doctor = await Doctor.findById(auth.user._id).populate({
      path: 'appliedJobs',
      populate: { path: 'hospitalId', select: 'hospitalName location description' },
    });

    if (!doctor) {
      return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
    }

    const validJobs = doctor.appliedJobs.filter((job: unknown) => job != null) as unknown as Array<Record<string, unknown>>;
    const applications = validJobs.map((job) => ({
      _id: `${String(job._id)}_app`,
      jobId: job,
      status: 'Pending',
      createdAt: job.createdAt || new Date(),
    }));

    return NextResponse.json({ applications });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
