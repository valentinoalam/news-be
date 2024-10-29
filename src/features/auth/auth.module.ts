import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport';

import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@/common/guards/auth.guard';
import { AtGuard } from '@/common/guards';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
// import { AtGuard } from '@/common/guards';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwtAccessSecret'),
        signOptions: { expiresIn: configService.get('app.jwtExpiresIn') },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    AuthGuard,
    SessionSerializer,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
