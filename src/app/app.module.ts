import { join } from 'path';
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
            // winston.format.colorize(),
            // winston.format.ms(),
            // winston.format.printf(({ timestamp, level, message }) => {
            //   return `${timestamp} [${level}]: ${message}`;
            // }),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
        // You can add additional transports, such as file or HTTP transports
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
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

  controllers: [],
  providers: [
    AppService,
    /*ConfigValidator*/
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
