import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import e from 'express';
import { LoginUser } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly auth: Repository<User>,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    try {

      const {password , ...userData} = createAuthDto

      const user = this.auth.create({
        ...userData,
        password:bcrypt.hashSync(password, 10)
      });

      await this.auth.save(user);

      return user;
    } catch (error) {
      console.log(error)
    }
  }


  async login(login:LoginUser){
    try {
      const {password,email} = login


      const user = await this.auth.findOne({
        where:{email},
        select:{email:true,password:true}
      })
      if(!user)throw new BadRequestException('no hay ese user')
        
      if(!bcrypt.compareSync(password,user.password)) throw new BadRequestException('no esta bien eso')
      
    } catch (error) {
      
    }

  }
}
