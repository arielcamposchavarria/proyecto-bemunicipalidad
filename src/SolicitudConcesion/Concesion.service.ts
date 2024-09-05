import { Injectable } from '@nestjs/common';
import { Concesion } from './Concesion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ConcesionService {
  constructor(
    @InjectRepository(Concesion)
    private readonly concesionRepository: Repository<Concesion>,
  ) {}
  async getAllConcesiones(): Promise<Concesion[]> {
    return await this.concesionRepository.find();
  }

  // Aquí puedes añadir lógica adicional como guardar la ruta del archivo en la base de datos
  async handleFile() {
    // Lógica para manejar el archivo subido
  }
}
