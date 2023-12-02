import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';

@Entity()
export class UserAuth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.auth)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  password: string;

  @Column({ nullable: true })
  googleAccessKey: string;
}
