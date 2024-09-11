import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProrrogaService } from './Prorroga.service';
import { ProrrogasController } from './Prorroga.controller';
import { Prorroga } from './Prorroga.entity';
import { UserModule } from 'src/User/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Prorroga]), UserModule],
  controllers: [ProrrogasController],
  providers: [ProrrogaService],
  exports: [ProrrogaService],
})
export class ProrrogaModule {}
