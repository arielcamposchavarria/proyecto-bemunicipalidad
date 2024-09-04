import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  Nombre: string;
  @Column()
  Apellido1: string;
  @Column()
  Apellido2: string;
  @Column()
  Email: string;
  @Column()
  Password: string;
  @Column()
  Telefono: number;
}
