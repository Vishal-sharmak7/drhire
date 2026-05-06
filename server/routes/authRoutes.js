import express from 'express';
import {
    registerDoctor,
    registerHospital,
    loginUser,
    logoutUser,
    getMe,
    startGoogleOAuth,
    handleGoogleOAuthCallback,
    completeOAuthRegistration,
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register/doctor', registerDoctor);
router.post('/register/hospital', registerHospital);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/google', startGoogleOAuth);
router.get('/google/callback', handleGoogleOAuthCallback);
router.post('/oauth/complete', completeOAuthRegistration);
router.get('/me', verifyToken, getMe);

export default router;
