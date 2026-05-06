import { NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/server/auth';
import { Hospital, Job, connectMongo } from '@/lib/server/backend';

export async function GET(request: Request) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const specialization = searchParams.get('specialization');
    const location = searchParams.get('location');
    const experience = searchParams.get('experience');

    const query: Record<string, unknown> = {};
    if (keyword) query.title = { $regex: keyword, $options: 'i' };
    if (specialization) query.specialization = { $regex: specialization, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (experience) query.experienceRequired = { $lte: Number(experience) };

    const jobs = await Job.find(query).populate('hospitalId', 'hospitalName location description');
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await getRequestUser(request, 'hospital');
  if (auth.error || !auth.user) {
    return auth.error!;
  }

  try {
    const hospital = await Hospital.findById(auth.user._id);
    if (!hospital || hospital.status !== 'approved') {
      return NextResponse.json({ message: 'Hospital not verified' }, { status: 403 });
    }

    const body = await request.json();
    const job = new Job({
      title: body.title,
      description: body.description,
      specialization: body.specialization,
      experienceRequired: body.experienceRequired,
      salaryRange: body.salaryRange,
      location: body.location,
      hospitalId: hospital._id,
    });

    const createdJob = await job.save();
    hospital.jobsPosted.push(createdJob._id);
    await hospital.save();

    return NextResponse.json(createdJob, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
