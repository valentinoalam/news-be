import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from '@/features/auth/auth.service';
import { cookieExtractor } from '@/shared/utils/cookie.utils';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  private logger = new Logger(JwtAuthGuard.name);
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  private extractSessionToken(request: Request): string | undefined {
    return ExtractJwt.fromExtractors([cookieExtractor(request, this.config)])(
      request,
    );
  }
  private extractBearerToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const { route } = request;
    // Exclude specific routes from authentication
    if (
      isPublic ||
      route.path.includes('/auth/signin') ||
      route.path.includes('/auth/signup') ||
      route.path.includes('/auth/refresh') ||
      /\/[^/]+\/fake-it/.test(route.path)
    ) {
      return true;
    }
    try {
      const sessionToken = this.extractSessionToken(request);
      const bearerToken = this.extractBearerToken(request);

      if (!sessionToken && !bearerToken)
        throw new UnauthorizedException('Access token is not set');

      // Call the parent AuthGuard to validate the JWT and set the user in the request
      const isAuthValid = await this.activate(context);
      if (!isAuthValid) {
        throw new UnauthorizedException('Access token is no longer valid');
      }

      const user = sessionToken
        ? await this.authService.validateSession(sessionToken)
        : await this.authService.validateToken(bearerToken);

      request.user = user;
      // Allow the request to proceed if no errors
      return true;
    } catch (err) {
      this.logger.error((err as Error).message);
      throw new UnauthorizedException();
    }
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }
}
