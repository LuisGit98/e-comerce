import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UrlImages } from './images.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity({
  name:'products'
}
  
)
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  title: string;
  @Column('float', {
    default: 0,
  })
  price: number;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column('text', { unique: true })
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column('text',{
    array:true,
    default:[]
  })
  tags:String[]

  @OneToMany(
    ()=>UrlImages,
    (urlImage) => urlImage.product ,
    {cascade:true,
      eager:true //esto significa que cada que uso un metodo find() automaticamente cargara las imagenes. Sin esto en true no me trae en arreglo de imagenes
      //Pero si intento buscar por nombre del producto o por slug no me trae el array de imgs. Esto pasa por estar usando query builder por lo que tengo que usar 
      //leftJointAndSelect() y especificar la relacion 
    }
  )
  images?:UrlImages[]

  @ManyToOne(
    ()=>User,
    (user)=>user.product,
    {eager:true}//para vargar automaticamente la relacion
  )
  user:User

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug.toLowerCase().replaceAll(' ', '_'); //reemplaza lo primero por lo segundo
  }

//aqui puedo limpiar mi informacion que viene del cliente para adaptarla a al db 
  @BeforeUpdate()
  checkSlugUpdate(){
    this.slug = this.slug
    .toLowerCase()
    .replaceAll(' ', '_')
    .replaceAll("'",' ')

  }
}
