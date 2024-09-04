import { Module } from '@nestjs/common';
import { ConcesionesController } from './concesion.controller';
import { ConcesionesService } from './concesion.service';

@Module({
  controllers: [ConcesionesController],
  providers: [ConcesionesService],
})
export class ConcesionesModule {}
