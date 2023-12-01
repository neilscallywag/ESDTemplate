import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
