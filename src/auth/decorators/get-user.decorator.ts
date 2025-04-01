import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator((data,ctx:ExecutionContext)=>{

    const a = ctx.switchToHttp().getRequest()
    const user = a.user

    if(!user)throw new InternalServerErrorException('user not found')
    
    return user
})