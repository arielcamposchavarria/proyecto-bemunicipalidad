import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitasController } from './Citas.controller';
import { CitasService } from './Citas.service';
import { Cita } from '../Citas/Citas.entity';
import { User } from '../User/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cita, User])],
  controllers: [CitasController],
  providers: [CitasService],
})
export class CitasModule {}
