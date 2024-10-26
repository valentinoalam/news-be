import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AtGuard extends AuthGuard('jwt-access') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is public, bypass the guard
    if (isPublic) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const { route } = request;
    // Exclude specific routes from authentication
    if (
      route.path.includes('/auth/signin') ||
      route.path.includes('/auth/signup') ||
      route.path.includes('/auth/refresh') ||
      /\/[^/]+\/fake-it/.test(route.path)
    ) {
      return true;
    }

    return super.canActivate(context);
  }
}
