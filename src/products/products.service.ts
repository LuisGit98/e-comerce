import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { BeforeInsert, Repository } from 'typeorm';
import { error } from 'console';

@Injectable()
export class ProductsService {

  //esta propiedad es para ver mejor los errores
  private readonly logger = new Logger('productsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      // if (!createProductDto.slug){

      //   createProductDto.slug = createProductDto.title.
      //   toLowerCase().
      //   replaceAll(' ','_')//reemplaza lo primero por lo segundo
      // }else{
      //   createProductDto.slug = createProductDto.title.
      //   toLowerCase().
      //   replaceAll(' ','_')
      // }


      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  handleErrors(e: any) {
    if (e.code == 2305) {
      throw new BadRequestException(e.detail);
    }
    this.logger.error(error);

    throw new InternalServerErrorException('otro error desconocido');
  }

  
}
