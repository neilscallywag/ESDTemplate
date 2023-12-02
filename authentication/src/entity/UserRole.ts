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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.role)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
}
