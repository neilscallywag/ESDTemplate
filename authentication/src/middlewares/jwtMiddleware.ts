import jwt, { Secret } from 'jsonwebtoken';
import { CookieOptions } from 'express';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const accessExp = '1d';

export function createAccessToken(userId: String, role: String) {
    if (!JWT_SECRET_KEY) {
        throw new Error('JWT secret key is not defined');
    }

    // you can change token content however you like
    const accessToken = jwt.sign({userId: userId, role: role}, JWT_SECRET_KEY as Secret, { expiresIn: accessExp });
    const accessCookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, 
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };

    return { accessToken, accessCookieOptions };
}