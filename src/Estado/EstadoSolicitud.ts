import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;
}
