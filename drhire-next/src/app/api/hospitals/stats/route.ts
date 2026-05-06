import { NextResponse } from 'next/server';
import { Hospital, Job, connectMongo } from '@/lib/server/backend';
import { getRequestUser } from '@/lib/server/auth';

export async function GET(request: Request) {
  const auth = await getRequestUser(request, 'hospital');
  if (auth.error || !auth.user) {
    return auth.error!;
  }

  try {
    await connectMongo();
    const hospital = await Hospital.findById(auth.user._id).select('-password');
    if (!hospital) {
      return NextResponse.json({ message: 'Hospital not found' }, { status: 404 });
    }

    const jobs = await Job.find({ hospitalId: auth.user._id }).populate(
      'applicants',
      'name email specialization experience resume'
    );

    const activeJobsCount = jobs.length;
    const totalApplicants = jobs.reduce((count, job) => count + (job.applicants?.length || 0), 0);

    return NextResponse.json({
      profile: hospital,
      stats: {
        activeJobsCount,
        totalApplicants,
        profileViews: 124,
      },
      jobs,
    });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
