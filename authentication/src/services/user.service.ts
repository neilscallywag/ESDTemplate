import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';

import { User, UserAuth, UserDevice, UserLocation, UserRole } from '../entity';

import { DatabaseService } from './typeorm.service';

// Define types for user data
interface UserData {
  name: string;
  email: string;
  googleAccessKey?: string;
}

interface UserDeviceData {
  ipAddress: string;
  userAgent: string;
  deviceType: string;
}

interface UserLocationData {
  geolocation: string;
}

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

class UserService {
  private userRepo: Repository<User>;
  private userAuthRepo: Repository<UserAuth>;
  private userDeviceRepo: Repository<UserDevice>;
  private userLocationRepo: Repository<UserLocation>;
  private userRoleRepo: Repository<UserRole>;
  private dbService: typeof DatabaseService;

  constructor(dbService: typeof DatabaseService) {
    this.dbService = dbService;
    this.initializeRepositories();
  }

  private async initializeRepositories() {
    const db = await this.dbService.initialize();
    this.userRepo = db.getRepository(User);
    this.userAuthRepo = db.getRepository(UserAuth);
    this.userDeviceRepo = db.getRepository(UserDevice);
    this.userLocationRepo = db.getRepository(UserLocation);
    this.userRoleRepo = db.getRepository(UserRole);
  }

  public async createUser(
    userData: UserData,
    deviceData: UserDeviceData,
    locationData: UserLocationData,
    userRole: Role,
  ): Promise<User> {
    const queryRunner = this.dbService.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let user = await this.userRepo.findOneBy({ email: userData.email });

      if (!user) {
        user = this.userRepo.create({
          username: userData.name,
          email: userData.email,
        });
        user = await this.userRepo.save(user);

        const userAuth = this.userAuthRepo.create({
          user: user,
          password: randomBytes(16).toString('hex'),
          googleAccessKey: userData.googleAccessKey,
        });
        await this.userAuthRepo.save(userAuth);

        const userDevice = this.userDeviceRepo.create({
          user: user,
          ipAddress: deviceData.ipAddress,
          userAgent: deviceData.userAgent,
          deviceType: deviceData.deviceType,
        });
        await this.userDeviceRepo.save(userDevice);

        const userLocation = this.userLocationRepo.create({
          user: user,
          geolocation: locationData.geolocation,
        });
        await this.userLocationRepo.save(userLocation);

        const userRoleEntity = this.userRoleRepo.create({
          user: user,
          role: userRole,
        });
        await this.userRoleRepo.save(userRoleEntity);
      }

      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

export { Role, UserData, UserDeviceData, UserLocationData, UserService };
