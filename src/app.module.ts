import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { UploadFilesModule } from './upload-files/upload-files.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // ServeStaticModule.forRoot({   ejemplo de como exponer las imagenes de forma estatica
    //   rootPath:join(__dirname,'..','public')
    // }),
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRoot({
      
      type: 'postgres',
      host: process.env.HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    UploadFilesModule,
    AuthModule,
  ]
})
export class AppModule {}
