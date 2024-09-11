import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {

  // Especificamos que estamos usando NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // // Habilitar CORS

  // const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Servir archivos estáticos desde la carpeta 'uploads'
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Prefijo opcional para los archivos estáticos
  });

  await app.listen(3006);
}

bootstrap();