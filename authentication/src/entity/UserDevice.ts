import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @Column()
  deviceType: string;
}
