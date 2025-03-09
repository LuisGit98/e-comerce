import { Module } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { UploadFilesController } from './upload-files.controller';
import { ConfigModule } from '@nestjs/config';


@Module({
  controllers: [UploadFilesController],
  providers: [UploadFilesService],
  imports:[ConfigModule]
})
export class UploadFilesModule {}
