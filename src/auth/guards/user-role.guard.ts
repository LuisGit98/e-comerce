import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
//este guard usaba la data del decorador @setMetadata que use solo como ejemplo
@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, // sirve para ver informacion de los decoradores y metadata
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validateRoles: string[] = this.reflector.get(
      'roles',
      context.getHandler(),
    );

    if(!validateRoles)return true //si no existen role, entra cualquiera

    const req = context.switchToHttp().getRequest();
    const user = req.user; //puedo agregar as User para usar la entitie y autocompletar

    if (!user) throw new BadRequestException('user not found');

    for (const rol of user.roles) {
      if (validateRoles.includes(rol)) {
        return true;
      }
    }
    
    throw new ForbiddenException(
      `user ${user.fullName} no tienne permiso`
    )
    
  }
}
