import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { User } from './User/user.entity';
import { Concesion } from './SolicitudConcesion/Concesion.entity';
import { UserModule } from './User/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'zmtnp',
      entities: [User, Concesion],
      synchronize: true,

    }),
    UserModule,
    TypeOrmModule.forFeature([User, Concesion]),
  ],
})
export class AppModule {}
