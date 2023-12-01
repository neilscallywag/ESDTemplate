import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  geolocation: string;
}
