import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/server/auth';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  clearAuthCookies(response);
  return response;
}
