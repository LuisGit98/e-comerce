import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UrlImages } from './entities/images.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports:[TypeOrmModule.forFeature([Product,UrlImages])]
})
export class ProductsModule {}
