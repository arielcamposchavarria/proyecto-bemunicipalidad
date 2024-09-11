import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estado } from './EstadoSolicitud'; // Importar la entidad Estado

@Module({
  imports: [TypeOrmModule.forFeature([Estado])], // Registrar la entidad Estado en TypeORM
  exports: [TypeOrmModule], // Exportamos el módulo si otros módulos necesitan acceso a Estado
})
export class EstadoModule {}
