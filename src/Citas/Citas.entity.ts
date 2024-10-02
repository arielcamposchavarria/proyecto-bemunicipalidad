import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from '../User/user.entity';

@Entity()
export class Cita {
  @PrimaryGeneratedColumn()
  idCita: number;

  @Column({ length: 250 }) 
  descripcion: string;

  // Columna para la fecha y hora de la cita
  @Column({ type: 'timestamp' }) // 'timestamp' permite almacenar fecha y hora
  fecha: Date;

  @ManyToOne(() => User, (user) => user.id)
  IdUser: User;
}
