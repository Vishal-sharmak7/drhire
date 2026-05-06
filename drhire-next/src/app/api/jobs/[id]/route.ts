import { NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/server/auth';
import { Hospital, Job, connectMongo } from '@/lib/server/backend';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectMongo();
    const { id } = await context.params;
    const job = await Job.findById(id).populate('hospitalId', 'hospitalName location description');

    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await getRequestUser(request, 'hospital');
  if (auth.error || !auth.user) {
    return auth.error!;
  }

  try {
    const { id } = await context.params;
    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    if (job.hospitalId.toString() !== auth.user._id.toString()) {
      return NextResponse.json({ message: 'Not authorized to update this job' }, { status: 403 });
    }

    const body = await request.json();
    job.title = body.title || job.title;
    job.description = body.description || job.description;
    job.specialization = body.specialization || job.specialization;
    job.experienceRequired = body.experienceRequired || job.experienceRequired;
    job.salaryRange = body.salaryRange || job.salaryRange;
    job.location = body.location || job.location;

    await job.save();
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await getRequestUser(request, 'hospital');
  if (auth.error || !auth.user) {
    return auth.error!;
  }

  try {
    const { id } = await context.params;
    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    if (job.hospitalId.toString() !== auth.user._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await job.deleteOne();

    const hospital = await Hospital.findById(auth.user._id);
    if (hospital) {
      hospital.jobsPosted = hospital.jobsPosted.filter((jobId: { toString(): string }) => jobId.toString() !== id);
      await hospital.save();
    }

    return NextResponse.json({ message: 'Job deleted' });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
