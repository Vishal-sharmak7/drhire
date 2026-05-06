import Doctor from '../models/Doctor.js';
import Hospital from '../models/Hospital.js';
import Admin from '../models/Admin.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

const getFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:3000';
const getApiUrl = () => process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;

const setOAuthStateCookie = (res, value) => {
    res.cookie('oauth_state', value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 10 * 60 * 1000,
    });
};

const setOAuthProfileCookie = (res, profile) => {
    const token = jwt.sign(profile, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.cookie('oauth_profile', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000,
    });
};

const clearOAuthCookies = (res) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };
    res.clearCookie('oauth_state', options);
    res.clearCookie('oauth_profile', options);
};

const getRoleDashboardPath = (role) => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'hospital') return '/hospital/dashboard';
    return '/doctor/dashboard';
};

// @desc    Register a new doctor
// @route   POST /api/auth/register/doctor
// @access  Public
export const registerDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, experience, licenseNumber, skills } = req.body;

        const doctorExists = await Doctor.findOne({ email });
        if (doctorExists) {
            return res.status(400).json({ message: 'Doctor already exists' });
        }

        const doctor = await Doctor.create({
            name,
            email,
            password,
            specialization,
            experience,
            licenseNumber,
            skills: skills || [],
        });

        if (doctor) {
            generateToken(res, doctor._id, 'doctor');
            res.status(201).json({
                _id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                role: 'doctor',
            });
        } else {
            res.status(400).json({ message: 'Invalid doctor data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new hospital
// @route   POST /api/auth/register/hospital
// @access  Public
export const registerHospital = async (req, res) => {
    try {
        const { hospitalName, email, password, location, description } = req.body;

        const hospitalExists = await Hospital.findOne({ email });
        if (hospitalExists) {
            return res.status(400).json({ message: 'Hospital already exists' });
        }

        const hospital = await Hospital.create({
            hospitalName,
            email,
            password,
            location,
            description,
        });

        if (hospital) {
            generateToken(res, hospital._id, 'hospital');
            res.status(201).json({
                _id: hospital._id,
                hospitalName: hospital.hospitalName,
                email: hospital.email,
                role: 'hospital',
            });
        } else {
            res.status(400).json({ message: 'Invalid hospital data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check Admin first
        let user = await Admin.findOne({ email });
        let role = 'admin';

        // If not admin, check Doctor
        if (!user) {
            user = await Doctor.findOne({ email });
            role = 'doctor';
        }

        // If not doctor, check Hospital
        if (!user) {
            user = await Hospital.findOne({ email });
            role = 'hospital';
        }

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(res, user._id, role);
            res.json({
                _id: user._id,
                email: user.email,
                name: user.name || user.hospitalName || 'Admin',
                role,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get current user profile based on cookie
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = req.user;
        if (user) {
            res.json({
                _id: user._id,
                email: user.email,
                name: user.name || user.hospitalName || 'Admin',
                role: req.userRole,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Redirect user to Google OAuth
// @route   GET /api/auth/google
// @access  Public
export const startGoogleOAuth = (req, res) => {
    const role = req.query.role === 'hospital' ? 'hospital' : 'doctor';
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.status(500).json({ message: 'Google OAuth is not configured' });
    }

    const state = `${role}:${crypto.randomBytes(24).toString('hex')}`;
    setOAuthStateCookie(res, state);

    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: `${getApiUrl()}/api/auth/google/callback`,
        response_type: 'code',
        scope: 'openid email profile',
        prompt: 'select_account',
        state,
    });

    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};

// @desc    Handle Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
export const handleGoogleOAuthCallback = async (req, res) => {
    try {
        const { code, state } = req.query;
        const savedState = req.cookies.oauth_state;

        if (!code || !state || !savedState || state !== savedState) {
            return res.redirect(`${getFrontendUrl()}/login?error=oauth_state`);
        }

        const role = String(state).split(':')[0] === 'hospital' ? 'hospital' : 'doctor';

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code: String(code),
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: `${getApiUrl()}/api/auth/google/callback`,
                grant_type: 'authorization_code',
            }),
        });

        if (!tokenResponse.ok) {
            return res.redirect(`${getFrontendUrl()}/login?error=oauth_token`);
        }

        const tokenData = await tokenResponse.json();
        const userResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        if (!userResponse.ok) {
            return res.redirect(`${getFrontendUrl()}/login?error=oauth_profile`);
        }

        const googleProfile = await userResponse.json();
        const email = googleProfile.email?.toLowerCase();
        if (!email) {
            return res.redirect(`${getFrontendUrl()}/login?error=oauth_email`);
        }

        const existingDoctor = await Doctor.findOne({ email });
        const existingHospital = await Hospital.findOne({ email });
        const existingUser = existingDoctor || existingHospital;

        if (existingUser) {
            const existingRole = existingDoctor ? 'doctor' : 'hospital';
            existingUser.authProvider = existingUser.authProvider || 'google';
            existingUser.providerId = existingUser.providerId || googleProfile.sub;
            await existingUser.save();
            clearOAuthCookies(res);
            generateToken(res, existingUser._id, existingRole);
            return res.redirect(`${getFrontendUrl()}${getRoleDashboardPath(existingRole)}`);
        }

        setOAuthProfileCookie(res, {
            role,
            email,
            providerId: googleProfile.sub,
            name: googleProfile.name || email.split('@')[0],
            authProvider: 'google',
        });
        res.clearCookie('oauth_state');
        return res.redirect(`${getFrontendUrl()}/oauth/complete?role=${role}`);
    } catch (error) {
        return res.redirect(`${getFrontendUrl()}/login?error=oauth_failed`);
    }
};

// @desc    Complete role-specific OAuth registration
// @route   POST /api/auth/oauth/complete
// @access  Public
export const completeOAuthRegistration = async (req, res) => {
    try {
        const token = req.cookies.oauth_profile;
        if (!token) {
            return res.status(401).json({ message: 'OAuth registration session expired' });
        }

        const profile = jwt.verify(token, process.env.JWT_SECRET);
        const existingDoctor = await Doctor.findOne({ email: profile.email });
        const existingHospital = await Hospital.findOne({ email: profile.email });
        if (existingDoctor || existingHospital) {
            return res.status(400).json({ message: 'An account already exists for this email' });
        }

        let user;
        if (profile.role === 'hospital') {
            const { hospitalName, location, description } = req.body;
            if (!hospitalName || !location) {
                return res.status(400).json({ message: 'Hospital name and location are required' });
            }
            user = await Hospital.create({
                hospitalName,
                email: profile.email,
                location,
                description,
                authProvider: 'google',
                providerId: profile.providerId,
            });
        } else {
            const { name, specialization, experience, licenseNumber, skills } = req.body;
            if (!specialization || !experience || !licenseNumber) {
                return res.status(400).json({ message: 'Specialization, experience, and license number are required' });
            }
            user = await Doctor.create({
                name: name || profile.name,
                email: profile.email,
                specialization,
                experience,
                licenseNumber,
                skills: skills || [],
                authProvider: 'google',
                providerId: profile.providerId,
            });
        }

        clearOAuthCookies(res);
        generateToken(res, user._id, profile.role);
        res.status(201).json({
            _id: user._id,
            email: user.email,
            name: user.name || user.hospitalName,
            role: profile.role,
        });
    } catch (error) {
        res.status(401).json({ message: 'OAuth registration session expired' });
    }
};
