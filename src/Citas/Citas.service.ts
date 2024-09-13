import { BadRequestException, Injectable } from '@nestjs/common';
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
    if (!citaData.fecha){
      throw new BadRequestException('La fecha de la cita es requerida');

    }
    const fecha = new Date(citaData.fecha);
    const diaSemana = fecha.getDay();

    if(diaSemana !==3){
      throw new BadRequestException('Las citas solo se pueden agendar los miercoles');
    }
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const enHorarioMatutino = (hora >=8 && hora < 12) && (minutos === 0 || minutos === 30);
    const enHorarioVespertino = (hora >= 13 && hora < 16) && (minutos === 0 || minutos === 30);
    if (!enHorarioMatutino && !enHorarioVespertino){
      throw new BadRequestException('Las citas solo se pueden agendar los miercoles de 8:00-11:30 AM o de 1:00-3:30PM cada media hora');

    }
    
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
