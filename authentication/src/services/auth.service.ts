import { OAuth2Client } from 'google-auth-library';

import logger from '../logging/logger';
import JWTHandler from '../middlewares/JWT/jwtMiddleware';
import { TokenType } from '../middlewares/JWT/interfaces';
import { GoogleUserInfo } from '../types';

import { GoogleAPIService } from './googleapi.service';
import RedisService from './redis.service';

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

      const userId = userData.sub; // google user id

      const { token: accessToken, cookieOptions: accessCookieOptions } = 
        this.jwtHandler.createToken(userId, TokenType.Access);

      const { token: refreshToken, cookieOptions: refreshCookieOptions } = 
        this.jwtHandler.createToken(userId, TokenType.Refresh);

      const { token: identityToken, cookieOptions: identityCookieOptions } = 
        this.jwtHandler.createToken(userId, TokenType.Identity, { name: userData.name, given_name: userData.given_name, family_name: userData.family_name });

      await this.redisService.set(`refreshToken:${userId}`, refreshToken);

      return {
        accessToken,
        accessCookieOptions,
        refreshToken,
        refreshCookieOptions,
        identityToken,
        identityCookieOptions,
        userData,
      };
    } else {
      throw new Error('Google Oauth2 Access token is undefined.');
    }
  }
}

export default AuthService;
