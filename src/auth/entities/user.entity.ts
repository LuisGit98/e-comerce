import { Product } from "src/products/entities/product.entity";
import { BeforeInsert,BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @Column('text',{
        unique:true
    })
    email:string

    @Column('text')
    password:string

    @Column('text')
    fullName:string

    @Column('boolean',{
        default:true
    })
    isActive:boolean

    @Column('text',{
        array:true,
        default:['user']
    })
    roles:string[]

    @OneToMany(
      ()=> Product,
      (Product) =>Product.id
    )
    product:Product


    @BeforeInsert()
    checkFields(){
      this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkFieldsUpdate(){
      this.checkFields()
    }
}
