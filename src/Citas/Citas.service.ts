import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from '../Citas/Citas.entity';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citasRepository: Repository<Cita>,
  ) {}

  async getAllCitas(): Promise<Cita[]> {
    return await this.citasRepository.find({ relations: ['IdUser'] });
  }

  async getCitaById(id: number): Promise<Cita> {
    return await this.citasRepository.findOne({
      where: { idCita: id },
      relations: ['IdUser'],
    });
  }

  async createCita(citaData: Partial<Cita>): Promise<Cita> {
    const nuevaCita = this.citasRepository.create(citaData);
    return await this.citasRepository.save(nuevaCita);
  }

  async updateCita(id: number, citaData: Partial<Cita>): Promise<Cita> {
    await this.citasRepository.update(id, citaData);
    return this.getCitaById(id);
  }

  async deleteCita(id: number): Promise<void> {
    await this.citasRepository.delete(id);
  }
}
