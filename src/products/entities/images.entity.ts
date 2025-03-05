import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class UrlImages {
    @PrimaryGeneratedColumn()
    id:number

    @Column('text')
    url:string

    @ManyToOne(
        () => Product,
        (product) => product.images
    )
    product:Product
}