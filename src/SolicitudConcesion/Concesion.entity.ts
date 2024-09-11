import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../User/user.entity';

@Entity()
export class Concesion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ArchivoAdjunto: string;

  // Relación con la entidad User
  @ManyToOne(() => User, (user) => user.concesiones, { eager: true }) // eager: true para cargar automáticamente
  IdUser: User;

  // Relación con la entidad Estado
}
