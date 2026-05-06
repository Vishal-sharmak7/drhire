import { NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/server/auth';
import { serializeUser } from '@/lib/server/backend';

export async function GET(request: Request) {
  const auth = await getRequestUser(request);
  if (auth.error || !auth.user || !auth.role) {
    return auth.error!;
  }

  return NextResponse.json(serializeUser(auth.user, auth.role));
}
