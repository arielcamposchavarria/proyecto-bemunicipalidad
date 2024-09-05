import { Module } from '@nestjs/common';
import { ConcesionesController } from './concesion.controller';
import { ConcesionService } from './concesion.service';
import { Concesion } from './Concesion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Concesion])],
  controllers: [ConcesionesController],
  providers: [ConcesionService],
})
export class ConcesionesModule {}
