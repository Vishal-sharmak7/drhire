import { NextResponse } from 'next/server';
import { Hospital, connectMongo } from '@/lib/server/backend';
import { getRequestUser } from '@/lib/server/auth';

export async function PUT(request: Request) {
  const auth = await getRequestUser(request, 'hospital');
  if (auth.error || !auth.user) {
    return auth.error!;
  }

  try {
    await connectMongo();
    const hospital = await Hospital.findById(auth.user._id);
    if (!hospital) {
      return NextResponse.json({ message: 'Hospital not found' }, { status: 404 });
    }

    const body = await request.json();
    hospital.hospitalName = body.hospitalName || hospital.hospitalName;
    hospital.location = body.location || hospital.location;
    hospital.description = body.description || hospital.description;
    hospital.email = body.email || hospital.email;

    const updatedHospital = await hospital.save();
    return NextResponse.json({
      _id: updatedHospital._id,
      hospitalName: updatedHospital.hospitalName,
      email: updatedHospital.email,
      location: updatedHospital.location,
      description: updatedHospital.description,
      status: updatedHospital.status,
    });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
