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
  Delete,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConcesionService } from './concesion.service';
import { Concesion } from './Concesion.entity';
import { User } from 'src/User/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { existsSync, mkdirSync } from 'fs';

@Controller('concesiones')
export class ConcesionesController {
  constructor(
    private readonly concesionService: ConcesionService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get()
  async getAllConcesiones(): Promise<Concesion[]> {
    return await this.concesionService.getAllConcesiones();
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('file',3, {
      storage: diskStorage({
        destination: './uploads',
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
        fields: 5,
      },
    }),
  )
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],  // Cambiado a un array de archivos
    @Body('userId') userId: number,
    @Body('id') id: number,
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }
  
    if (!userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }
  
    // Encuentra al usuario en la base de datos usando el ID proporcionado
    const user = await this.userRepository.findOne({ where: { id: userId } });
  
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  
    // Prepara los datos de la concesión usando la instancia de User
    const archivosAdjuntos = files.map(file => file.path).join(',');

  // Prepara los datos de la concesión usando la instancia de User
  const concesionData: Partial<Concesion> = {
    id,
    ArchivoAdjunto: archivosAdjuntos, // Guarda las rutas de los archivos como cadena
    IdUser: user,
  };

  const updatedConcesion =
    await this.concesionService.createConcesion(concesionData);

  return {
    message: 'Archivos subidos exitosamente',
    concesion: updatedConcesion,
  };
}
  
  catch(error) {
    throw new HttpException(
      error.message || 'Error uploading files',
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  /*@Put(':id')
  @UseInterceptors(
    FilesInterceptor('file', 3,{
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
  }*/
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.concesionService.deleteConcesion(id);
  }
}
