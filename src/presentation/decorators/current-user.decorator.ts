import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (property: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    if (!request.user) {
      throw new UnauthorizedException('User not found in request - make sure JwtAuthGuard is applied');
    }
    
    if (property && request.user[property]) {
      return request.user[property];
    }
    
    return request.user;
  },
);