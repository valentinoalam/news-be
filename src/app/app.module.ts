import { join } from 'path';

import { LoggedMiddleware } from '@common/middlewares/logged.middleware';
import configuration from '@core/config/configuration';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

import { DatabaseModule } from '../core/database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';

import { ConfigValidator } from '@/core/config/validator/config.validator';
import { FeaturesModule } from '@/features/features.module';
import { CacheModule } from '@nestjs/cache-manager';
// import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validate: ConfigValidator,
      isGlobal: true,
    }),
    HealthModule,
    DatabaseModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
      ],
      //   // other options
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService], // Inject ConfigService
      useFactory: (configService: ConfigService) => [
        {
          rootPath: join(__dirname, configService.get<string>('app.mediaPath')), // Get mediaPath from ConfigService
          serveRoot: '/img/', // Set the root path for serving static files
        },
      ],
    }),
    FeaturesModule,
    CacheModule.register({
      isGlobal: true,
      store: 'memory',
      ttl: 5000, // time-to-live in seconds
      max: 10, // maximum number of items in cache
    }),
  ],

  controllers: [AppController],
  providers: [
    AppService,
    /*ConfigValidator*/
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggedMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
