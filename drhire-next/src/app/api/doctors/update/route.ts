import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { Doctor, connectMongo } from '@/lib/server/backend';
import { getRequestUser } from '@/lib/server/auth';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

async function saveResume(file: File) {
  const extension = path.extname(file.name) || '.pdf';
  const filename = `resume-${Date.now()}${extension}`;
  const filePath = path.join(uploadsDir, filename);
  await fs.mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

export async function PUT(request: Request) {
  const auth = await getRequestUser(request, 'doctor');
  if (auth.error || !auth.user) {
    return auth.error!;
  }

  try {
    await connectMongo();
    const doctor = await Doctor.findById(auth.user._id);
    if (!doctor) {
      return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const resume = formData.get('resume');
      if (resume instanceof File) {
        doctor.resume = await saveResume(resume);
      }
    } else {
      const body = await request.json();
      doctor.name = body.name || doctor.name;
      doctor.specialization = body.specialization || doctor.specialization;
      doctor.experience = body.experience || doctor.experience;
      doctor.licenseNumber = body.licenseNumber || doctor.licenseNumber;
      doctor.email = body.email || doctor.email;
      if (body.skills) {
        doctor.skills = String(body.skills)
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean);
      }
    }

    const updatedDoctor = await doctor.save();
    return NextResponse.json({
      _id: updatedDoctor._id,
      name: updatedDoctor.name,
      email: updatedDoctor.email,
      specialization: updatedDoctor.specialization,
      experience: updatedDoctor.experience,
      licenseNumber: updatedDoctor.licenseNumber,
      resume: updatedDoctor.resume,
      skills: updatedDoctor.skills,
    });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
