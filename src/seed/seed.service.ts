import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/products-data';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}//inyectando Product service 

  async runSeed() {
    await this.insertData();
    return 'seed executed';
  }

  private async insertData() {
    await this.productService.deleteAll();

    const products = initialData.products;
    const inserPromises=[]

    //productDto tenia la propiedad size y en el array de products viene sizes
    //ya la cambie nomas hayq que ver si da error 
    // products.forEach(product => {
    //   this.productService.create(product)
    // })

    await Promise.all(inserPromises)

    return true;
  }
}
 