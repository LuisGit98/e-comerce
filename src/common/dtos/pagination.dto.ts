import { IsOptional, IsPositive } from "class-validator"
import {Type}from 'class-transformer'
//recuerda que los dtos sirven para validar en este caso las propiedades que recibo del cliente 

export class PaginationDto{

    @IsOptional()
    @IsPositive()
    @Type(()=>Number)
    limit?:number

    @IsOptional()
    @Type(()=>Number)
    offset?:number
}