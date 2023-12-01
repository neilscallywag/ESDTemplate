import { createClient } from 'redis';

import logger from '../logging/logger';

class RedisService {
  private client;

  constructor() {
    if (!process.env.REDIS_URL) {
      logger.error('REDIS_URL is not defined in .env');
    }
    if (!process.env.REDIS_PASSWORD) {
      logger.error('REDIS_PASSWORD is not defined in .env');
    }
    this.client = createClient({
      // username: 'default', Do not need if username is default
      // password: process.env.REDIS_PASSWORD,
      socket: {
          host: process.env.REDIS_URL,
          port: 6379,
      }
    })
    this.client.connect().catch((error: Error) => {
      logger.error(' Redis connection has failed at ' + error);
    });
  }

  async set(key: string, value: string, expiryInSec?: number) {
    if (expiryInSec) {
      await this.client.setEx(key, expiryInSec, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async getKeyByValue(value: string): Promise<string | null> {
    logger.error('getKeyByValue is not implemented yet. Search Key: ' + value);
    return null;
  }
}

export default RedisService;
