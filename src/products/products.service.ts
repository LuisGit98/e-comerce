import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import {  Repository } from 'typeorm';
import { error } from 'console';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { title } from 'process';

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

  async findAll(pagination: PaginationDto) {
    //como limit y offset los puse opcionales en el dto aqui les agrego un valor por defecto en caso de que no vengan
    const { limit = 10, offset = 0 } = pagination;

    try {
      const products = await this.productRepository.find({
        take: limit, //cuantos mostrar
        skip: offset, //offset = saltar resultados
      });

      return products;
    } catch (error) {
      throw new InternalServerErrorException('valio erga pa ');
    }
  }

  async findOne(id: string) {
    let product: Product | null; //otaves usando null para q no de errror
    //const product = await this.productRepository.findOneBy({ id });
    if (isUUID(id)) {
      product = await this.productRepository.findOneBy({ id: id });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: id.toUpperCase(),
          slug: id.toLowerCase(),
        })
        .getOne();
    }

    if (!product) throw new BadRequestException('eerror w no puede ser ');

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });
    if (!product) throw new NotFoundException('no se encuentra');

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async remove(id: string) {
    const del = await this.findOne(id);
    if (del) {
      await this.productRepository.remove(del);
    }
  }

  handleErrors(e: any) {
    if (e.code == 2305) {
      throw new BadRequestException(e.detail);
    }
    this.logger.error(error);

    throw new InternalServerErrorException('otro error desconocido');
  }
}
