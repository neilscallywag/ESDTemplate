import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

import logger from '../logging/logger';
import JWTHandler from '../middlewares/jwtMiddleware';
import { GoogleAPIService } from '../services/googleapi.service';
import { GoogleUserInfo } from '../types';

class AuthService {
  private jwtHandler: JWTHandler;
  private googleAPIService: GoogleAPIService;

  constructor() {
    this.jwtHandler = new JWTHandler();
    this.googleAPIService = new GoogleAPIService();
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
      const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'postmessage',
      );

      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      const userAuth = oAuth2Client.credentials;

      if (userAuth.access_token) {
        try {
          const userData: GoogleUserInfo =
            await this.googleAPIService.getUserData(userAuth.access_token);
          // TODO: Implement user retrieval and/or creation in the database
          const { accessToken, accessCookieOptions } =
            this.jwtHandler.createAccessToken('userid', 'role');
          // TODO: Implement user session storage in Redis or another store
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
      } else {
        logger.error('Google Oauth2 Access token is undefined.');
        return res.status(401).json({ error: 'OAuth callback failed' });
      }
    } catch (error) {
      logger.error(error);
      res.status(401).json({ error: 'OAuth callback failed' });
    }
  }
}

export const authController = new AuthService();
