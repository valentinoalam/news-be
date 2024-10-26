import { DatabaseService } from '@core/database/database.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../../payloads/jwtPayload.type';
import { UsersService } from '@/features/users/services/users.service';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    config: ConfigService,
    public userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        AtStrategy.extractJWT,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('app.jwtAccessSecret'),
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      return req.headers.authorization.split(' ')[1]; // Extract only the token part
    }
    return null;
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.getById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found'); // Handle case when user is not found
    }
    return user;
  }
}
