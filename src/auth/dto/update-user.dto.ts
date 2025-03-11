import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-user.dto';
import { IsEmail, IsString } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {

    @IsEmail()
    email:string

    @IsString()
    password:string
    
    @IsString()
    fullName:string
}
