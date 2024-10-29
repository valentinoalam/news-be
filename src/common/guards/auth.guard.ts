import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '@/features/auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionToken = this.extractSessionToken(request);
    const bearerToken = this.extractBearerToken(request);

    if (!sessionToken || !bearerToken) {
      throw new UnauthorizedException('No authentication provided');
    }

    try {
      let user;
      if (sessionToken) {
        user = await this.authService.validateSession(sessionToken);
      } else if (bearerToken) {
        user = await this.authService.validateToken(bearerToken);
      }

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractSessionToken(request: any): string | undefined {
    // Check for the session token in cookies
    // The cookie name depends on your NextAuth configuration
    const cookieName =
      process.env.NODE_ENV === 'production'
        ? `__Secure-${this.config.get('app.cookieName')}`
        : this.config.get('app.cookieName');

    return request.cookies?.[cookieName];
  }

  private extractBearerToken(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
