import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserAuth } from './UserAuth';
import { UserDevice } from './UserDevice';
import { UserLocation } from './UserLocation';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => UserAuth)
  @JoinColumn()
  auth: UserAuth;

  @OneToOne(() => UserDevice)
  @JoinColumn()
  device: UserDevice;

  @OneToOne(() => UserLocation)
  @JoinColumn()
  location: UserLocation;
}
