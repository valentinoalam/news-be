import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport';

import { UsersService } from '../users/services/users.service';
import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { SessionSerializer } from './session.serializer';
import { AtStrategy, RtStrategy } from './strategies/jwt';
import { LocalStrategy } from './strategies/local/local.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from '@/common/guards';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwtAccessSecret'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    // PassportModule.register({
    //   session: true,
    // }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    RtStrategy,
    AtStrategy,
    LocalStrategy,
    SessionSerializer,
    {
      provide: APP_GUARD,
      useClass: AtGuard
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
