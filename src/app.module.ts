import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';  // Importar ServeStaticModule
import { join } from 'path';  // Importar join para manejar rutas
import { User } from './User/user.entity';
import { Concesion } from './SolicitudConcesion/Concesion.entity';
import { UserModule } from './User/user.module';
import { ConcesionesModule } from './SolicitudConcesion/Concesion.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/' // Configuración para servir archivos estáticos desde la carpeta "uploads"
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: '1234',
      database: 'zmtmn',
      entities: [User, Concesion],
      synchronize: true,
    }),
    UserModule,
    ConcesionesModule,
    TypeOrmModule.forFeature([User, Concesion]),
  ],
})
export class AppModule {}
