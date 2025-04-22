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
import { DataSource, Repository } from 'typeorm';
import { error } from 'console';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { UrlImages } from './entities/images.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {
  //esta propiedad es para ver mejor los errores
  private readonly logger = new Logger('productsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(UrlImages)
    private readonly imgUrlRepository: Repository<UrlImages>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createProductDto: CreateProductDto, user: User) {
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
      //guardando imagene aparte
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails, //sin las imagenes
        user,//agregando el user 
        images: images.map(
          (image) => this.imgUrlRepository.create({ url: image }),
        ),
      });

      await this.productRepository.save(product);

      return { ...product, images };
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
        relations: { images: true },
      });  

      return products.map((product) => ({
        ...product,
        images: product.images?.map((img) => img.url),
      }));
    } catch (error) {
      throw new InternalServerErrorException('error, no encontrado');
    }
  }

  async findOne(id: string) {
    let product: Product | null; //otaves usando null para q no de errror
    //const product = await this.productRepository.findOneBy({ id });
    if (isUUID(id)) {
      product = await this.productRepository.findOneBy({ id: id }); //segun la documentacion de typeorm todos los fin jalan con el eager relationship (mira entitie)
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod'); //le agrego el alias prod a producto como estooy usando productRepository
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: id.toUpperCase(),
          slug: id.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages') //uso del leftJoint . pide que le pasemos otro alias en caso de que quiera hacer otro join con las imgs(no necesario in this case)
        .getOne();
    }

    if (!product) throw new BadRequestException('eerror w no puede ser ');

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...update } = updateProductDto; //separacion de las imagenes para trabajar de otra forma

    const product = await this.productRepository.preload({
      id,
      ...update,
    });
    if (!product) throw new NotFoundException('no se encuentra');
    //si vienen imagenes borrar .create query runner
    //con el queryRunner intentare impactar la bd si todo sale bien
    //si no me permitira  hacer un rollback

    const queryRunner = this.dataSource.createQueryRunner(); // ACUERDATE QUE ESTO ES SOLO SI QUIERO ELIMINAR LA IMGS QUE YA ESTABAN Y REEMPLAZARLAS CON LAS NUEVAS
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(UrlImages, { product: { id } }); //borrando la imgs anteriores

        product.images = images.map((image) =>
          this.imgUrlRepository.create({ url: image }),
        ); //regresando un nuevo areglo, en este puento aun no impacta la db por eso uso el save abajo
      } else {
      }

      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.manager.release();

      //await this.productRepository.save(product)

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleErrors(error);
    }
  }

  //la solucion que se uso fue borrar un producto en cascade
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
    console.log(e.detail);
    this.logger.error(error);

    throw new InternalServerErrorException('otro error desconocido');
  }
  //funcion para aplanar los links de las imgs. uso esta funcion antes de la finOne de arriba
  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term); //findOne de arriba
    return {
      ...rest,
      images: images.map((image) => image.url),
    };
  }

  //borrar todo con queryBuilder
  async deleteAll() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleErrors(error);
    }
  }

}
