import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';

//module donde quiero importar el service
@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[ProductsModule,AuthModule]
})
export class SeedModule {}
