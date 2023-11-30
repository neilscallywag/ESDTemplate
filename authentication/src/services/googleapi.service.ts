import axios from 'axios';

import logger from '../logging/logger';
import { GoogleUserInfo } from '../types';

export class GoogleAPIService {
  async getUserData(accessToken: string) {
    try {
      const response = await axios.get<GoogleUserInfo>(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      // Check if the response data matches the UserInfo type
      const userData: GoogleUserInfo = response.data;

      return userData;
    } catch (error) {
      // Log the error if the response data doesn't match the UserInfo type
      logger.error('Error: Response data does not match UserInfo type', error);
      throw error; // You can choose to re-throw the error or handle it accordingly
    }
  }
}
