import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { User, UserAuth, UserDevice, UserLocation, UserRole } from '../entity';
import logger from '../logging/logger';

if (!process.env.DB_TYPE) {
  logger.error('DB_TYPE not set in .env');
}
export const DatabaseService = new DataSource({
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  entities: [User, UserAuth, UserDevice, UserLocation, UserRole],
  migrations: [],
  subscribers: [],
});
