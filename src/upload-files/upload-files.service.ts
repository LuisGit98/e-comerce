import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadFilesService {
  getStaticProductImg(imgName: string) {
    const url = join(__dirname, '../../static/img-products/', imgName);//url donde que va buscar
    console.log(url)
    if (!existsSync(url))
      throw new BadRequestException(`img with name${imgName} not found`);


    return url
  }
  

}
