import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Concesion } from 'src/SolicitudConcesion/Concesion.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 }) // Limitar la longitud del nombre a 50 caracteres
  nombre: string;

  @Column({ length: 50 }) // Limitar la longitud del primer apellido a 50 caracteres
  apellido1: string;

  @Column({ length: 50 }) // Limitar la longitud del segundo apellido a 50 caracteres
  apellido2: string;

  @Column({ unique: true, length: 100 }) // Email debe ser único y se limita a 100 caracteres
  email: string;

  @Column() // La contraseña debería encriptarse en la aplicación antes de guardarse
  password: string;

  @Column({ type: 'bigint', nullable: true }) // Puede permitir `null` en el número de teléfono, usando bigint para números largos
  telefono: number;

  // Relación con Concesion
  @OneToMany(() => Concesion, (concesion) => concesion.IdUser)
  concesiones: Concesion[];
}
