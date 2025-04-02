import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-user.dto';
import { LoginUser } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { UserRoleGuard } from './guards/user-role.guard';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('/login')
  login(@Body() loginUser: LoginUser) {
    return this.authService.login(loginUser);
  }

  //@SetMetadata('roles',['user','admin','super'])    este decorador lo use para crear roles directamente nomas para saber como
  @Get('/privada')
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testPrivateRoute(@GetUser() user: User) {
    return {
      res: 'ok',
      user,
    };
  }
  @Get('/privada2')
  @Auth(ValidRoles.admin)
  testPrivateRoute2(@GetUser() user: User) {
    return {
      res: 'privada 2 ok',
      user,
    };
  }

  
}
