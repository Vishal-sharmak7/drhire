import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';
import Hospital from '../models/Hospital.js';
import Admin from '../models/Admin.js';

export function getCookieOptions(maxAge = 24 * 60 * 60 * 1000) {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge,
    };
}

export function signAuthToken(userId, role) {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });
}

export function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export function signTemporaryToken(payload, expiresIn = '15m') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

export async function findUserByRole(role, userId) {
    if (role === 'doctor') {
        return Doctor.findById(userId).select('-password');
    }
    if (role === 'hospital') {
        return Hospital.findById(userId).select('-password');
    }
    if (role === 'admin') {
        return Admin.findById(userId).select('-password');
    }
    return null;
}

export function serializeUser(user, role) {
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
