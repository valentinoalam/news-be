import { DatabaseService } from '@core/database/database.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { Response } from 'express';

import { UsersService } from '../../users/services/users.service';
import { SigninDto } from '../dto';
import { JwtPayload } from '../payloads/jwtPayload.type';
import { Tokens } from '../types';

import { User } from '@/features/users/entities';
import { RoleService } from '@/features/role/role.service';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwt: JwtService,
    private config: ConfigService,
    private usersService: UsersService,
    private roleService: RoleService
  ) {}

  async signin(dto: SigninDto): Promise<{ tokens: Tokens; user: any }> {
    // find the user by username
    if (!dto.email) dto.email = dto.username;
    const user = await this.db.user.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.email }],
      },
      select: {
        id: true,
        username: true,
        email: true,
        hashedPassword: true,
        profile: {
          select: {
            name: true,
            profilePic: true,
          },
        },
        userRoles: {
          select: {
            role: true
          }
        },
        position: {
          select: {
            name: true
          }
        }
      },
    });

    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Invalid username or password.');

    // compare password
    const pass = await verify(user.hashedPassword, dto.password);

    // if password incorrect throw exception
    if (!pass) throw new ForbiddenException('Invalid username or password.');

    // send back the user
    delete user.hashedPassword; // Tidak perlu lg karena sudah pakai return jwt

    // using access_token and refresh_token now, not just single jwt
    // return this.signToken(user.id, user.username, user.role);
    const roles = await this.roleService.getUserRoles(user.id);
    const tokens = await this.signTokens({
      sub: user.id,
      username: user.username,
      roles: roles.map(role => role.roleName),
    });
    await this.updateRtHash(user.id, tokens.refresh_token);

    return { tokens, user };
  }

  async getIAM(id: string): Promise<User> {
    const user = await this.usersService.getIAM(id);

    return user;
  }

  async signout(userId: string, res: Response): Promise<boolean> {
    const updatedCount = await this.removeRtHash(userId);

    return updatedCount.count > 0 ? true : false;
  }

  async refreshToken(userId: string, rt: string): Promise<Tokens> {
    const user = await this.db.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        hashedRT: true,
      },
    });

    if (!user || !user.hashedRT) throw new ForbiddenException('Access Denied');
    const rtMatches = await verify(user.hashedRT, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');
    const userRoles = await this.roleService.getUserRoles(user.id);
    const tokens = await this.signTokens({
      sub: user.id,
      username: user.username,
      roles: userRoles.map(role => role.roleName),
    });

    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: string, rt: string) {
    const hashedRT = await hash(rt);

    await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRT,
      },
    });
  }

  async removeRtHash(userId) {
    // Only updates if hashedRefreshToken is not null to avoid
    // unecessary updates on database.
    return await this.db.user.updateMany({
      where: {
        id: userId,
        hashedRT: {
          not: null,
        },
      },
      data: {
        hashedRT: null,
      },
    });
  }

  async signToken(jwtPayload: JwtPayload): Promise<{ access_token: string }> {
    const secret = this.config.get('app.jwtAccessSecret');
    const token = await this.jwt.signAsync(jwtPayload, {
      secret,
      expiresIn: '5h',
    });

    return { access_token: token };
  }

  async signTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    const secret_at = this.config.get('app.jwtAccessSecret');
    const secret_rt = this.config.get('app.jwtRefreshSecret');

    const [at, rt] = await Promise.all([
      await this.jwt.signAsync(jwtPayload, {
        secret: secret_at,
        expiresIn: '5h',
      }),
      await this.jwt.signAsync(jwtPayload, {
        secret: secret_rt,
        expiresIn: '7d',
      }),
    ]);

    return { access_token: at, refresh_token: rt, access_type: 'Bearer' };
  }
}
