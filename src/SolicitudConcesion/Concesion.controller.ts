import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Body,
  Put,
  Param,
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
      limits: {
        fields: 5, // Aumenta este número si esperas más campos adicionales
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: number, // Captura el ID del usuario del cuerpo de la solicitud
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    if (!userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    // Llama al servicio para manejar el archivo y guardar la ruta
    const updatedConcesion = await this.concesionService.createConcesion(
      userId,
      file.path,
    );

    return {
      message: 'Archivo subido exitosamente',
      concesion: updatedConcesion,
    };
  }

  catch(error) {
    throw new HttpException(
      error.message || 'Error uploading file',
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Asegúrate de que el directorio existe
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
          cb(new Error('Solo se permiten archivos PDF'), false);
        }
      },
    }),
  )
  async updateConcesion(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File, // Capturamos el archivo PDF
    @Body('userId') userId: number, // Capturamos el userId si es necesario
  ) {
    // Validar si hay archivo y userId
    if (!file) {
      throw new HttpException(
        'No se subió ningún archivo',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!userId) {
      throw new HttpException(
        'El ID de usuario es requerido',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Actualizar la concesión con la ruta del archivo y el userId
      const updatedConcesion = await this.concesionService.updateConcesion(
        id,
        { ArchivoAdjunto: file.path }, // Actualizamos la ruta del archivo
        userId,
      );

      return {
        message: 'Concesión actualizada exitosamente',
        concesion: updatedConcesion,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al actualizar la concesión',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
