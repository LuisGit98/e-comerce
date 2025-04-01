import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles';
//con este decorador sustituyo definir los roles con @Setmetadata (en el controlador)
export const META_ROLES = 'roles' // lo pongo aqui nomas pa tenerlo en un solo lugar 
export const RoleProtected = (...args: ValidRoles[]) =>{ 
    
    
    return SetMetadata( META_ROLES, args);
}

