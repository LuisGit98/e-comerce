import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET') || 'default_value', //secreTOrkey espera un string asi que o le paso un valor por defecto o le dejo as string,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //de donde extraer el token
    });
  }
  //aqui llega el paidload para ser validado

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    const user = await this.userRepository.findOneBy({ email });


    if (!user) throw new UnauthorizedException('no valid');//si existe

    if (!user.isActive) throw new UnauthorizedException('inactive user');//si esta activo


    return user;
  }
}
