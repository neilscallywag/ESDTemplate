import { Request } from 'express';
import * as expressUseragent from 'express-useragent';
import { OAuth2Client } from 'google-auth-library';

import logger from '../logging/logger';
import { TokenType } from '../middlewares/JWT/interfaces';
import JWTHandler from '../middlewares/JWT/jwtMiddleware';
import { GoogleUserInfo, Role } from '../types';

import { GoogleAPIService } from './googleapi.service';
import RedisService from './redis.service';
import { DatabaseService } from './typeorm.service';
import { UserService } from './user.service';

class AuthService {
  private jwtHandler: JWTHandler;
  // in the most technical of sense this should not take in a specific service but
  // should follow a dependency injection pattern where any service can be injected with its methods
  // available and the same. IDK need to discuss this w @zt.yue
  private googleAPIService: GoogleAPIService;
  private redisService: RedisService;
  private userService: UserService;

  constructor() {
    this.jwtHandler = new JWTHandler();
    this.googleAPIService = new GoogleAPIService();
    this.redisService = new RedisService();
    this.userService = new UserService(DatabaseService);
  }

  private validateEnvironmentVariables() {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      logger.error('Google Client ID or Client Secret is not defined in .env');
      throw new Error('Missing environment variables for Google Client.');
    }
  }

  private async renewAccessToken(refreshToken: string) {
    const decoded = this.jwtHandler.verifyToken(refreshToken);
    const userId = await this.redisService.get(`refreshToken:${refreshToken}`);

    if (!userId || decoded.userId != userId) {
      throw new Error('Refresh token is invalid');
    }

    return this.jwtHandler.createToken(
      decoded.userId,
      decoded.uniqueId,
      TokenType.Access,
    );
  }

  private createUserDeviceParam(req: Request, useragent) {
    return {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      deviceType: useragent.isDesktop
        ? 'Desktop'
        : useragent.isMobile
          ? 'Mobile'
          : useragent.isTablet
            ? 'Tablet'
            : 'Unknown',
    };
  }

  async handleGoogleLogin(code: string, req: Request) {
    this.validateEnvironmentVariables();

    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage',
    );

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    const userAuth = oAuth2Client.credentials;

    if (userAuth.access_token) {
      const userData: GoogleUserInfo = await this.googleAPIService.getUserData(
        userAuth.access_token,
      );

      const useragent = expressUseragent.parse(req.headers['user-agent']);

      const userParam = {
        name: userData.name,
        email: userData.email,
        googleRefreshToken: userAuth.refresh_token,
      };

      const userDeviceParam = this.createUserDeviceParam(req, useragent);

      const userLocationParam = {
        geolocation: '',
      };

      const userRoleParam: Role = Role.USER;

      try {
        const user = await this.userService.createUser(
          userParam,
          userDeviceParam,
          userLocationParam,
          userRoleParam,
        );
        logger.info(`User ${user.id} created.`);

        const {
          token: refreshToken,
          cookieOptions: refreshCookieOptions,
          uniqueId: uniqueId,
        } = this.jwtHandler.createToken(
          user.id,
          JWTHandler.generateUniqueIdentifier(),
          TokenType.Refresh,
        );

        const { token: accessToken, cookieOptions: accessCookieOptions } =
          this.jwtHandler.createToken(user.id, uniqueId, TokenType.Access);

        const { token: identityToken, cookieOptions: identityCookieOptions } =
          this.jwtHandler.createToken(user.id, uniqueId, TokenType.Identity, {
            name: userData.name,
            userRole: userRoleParam,
            given_name: userData.given_name,
            family_name: userData.family_name,
            email: userData.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            deviceType: useragent.isDesktop
              ? 'Desktop'
              : useragent.isMobile
                ? 'Mobile'
                : useragent.isTablet
                  ? 'Tablet'
                  : 'Unknown',
            geolocation: '',
          });

        await this.redisService.set(`refreshToken:${refreshToken}`, user.id);

        return {
          accessToken,
          accessCookieOptions,
          refreshToken,
          refreshCookieOptions,
          identityToken,
          identityCookieOptions,
          user,
        };
      } catch (error) {
        logger.error(`Error authenticating user: ${error.message}`);
        throw new Error(`Error authenticating user: ${error.message}`);
      }
    } else {
      throw new Error('Google Oauth2 Access token is undefined.');
    }
  }

  async handleRenewToken(refreshToken: string) {
    return await this.renewAccessToken(refreshToken);
  }

  async handleLogout(refreshToken: string) {
    try {
      const result = await this.redisService.remove(
        `refreshToken:${refreshToken}`,
      );
      if (result === 0) {
        throw new Error('Refresh token is invalid');
      }
    } catch (error) {
      throw new Error(String(error));
    }
  }
}

export default AuthService;
