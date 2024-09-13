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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from 'src/User/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prorroga } from './Prorroga.entity';
import { ProrrogaService } from './Prorroga.service';

@Controller('Prorrogas')
export class ProrrogasController {
  constructor(
    private readonly ProrrogaService: ProrrogaService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  
  @Get()
  async getAllProrrogaes(): Promise<Prorroga[]> {
    return await this.ProrrogaService.getAllProrrogas();
  }

  @Get(':id/archivo')
  async obtenerArchivosProrroga(@Param('id') id: number) {
    try {
      // Llamar al servicio para obtener la prórroga por ID
      const prorroga = await this.ProrrogaService.getProrrogaById(id);

      // Verificar si la prórroga existe
      if (!prorroga) {
        throw new HttpException('Prórroga no encontrada', HttpStatus.NOT_FOUND);
      }

      // Extraer los archivos adjuntos (campo ArchivoProrroga almacenado como JSON)
      const archivosAdjuntos = JSON.parse(prorroga.ArchivoProrroga || '[]');

      // Verificar si existen archivos
      if (!archivosAdjuntos.length) {
        throw new HttpException('No hay archivos adjuntos', HttpStatus.NOT_FOUND);
      }

      // Devolver los archivos adjuntos
      return { archivosAdjuntos };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener los archivos adjuntos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, { // Cambiamos a FilesInterceptor, permitiendo hasta 5 archivos
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
        files: 5, // Limitar a 5 archivos
      },
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>, // Cambiado a @UploadedFiles
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

    const prorrogaFiles = files.map(file => file.path); // Solo obtenemos los paths

    const ProrrogaData: Partial<Prorroga> = {
      id,
      ArchivoProrroga: JSON.stringify(prorrogaFiles), // Guardamos los paths en formato JSON
      IdUser: user,
    };
    
    const updatedProrroga =
      await this.ProrrogaService.createProrroga(ProrrogaData);
    return {
      message: 'Archivo subido exitosamente',
      Prorroga: updatedProrroga,
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
  async updateProrroga(
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
      const updatedProrroga = await this.ProrrogaService.updateProrroga(
        id,
        { ArchivoProrroga: file.path }, // Actualizamos la ruta del archivo
        userId,
      );

      return {
        message: 'Concesión actualizada exitosamente',
        Prorroga: updatedProrroga,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al actualizar la concesión',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.ProrrogaService.deleteProrroga(id);
  }
}
