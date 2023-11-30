import { Request, Response } from 'express';

import logger from '../logging/logger';
import AuthService from '../services/auth.service';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async handleGoogleCallback(req: Request, res: Response) {
    const code = req.body?.code;
    if (!code) {
      logger.info(
        'incoming request for google oauth callback did not have a code\n' +
          req.body,
      );
      return res.status(400).json({ error: 'Google access code is missing' });
    }

    try {
      const { accessToken, accessCookieOptions, userData } =
        await this.authService.handleGoogleLogin(code);

      const cookieName = process.env.COOKIE_NAME || 'access_token';
      if (!process.env.COOKIE_NAME) {
        logger.warn(
          'Cookie name is not defined in env, falling back to access_token',
        );
      }
      res.cookie(cookieName, accessToken, accessCookieOptions);
      res.status(200).json({ success: true, userData });
    } catch (error) {
      logger.error('Error was thrown ' + error);
      return res.status(401).json({ error: 'OAuth callback failed' });
    }
  }
}

export const authController = new AuthController();
