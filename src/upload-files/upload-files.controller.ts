import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { filter } from './helpers/file-filer.helper';
import { diskStorage } from 'multer';

@Controller('upload-files')
export class UploadFilesController {
  constructor(private readonly uploadFilesService: UploadFilesService) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor(
      'file',
      //aqui puedo definir configuraciones para guardar las imgs
      { fileFilter: filter, //referencia a mi funcion de helper
        limits:{fieldSize:1000},
        storage:diskStorage({
          destination:'./static/uploads'
        })
       },
    ),
  ) //usar el fileInterceptor y pasar;e el nombre de la key
  uploadFIle(
    @UploadedFile() file: Express.Multer.File, //tipado del archivo
  ) {

    try {

      const secureUrl = `${file.filename}`

      return {
        secureUrl
      };
      
    } catch (error) {
      if(!file) throw new Error(`no viene nada we qv${error}`)
      
    }
     
  }


}
