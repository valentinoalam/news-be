import { CaslAbilityFactory } from '@/ability.factory';
import { DatabaseService } from '@/core/database/database.service';
import { cookieExtractor } from '@/shared/utils/cookie.utils';
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

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  private logger = new Logger(JwtAuthGuard.name);

  constructor(
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly db: DatabaseService,
    private readonly config: ConfigService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const accessToken = ExtractJwt.fromExtractors([
        cookieExtractor(request, this.config),
      ])(request);

      if (!accessToken)
        throw new UnauthorizedException('Access token is not set');
      // Call the parent AuthGuard to validate the JWT and set the user in the request
      const isAuthValid = await this.activate(context);

      if (!isAuthValid) {
        return false;
      }
      // At this point, the user has been authenticated
      const user = request.user;

      // If roles are not present in the JWT, query them from the database
      let roles = user.roles || [];
      if (!roles.length) {
        const userRoles = await this.db.user.findMany({
          where: { id: user.id },
        });
        roles = userRoles.map((userRole) => userRole.role);
      }

      // Define user abilities based on their roles
      user.ability = this.caslAbilityFactory.defineAbility(user, roles);

      // Allow the request to proceed if no errors
      return true;
    } catch (err) {
      this.logger.error((err as Error).message);
      return false;
    }
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }
}
