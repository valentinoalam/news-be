import { AppModule } from './app/app.module';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';
import SwaggerDocumentation from './core/config/swagger.config';
import { DatabaseService } from './core/database/database.service';

declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false, // Disable default logger
  });
  const logger = new Logger('Bootstrap');
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const { httpAdapter } = app.get(HttpAdapterHost);
  const config = app.get(ConfigService);
  if (config.get('app.corsEnabled')) {
    app.enableCors({
      origin: config.get('app.frontendUrl'),
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'sessionId'],
      credentials: true,
    });
  }

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Jika ingin diblock data selain data di dto harus dirubah whitelist = true
      transform: true, // Jika true, maka DataIn akan di transform sesuai dengan deklarinnya, tidak perlu menggunakan ParseXXXPipe
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const prismaService = app.get(DatabaseService);
  await prismaService.enableShutdownHooks(app);

  if (config.get('app.swaggerEnabled')) {
    const swaggerDoc = new SwaggerDocumentation(app);
    swaggerDoc.serve();
  }
  const port = process.env.PORT || 6001;
  await app.listen(port);
  logger.log('server run on ' + port);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
