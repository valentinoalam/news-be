import { CaslAbilityFactory } from '@/ability.factory';
import { DatabaseService } from '@/core/database/database.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

const cookieExtractor = (req: Request) => {
  if (req && req.cookies) {
    return req.cookies['jwt'];
  }
};
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  private logger = new Logger(JwtAuthGuard.name);

  constructor(private caslAbilityFactory: CaslAbilityFactory, private readonly db: DatabaseService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const accessToken = ExtractJwt.fromExtractors([cookieExtractor])(request);

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
        const userRoles = await this.db.userRoles.findMany({
          where: { userId: user.id },
          include: { role: true },
        });
        roles = userRoles.map((userRole) => userRole.role.name);
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
