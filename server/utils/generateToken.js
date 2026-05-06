import jwt from 'jsonwebtoken';

const generateToken = (res, userId, role) => {
    const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return token;
};

export default generateToken;
