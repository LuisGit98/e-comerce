import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { filter } from './helpers/file-filer.helper';
import { diskStorage } from 'multer';
import { filrNamer } from './helpers/namer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('upload-files')
export class UploadFilesController {
  constructor(
    private readonly uploadFilesService: UploadFilesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/product')
  @UseInterceptors(
    FileInterceptor(
      'file',
      //aqui puedo definir configuraciones para guardar las imgs
      {
        fileFilter: filter, //referencia a mi funcion de helper
        //limits:{fieldSize:1000},
        storage: diskStorage({
          destination: './static/uploads',
          filename: filrNamer,
        }),
      },
    ),
  ) //usar el fileInterceptor y pasar;e el nombre de la key
  uploadFIle(
    @UploadedFile() file: Express.Multer.File, //tipado del archivo
  ) {
    try {
      // const secureUrl = `${file.filename}` forma estatica
      const secureUrl = `${this.configService.get('HOST_API')}/upload-files/product/${file.filename}`;

      return {
        secureUrl,
      };
    } catch (error) {
      if (!file) throw new Error(`no viene nada we qv${error}`);
    }
  }

  @Get('/product/:imgName')
  findOne(
    @Res() res: Response, //decorador para tomar control de lo que quiero regresar, con este decorador debo usar la respuesta como lo ago abajo o res.json
    @Param('imgName') name: string,
  ) {
    const path = this.uploadFilesService.getStaticProductImg(name); //regresar la imagen

    res.sendFile(path);
  }
}
