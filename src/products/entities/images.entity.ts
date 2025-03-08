import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({name:"product_images"})//darle nombre a la tabla (opcional)
export class UrlImages {
    @PrimaryGeneratedColumn()
    id:number

    @Column('text')
    url:string

    @ManyToOne(
        () => Product,
        (product) => product.images,
        {onDelete:'CASCADE'}//que hacer cuando se elimine un producto 
    )
    product:Product
}