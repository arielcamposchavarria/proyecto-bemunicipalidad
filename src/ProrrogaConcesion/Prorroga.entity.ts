import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../User/user.entity';

@Entity()
export class Prorroga {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ArchivoProrroga: string;

  @ManyToOne(() => User, (user) => user.id)
  IdUser: User;
}
