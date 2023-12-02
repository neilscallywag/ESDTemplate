import { randomBytes } from 'crypto';
import { config } from 'dotenv';
import { CookieOptions } from 'express';
import { Secret } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';

import {
  accessCookieOptions,
  identityCookieOptions,
  refreshCookieOptions,
} from '../config/cookieOptions';
import logger from '../logging/logger';

config();
interface BaseClaims {
  iss?: string; // Issuer
  sub?: string; // Subject
  aud?: string; // Audience
  exp?: number; // Expiration Time
  nbf?: number; // Not Before
  iat?: number; // Issued At
  jti?: string; // JWT ID
}

// refer to https://www.iana.org/assignments/jwt/jwt.xhtml for comprehensive list of claims
interface AccessClaims extends BaseClaims {
  scope?: string;
  client_id?: string;
}

interface IdentityClaims extends BaseClaims {
  name?: string;
  given_name?: string;
  family_name?: string;
}

interface RefreshClaims extends BaseClaims {}

enum TokenType {
  Access = 'access',
  Refresh = 'refresh',
  Identity = 'identity',
}

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
    type: TokenType,
    claims?: AccessClaims | IdentityClaims | RefreshClaims,
  ) {
    try {
      let expiration: string;
      let cookieOptions: CookieOptions;
      let payload: object;

      switch (type) {
        case TokenType.Access:
          expiration = this.accessExp;
          cookieOptions = accessCookieOptions;
          payload = { userId, ...(claims as AccessClaims) };
          break;
        case TokenType.Refresh:
          expiration = this.refreshExp;
          cookieOptions = refreshCookieOptions;
          payload = { userId, ...(claims as RefreshClaims) };
          break;
        case TokenType.Identity:
          expiration = this.identityExp;
          cookieOptions = identityCookieOptions;
          payload = { userId, ...(claims as IdentityClaims) };
          break;
        default:
          throw new Error('Invalid token type');
      }

      const token = this.createJWT(expiration, payload);
      return { token, cookieOptions };
    } catch (error) {
      throw new Error(String(error));
    }
  }

  private createJWT(expiresIn: string, payload: object) {
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
