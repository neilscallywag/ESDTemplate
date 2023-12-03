import { Request, Response } from 'express';

import logger from '../logging/logger';
import AuthService from '../services/auth.service';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
    this.handleGoogleCallback = this.handleGoogleCallback.bind(this);
    this.handleRefreshToken = this.handleRefreshToken.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
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
      const {
        accessToken,
        accessCookieOptions,
        refreshToken,
        refreshCookieOptions,
        identityToken,
        identityCookieOptions,
        user,
      } = await this.authService.handleGoogleLogin(code, req);

      const accessCookieName = process.env.ACCESS_COOKIE_NAME || 'access_token';
      if (!process.env.ACCESS_COOKIE_NAME) {
        logger.warn(
          'Cookie name is not defined in env, falling back to access_token',
        );
      }

      const refreshCookieName =
        process.env.REFRESH_COOKIE_NAME || 'refresh_token';
      if (!process.env.REFRESH_COOKIE_NAME) {
        logger.warn(
          'Cookie name is not defined in env, falling back to refresh_token',
        );
      }

      const identityCookieName =
        process.env.IDENTITY_COOKIE_NAME || 'identity_token';
      if (!process.env.IDENTITY_COOKIE_NAME) {
        logger.warn(
          'Cookie name is not defined in env, falling back to identity_token',
        );
      }

      logger.info('Sending cookies to client');
      res.cookie(accessCookieName, accessToken, accessCookieOptions);
      res.cookie(refreshCookieName, refreshToken, refreshCookieOptions);
      res.cookie(identityCookieName, identityToken, identityCookieOptions);
      res.status(200).json({ success: true, user });
    } catch (error) {
      logger.error('Error was thrown ' + error);
      return res.status(401).json({ error: 'OAuth callback failed' });
    }
  }

  async handleRefreshToken(req: Request, res: Response) {
    const refreshToken: string = req.cookies['refresh_token'];

    if (!refreshToken) {
      logger.info(
        'incoming request for refresh token did not have a refresh token\n' +
          req.body,
      );
      return res.status(400).json({ error: 'Refresh token is missing' });
    }

    try {
      const { accessToken, accessCookieOptions } =
        await this.authService.handleRenewToken(refreshToken);

      const accessCookieName = process.env.ACCESS_COOKIE_NAME || 'access_token';
      if (!process.env.ACCESS_COOKIE_NAME) {
        logger.warn(
          'Cookie name is not defined in env, falling back to access_token',
        );
      }

      logger.info('Sending cookies to client');
      res.cookie(accessCookieName, accessToken, accessCookieOptions);
      res.status(200).json({ success: true, newAccessToken: accessToken });
    } catch (error) {
      logger.error('Error was thrown ' + error);
      return res.status(401).json({ error: 'Refresh token failed' });
    }
  }

  async handleLogout(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    try {
      if (!refreshToken) {
        logger.info(
          'incoming request for refresh token did not have a refresh token\n' +
            req.body,
        );
        return res.status(400).json({ error: 'Refresh token is missing' });
      }

      await this.authService.handleLogout(refreshToken);

      res.clearCookie(process.env.ACCESS_COOKIE_NAME || 'access_token', {
        path: '/',
        expires: new Date(1),
      });
      res.clearCookie(process.env.REFRESH_COOKIE_NAME || 'refresh_token', {
        path: '/',
        expires: new Date(1),
      });
      res.clearCookie(process.env.IDENTITY_COOKIE_NAME || 'identity_token', {
        path: '/',
        expires: new Date(1),
      });

      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      logger.error('Error was thrown ' + error);
      return res.status(401).json({ error: 'Logout unsuccessful' });
    }
  }
}

export const authController = new AuthController();
