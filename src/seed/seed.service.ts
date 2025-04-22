import { Inject, Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/products-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { runInThisContext } from 'vm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {} //inyectando Product service

  async runSeed() {
    await this.delete()

    const firstUser = await this.insertUsers()
    await this.insertData(firstUser)

    return 'seed executed';
  }

  private async delete() {
    await this.productService.deleteAll();

    const query = this.userRepository.createQueryBuilder();
    await query.delete().where({}).execute();
  }

  private async insertUsers(){
    const seedUsers = initialData.user
    const users:User[] = []

    seedUsers.forEach(user=>{
      users.push(this.userRepository.create(user))

    })
    const dbUsers = await this.userRepository.save(seedUsers)

    return dbUsers[0]

  }
  private async insertData(user:User) {
    await this.productService.deleteAll();

    const products = initialData.products;
    const inserPromises = [];

    //productDto tenia la propiedad size y en el array de products viene sizes
    //ya la cambie nomas hayq que ver si da error
    products.forEach((product) => {
      this.productService.create(product,user);
    });

    await Promise.all(inserPromises);

    return true;
  }
}
