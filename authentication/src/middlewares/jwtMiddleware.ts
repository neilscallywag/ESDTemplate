import { randomBytes } from 'crypto';
import { config } from 'dotenv';
import { CookieOptions } from 'express';
import { Secret } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';

import {
  accessCookieOptions,
  refreshCookieOptions,
} from '../config/cookieOptions';
import logger from '../logging/logger';

config();

class JWTHandler {
  private secretKey: Secret;
  private accessExp: string;
  private refreshExp: string;
  private accessCookieOptions: CookieOptions;
  private refreshCookieOptions: CookieOptions;

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
    this.accessExp = '10min';
    this.refreshExp = '7d';

    // this should really be in its own config file
    // TODO: make this configurable
    this.accessCookieOptions = accessCookieOptions;

    this.refreshCookieOptions = refreshCookieOptions;
  }

  public createAccessToken(userId: string, role: string) {
    try {
      const accessToken = jwt.sign({ userId, role }, this.secretKey, {
        expiresIn: this.accessExp,
      });
      return { accessToken, accessCookieOptions: this.accessCookieOptions };
    } catch (error) {
      throw new Error(String(error));
    }
  }

  public createRefreshToken(userId: string) {
    try {
      const refreshToken = jwt.sign({ userId }, this.secretKey, {
        expiresIn: this.refreshExp,
      });
      return { refreshToken, refreshCookieOptions: this.refreshCookieOptions };
    } catch (error) {
      throw new Error(String(error));
    }
  }
}

export default JWTHandler;
