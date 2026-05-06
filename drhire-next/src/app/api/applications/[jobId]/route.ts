import { NextResponse } from 'next/server';
import { Doctor, Job, connectMongo } from '@/lib/server/backend';
import { getRequestUser } from '@/lib/server/auth';

export async function POST(request: Request, context: { params: Promise<{ jobId: string }> }) {
  const auth = await getRequestUser(request, 'doctor');
  if (auth.error || !auth.user) {
    return auth.error!;
  }

  try {
    await connectMongo();
    const { jobId } = await context.params;
    const job = await Job.findById(jobId);
    const doctor = await Doctor.findById(auth.user._id);

    if (!job || !doctor) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (job.applicants.some((applicantId: { toString(): string }) => applicantId.toString() === doctor._id.toString())) {
      return NextResponse.json({ message: 'Already applied' }, { status: 400 });
    }

    job.applicants.push(doctor._id);
    doctor.appliedJobs.push(job._id);

    await job.save();
    await doctor.save();

    return NextResponse.json({ message: 'Applied successfully' });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
