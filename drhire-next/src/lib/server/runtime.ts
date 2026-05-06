import jwt, { type SignOptions } from 'jsonwebtoken';
import Admin from '@/lib/server/models/Admin';
import Doctor from '@/lib/server/models/Doctor';
import Hospital from '@/lib/server/models/Hospital';

export function getCookieOptions(maxAge = 24 * 60 * 60 * 1000) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
    maxAge,
  };
}

export function signAuthToken(userId: string, role: 'doctor' | 'hospital' | 'admin') {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET!, { expiresIn: '24h' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}

export function signTemporaryToken(payload: object, expiresIn = '15m') {
  const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, process.env.JWT_SECRET!, options);
}

export async function findUserByRole(role: 'doctor' | 'hospital' | 'admin', userId: string) {
  if (role === 'doctor') {
    return Doctor.findById(userId).select('-password');
  }
  if (role === 'hospital') {
    return Hospital.findById(userId).select('-password');
  }
  return Admin.findById(userId).select('-password');
}

export function serializeUser(user: Record<string, unknown>, role: 'doctor' | 'hospital' | 'admin') {
  return {
    _id: user._id,
    email: user.email,
    name: user.name || user.hospitalName || 'Admin',
    hospitalName: user.hospitalName,
    role,
    specialization: user.specialization,
    experience: user.experience,
    licenseNumber: user.licenseNumber,
    skills: user.skills,
    location: user.location,
    description: user.description,
    status: user.status,
    resume: user.resume,
  };
}
