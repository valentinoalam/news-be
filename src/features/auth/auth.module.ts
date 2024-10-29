import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport';

import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { APP_GUARD } from '@nestjs/core';
// import { AtGuard } from '@/common/guards';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
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
    SessionSerializer,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AtGuard,
    // },
  ],
  exports: [AuthService],
})
export class AuthModule {}
