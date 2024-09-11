import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prorroga } from './Prorroga.entity';
import { User } from '../User/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProrrogaService {
  constructor(
    @InjectRepository(Prorroga)
    private readonly ProrrogaRepository: Repository<Prorroga>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllProrrogas(): Promise<Prorroga[]> {
    return this.ProrrogaRepository.createQueryBuilder('Prorroga')
      .leftJoinAndSelect('Prorroga.IdUser', 'user') // Hacer un left join con la entidad User
      .select(['Prorroga', 'user.id']) // Seleccionar los campos deseados
      .getMany();

    return await this.ProrrogaRepository.find();
  }

  // Obtener una concesión por ID
  async getProrrogaById(id: number): Promise<Prorroga> {
    const Prorroga = await this.ProrrogaRepository.findOneBy({ id }); // Cambio aquí
    if (!Prorroga) {
      throw new NotFoundException(`Concesión con ID ${id} no encontrada`);
    }
    return Prorroga;
  }

  async createProrroga(ProrrogaData: Partial<Prorroga>): Promise<Prorroga> {
    const newProrroga = this.ProrrogaRepository.create(ProrrogaData);
    return await this.ProrrogaRepository.save(newProrroga);
  }

  async updateProrroga(
    id: number,
    updateData: Partial<Prorroga>,
    userId?: number,
  ): Promise<Prorroga> {
    // Verificar si la concesión existe
    await this.getProrrogaById(id); // Ya no guardamos esta concesión en una variable

    // Si se provee userId, validar que el usuario exista
    if (userId) {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }
      updateData.IdUser = user; // Actualizamos el campo relacionado si el userId es válido
    }

    // Comprobar si hay datos para actualizar
    if (!Object.keys(updateData).length) {
      throw new HttpException(
        'No hay datos para actualizar',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Realizar la actualización
    await this.ProrrogaRepository.update(id, updateData);

    // Devolver la concesión actualizada
    return this.getProrrogaById(id); // Aquí obtenemos y devolvemos la concesión actualizada

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const Prorroga = await this.getProrrogaById(id);

    if (userId) {
      const user = await this.userRepository.findOneBy({ id: userId }); // Cambio aquí
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }
      updateData.IdUser = user;
    }

    await this.ProrrogaRepository.update(id, updateData);
    return this.getProrrogaById(id);
  }

  // Eliminar una concesión por ID
  async deleteProrroga(id: number): Promise<void> {
    const result = await this.ProrrogaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Concesión con ID ${id} no encontrada`);
    }
  }
}
