import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  password: string;

  @Column()
  googleAccessKey: string;
}
