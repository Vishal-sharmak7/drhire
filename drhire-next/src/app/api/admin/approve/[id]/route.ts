import { NextResponse } from 'next/server';
import { Hospital, connectMongo } from '@/lib/server/backend';
import { getRequestUser } from '@/lib/server/auth';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await getRequestUser(request, 'admin');
  if (auth.error) {
    return auth.error;
  }

  try {
    await connectMongo();
    const { id } = await context.params;
    const updatedHospital = await Hospital.findByIdAndUpdate(id, { status: 'approved' }, { new: true });

    if (!updatedHospital) {
      return NextResponse.json({ message: 'Hospital not found' }, { status: 404 });
    }

    return NextResponse.json(updatedHospital);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
