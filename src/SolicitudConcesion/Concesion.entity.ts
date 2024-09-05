import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../User/user.entity';

@Entity()
export class Concesion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ArchivoAdjunto: string;

  @ManyToOne(() => User, (user) => user.id)
  IdUser: User;
}
