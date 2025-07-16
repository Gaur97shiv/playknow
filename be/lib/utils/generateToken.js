import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // <-- Fix for localhost!
        sameSite: 'None',
        path: '/',
    });
};
