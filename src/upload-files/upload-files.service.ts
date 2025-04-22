import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadFilesService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(private readonly configService: ConfigService) {}

  getStaticProductImg(imgName: string) {
    const url = join(__dirname, '../../static/img-products/', imgName); //url donde que va buscar
    console.log(url);
    if (!existsSync(url))
      throw new BadRequestException(`img with name${imgName} not found`);

    return url;
  }

  async sendToS3(fileName: string, file: Buffer) {
    const res = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'nest-test-shop',
        Key: fileName,
        Body: file,        
        ContentType:'image/jpeg',
        
      }),
    );
  }
}
