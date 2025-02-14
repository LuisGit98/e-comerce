import {IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength} from 'class-validator'
export class CreateProductDto {
    //aqui defino como quiero que llegue la informacion cuando cree un nuevo producto

    @IsString()
    @MinLength(1)
    title:string
    @IsPositive()
    @IsNumber()
    price:number

    @IsString()
    @MinLength(1)
    description:string

    @IsString()
    @IsOptional()
    slug?:string

    @IsPositive()
    @IsNumber()
    stock:number

    @IsString({each:true})
    @IsArray()
    size:string[]

    @IsString()
    @IsIn(['men','women','kid','unisex'])
    gender:string

}
