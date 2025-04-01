import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUser } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly auth: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    try {
      const { password, ...userData } = createAuthDto;

      const user = this.auth.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.auth.save(user);

      return { ...user, token: this.getJwt({ id: user.id }) };
    } catch (error) {
      console.log(error);
    }
  }

  async login(login: LoginUser) {
    try {
      const { password, email } = login;

      const user = await this.auth.findOne({
        where: { email },
        select: { email: true, password: true,id:true},//aqui habia un error que si generaba el jwt pero no venia el id hasta que lo pedi en el select, 

      });

      if (!user){ throw new BadRequestException('no hay ese user');}

      if (!bcrypt.compareSync(password, user.password)) {
        throw new BadRequestException('no esta bien eso');
      }
  
      return { ...user, token: this.getJwt({ id: user.id }) };
    } catch (error) {
      console.log(error)
    }
  }

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
