import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Cita } from '../Citas/Citas.entity';
  import { User } from '../User/user.entity';
  import { CitasService } from './Citas.service';
  
  @Controller('citas')
  export class CitasController {
    constructor(
      private readonly citasService: CitasService,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}
  
    // Obtener todas las citas
    @Get()
    async getAllCitas(): Promise<Cita[]> {
      return await this.citasService.getAllCitas();
    }
  
    // Obtener una cita por su ID
    @Get(':id')
    async getCitaById(@Param('id') id: number): Promise<Cita> {
      const cita = await this.citasService.getCitaById(id);
      if (!cita) {
        throw new HttpException('Cita no encontrada', HttpStatus.NOT_FOUND);
      }
      return cita;
    }
  
    // Crear una nueva cita
    @Post()
    async createCita(
      @Body('descripcion') descripcion: string,
      @Body('userId') userId: number,
      @Body('fecha') fecha: Date, // Recibe la fecha desde el cuerpo de la solicitud
    ): Promise<Cita> {
      // Buscar el usuario por su ID
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
  
      // Preparar los datos de la cita
      const citaFecha = new Date(fecha);
      if (isNaN(citaFecha.getTime())) {
        throw new HttpException('Fecha inválida', HttpStatus.BAD_REQUEST);
      }
    
      // Preparar los datos de la cita
      const citaData: Partial<Cita> = {
        descripcion,
        fecha: citaFecha, // Utiliza la fecha convertida
        IdUser: user,
      };
  
      // Crear y devolver la nueva cita
      return await this.citasService.createCita(citaData);
    }
  
    // Actualizar una cita existente
    @Put(':id')
    async updateCita(
      @Param('id') id: number,
      @Body('descripcion') descripcion: string,
      @Body('userId') userId: number,
      @Body('Fecha') Fecha: Date, // Recibe la nueva fecha desde el cuerpo de la solicitud
    ): Promise<Cita> {
      // Buscar el usuario por su ID
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
  
      // Preparar los datos de la cita para actualizar
      const citaData: Partial<Cita> = {
        descripcion,
        fecha: new Date(Fecha), // Convertimos la fecha a un objeto Date
        IdUser: user,
      };
  
      // Actualizar y devolver la cita actualizada
      return await this.citasService.updateCita(id, citaData);
    }
  
    // Eliminar una cita
    @Delete(':id')
    async deleteCita(@Param('id') id: number): Promise<void> {
      const cita = await this.citasService.getCitaById(id);
      if (!cita) {
        throw new HttpException('Cita no encontrada', HttpStatus.NOT_FOUND);
      }
      await this.citasService.deleteCita(id);
    }
  }
  