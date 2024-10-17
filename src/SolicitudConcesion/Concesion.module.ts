import { Module } from '@nestjs/common';
import { ConcesionesController } from './Concesion.controller';
import { ConcesionService } from './Concesion.service';
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
