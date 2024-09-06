import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConcesionService } from './concesion.service';
import { Concesion } from './Concesion.entity';

@Controller('concesiones')
export class ConcesionesController {
  constructor(private readonly concesionService: ConcesionService) {}

  @Get()
  async getAllConcesiones(): Promise<Concesion[]> {
    return await this.concesionService.getAllConcesiones();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Asegúrate de que el directorio exista
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtName = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtName}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Only PDF files are allowed!'), false);
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      // Aquí debes reemplazar 'concesionId' con el ID real de la concesión para la que se está subiendo el archivo.
      const concesionId = 1; // Este es un ejemplo, debes obtener el ID real del contexto

      // Llama al servicio para manejar el archivo y guardar la ruta
      const updatedConcesion = await this.concesionService.createConcesion(
        concesionId,
        file.path,
      );

      return {
        message: 'Archivo subido exitosamente',
        concesion: updatedConcesion,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error uploading file',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
