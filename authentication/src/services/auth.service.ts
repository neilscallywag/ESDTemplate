import { OAuth2Client } from 'google-auth-library';

import JWTHandler from '../middlewares/jwtMiddleware';
import { GoogleUserInfo } from '../types';

import { GoogleAPIService } from './googleapi.service';
import RedisService from './redis.service';

import logger from '../logging/logger';

class AuthService {
  private jwtHandler: JWTHandler;
  // in the most technical of sense this should not take in a specific service but
  // should follow a dependency injection pattern where any service can be injected with its methods
  // available and the same. IDK need to discuss this w @zt.yue
  private googleAPIService: GoogleAPIService;
  private redisService: RedisService;

  constructor() {
    this.jwtHandler = new JWTHandler();
    this.googleAPIService = new GoogleAPIService();
    this.redisService = new RedisService();
  }

  async handleGoogleLogin(code: string) {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      logger.error('Google Client ID or Client Secret is not defined in .env');
    }

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

      const { accessToken, accessCookieOptions } =
        this.jwtHandler.createAccessToken(userData.sub, 'role');

      const { refreshToken, refreshCookieOptions} =
        this.jwtHandler.createRefreshToken(userData.sub);

      // await this.redisService.set('userID', accessToken);

      return { accessToken, accessCookieOptions, refreshToken, refreshCookieOptions, userData };
    } else {
      throw new Error('Google Oauth2 Access token is undefined.');
    }
  }
}

export default AuthService;
