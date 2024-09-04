import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    Nombre: String;
    @Column()
    Apellido1: String;
    @Column()
    Apellido2: String;
    @Column()
    Email: String;
    @Column()
    Password: String;
    @Column()
    Telefono: number;

}