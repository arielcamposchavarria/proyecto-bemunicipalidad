
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Injectable, NotFoundException } from '@nestjs/common';

import { Concesion } from './Concesion.entity';
import { User } from '../User/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ConcesionService {
  constructor(
    @InjectRepository(Concesion)
    private readonly concesionRepository: Repository<Concesion>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Obtener todas las concesiones
  async getAllConcesiones(): Promise<Concesion[]> {


    return this.concesionRepository
      .createQueryBuilder('concesion')
      .leftJoinAndSelect('concesion.IdUser', 'user') // Hacer un left join con la entidad User
      .select(['concesion', 'user.id']) // Seleccionar los campos deseados
      .getMany();

    return await this.concesionRepository.find();

  }

  // Obtener una concesión por ID
  async getConcesionById(id: number): Promise<Concesion> {
    const concesion = await this.concesionRepository.findOneBy({ id }); // Cambio aquí
    if (!concesion) {
      throw new NotFoundException(`Concesión con ID ${id} no encontrada`);
    }
    return concesion;
  }


  async createConcesion(concesionData: Partial<Concesion>): Promise<Concesion> {
    const newConcesion = this.concesionRepository.create(concesionData);
    return await this.concesionRepository.save(newConcesion);
  }


  
  async createConcesion(
    concesionId: number,
    Filepath: string,
  ): Promise<Concesion> {
   
    let concesion = await this.concesionRepository.findOneBy({
      id: concesionId,
    });

    if (!concesion) {

      concesion = this.concesionRepository.create();
    concesion.id = concesionId;
    }

    
    concesion.ArchivoAdjunto = Filepath;

   
    return await this.concesionRepository.save(concesion);
  }
  

  async updateConcesion(
    id: number,
    updateData: Partial<Concesion>,
    userId?: number,
  ): Promise<Concesion> {

    // Verificar si la concesión existe
    await this.getConcesionById(id); // Ya no guardamos esta concesión en una variable

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
    await this.concesionRepository.update(id, updateData);

    // Devolver la concesión actualizada
    return this.getConcesionById(id); // Aquí obtenemos y devolvemos la concesión actualizada

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const concesion = await this.getConcesionById(id);

    if (userId) {
      const user = await this.userRepository.findOneBy({ id: userId }); // Cambio aquí
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }
      updateData.IdUser = user;
    }

    await this.concesionRepository.update(id, updateData);
    return this.getConcesionById(id);
  }

  // Eliminar una concesión por ID
  async deleteConcesion(id: number): Promise<void> {
    const result = await this.concesionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Concesión con ID ${id} no encontrada`);
    }
  }
}
