import { randomBytes } from 'crypto';
import { config } from 'dotenv'; // Import dotenv config function
import { CookieOptions } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

import logger from '../logging/logger';

config(); // Load environment variables from .env

class JWTHandler {
  private secretKey: Secret;
  private accessExp: string;
  private cookieOptions: CookieOptions;

  constructor() {
    const secret =
      process.env.JWT_SECRET_KEY || (randomBytes(64).toString('hex') as Secret);

    if (!process.env.JWT_SECRET_KEY) {
      logger.warn(
        (('JWT secret key is not defined, ' + secret) as string) +
          ' will be used instead',
      );
    }
    this.secretKey = secret;
    this.accessExp = '1d';
    this.cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };
  }

  public createAccessToken(userId: string, role: string) {
    const accessToken = jwt.sign({ userId, role }, this.secretKey, {
      expiresIn: this.accessExp,
    });
    return { accessToken, accessCookieOptions: this.cookieOptions };
  }
}

export default JWTHandler;
