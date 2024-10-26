import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayloadWithRt } from '../../payloads/jwtPayloadWithRt.type';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('app.jwtRefreshSecret'),
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'rt' in req.cookies) return req.cookies.rt;

    return null;
  }

  async validate(req: Request, payload: JwtPayloadWithRt) {
    // Check if refresh token has expired
    const expiresAt = new Date(payload.exp * 1000);
    if (expiresAt < new Date()) {
      throw new Error('Expired refresh token');
    }
    let refreshToken = null;
    if (req.cookies && 'rt' in req.cookies) refreshToken = req.cookies.rt;
    else refreshToken = req?.get('authorization')?.replace('Bearer', '').trim();

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    return { ...payload, refreshToken };
  }
}
