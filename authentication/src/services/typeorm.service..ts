import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { User } from '../entity/User';

// to replace everything with env files
// TODO
export const DatabaseService = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
