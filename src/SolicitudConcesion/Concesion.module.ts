import { Module } from '@nestjs/common';
import { ConcesionesController } from './concesion.controller';
import { ConcesionService } from './concesion.service';
import { Concesion } from './Concesion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/User/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Concesion]), UserModule],
  controllers: [ConcesionesController],
  providers: [ConcesionService],
  exports: [ConcesionService],
})
export class ConcesionesModule {}
