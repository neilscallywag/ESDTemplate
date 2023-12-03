import { randomBytes } from 'crypto';
import { config } from 'dotenv';
import { CookieOptions } from 'express';
import { Secret } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';

import {
  accessCookieOptions,
  identityCookieOptions,
  refreshCookieOptions,
} from '../../config/cookieOptions';
import logger from '../../logging/logger';

import {
  AccessClaims,
  IdentityClaims,
  RefreshClaims,
  TokenPayload,
  TokenType,
} from './interfaces';

config();

// refer to https://www.iana.org/assignments/jwt/jwt.xhtml for comprehensive list of claims

class JWTHandler {
  readonly secretKey: Secret;
  readonly accessExp: string = '10min';
  readonly refreshExp: string = '7d';
  readonly identityExp: string = '7d';

  constructor() {
    this.secretKey =
      process.env.JWT_SECRET_KEY ||
      (JWTHandler.generateUniqueIdentifier() as Secret);
    if (!process.env.JWT_SECRET_KEY) {
      logger.warn(
        `JWT secret key is not defined, a generated key will be used instead`,
      );
    }
  }

  public createToken(
    userId: string,
    uniqueId: string,
    type: TokenType,
    claims?: AccessClaims | IdentityClaims | RefreshClaims,
  ) {
    try {
      let expiration: string;
      let cookieOptions: CookieOptions;
      let payload: TokenPayload;

      switch (type) {
        case TokenType.Refresh:
          expiration = this.refreshExp;
          cookieOptions = refreshCookieOptions;
          payload = {
            userId: userId,
            uniqueId: uniqueId,
            ...(claims as RefreshClaims),
          };
          break;
        case TokenType.Access:
          expiration = this.accessExp;
          cookieOptions = accessCookieOptions;
          payload = {
            userId: userId,
            uniqueId: uniqueId,
            ...(claims as AccessClaims),
          };
          break;
        case TokenType.Identity:
          expiration = this.identityExp;
          cookieOptions = identityCookieOptions;
          payload = {
            userId: userId,
            uniqueId: uniqueId,
            ...(claims as IdentityClaims),
          };
          break;
        default:
          throw new Error('Invalid token type');
      }

      const token = this.createJWT(expiration, payload);
      return { token, cookieOptions, uniqueId };
    } catch (error) {
      throw new Error(String(error));
    }
  }

  public verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secretKey);
      return decoded as TokenPayload;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  private createJWT(expiresIn: string, payload: TokenPayload) {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  static generateUniqueIdentifier() {
    return randomBytes(16).toString('hex');
  }
}

export default JWTHandler;

///////////////////////////
//////// USAGE EXAMPLE //////
/////////////////////////////

// const jwtHandler = new JWTHandler();
// const accessClaims: AccessClaims = {
//   iss: "issuer",
//   aud: "audience",
//   // ... other access token specific claims
// };
// const accessToken = jwtHandler.createToken("userId", TokenType.Access, accessClaims);

// const identityClaims: IdentityClaims = {
//   name: "John Doe",
//   given_name: "John",
//   // ... other identity token specific claims
// };
// const identityToken = jwtHandler.createToken("userId", TokenType.Identity, identityClaims);
