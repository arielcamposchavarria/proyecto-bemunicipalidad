import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static'; // Importar ServeStaticModule
import { join } from 'path'; // Importar join para manejar rutas
import { User } from './User/user.entity';
import { Concesion } from './SolicitudConcesion/Concesion.entity';
import { UserModule } from './User/user.module';
import { ConcesionesModule } from './SolicitudConcesion/Concesion.module';
import { Prorroga } from './ProrrogaConcesion/Prorroga.entity';
import { ProrrogaModule } from './ProrrogaConcesion/Prorroga.module';
import { CitasModule } from './Citas/Citas.module';
import { Cita } from './Citas/Citas.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/', // Configuración para servir archivos estáticos desde la carpeta "uploads"
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'zmtnp',
      entities: [User, Concesion, Prorroga, Cita],
      synchronize: true,
    }),
    UserModule,
    ConcesionesModule,
    ProrrogaModule,
     CitasModule,
     TypeOrmModule.forFeature([User, Concesion, Prorroga, Cita]),
   
  ],
})
export class AppModule {}
