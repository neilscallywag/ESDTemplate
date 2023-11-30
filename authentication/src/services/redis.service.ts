import { createClient } from 'redis';

import logger from '../logging/logger';

class RedisService {
  private client;

  constructor() {
    this.client = createClient({ url: process.env.REDIS_URL });
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
