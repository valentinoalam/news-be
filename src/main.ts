import { AppModule } from './app/app.module';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';
import SwaggerDocumentation from './core/config/swagger.config';
import { DatabaseService } from './core/database/database.service';

declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  const { httpAdapter } = app.get(HttpAdapterHost);
  const config = app.get(ConfigService);

  // Enable CORS if configured
  if (config.get('app.corsEnabled')) {
    app.enableCors({
      origin: config.get('app.frontendUrl'),
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'sessionId'],
      credentials: true,
    });
  }

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Middleware and global settings
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Allow only properties defined in DTOs
      transform: true, // Automatically transform payloads to DTO instances
      forbidNonWhitelisted: true, // Block properties not defined in DTOs
      transformOptions: {
        enableImplicitConversion: true, // Allow automatic type conversion
      },
    }),
  );
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Enable Prisma shutdown hooks
  const prismaService = app.get(DatabaseService);
  await prismaService.enableShutdownHooks(app);

  // Serve Swagger documentation if enabled
  if (config.get('app.swaggerEnabled')) {
    const swaggerDoc = new SwaggerDocumentation(app);
    swaggerDoc.serve();
  }

  // Start the server
  const port = process.env.PORT || 6001;
  await app.listen(port);
  logger.log(`Server is running on port ${port}`);

  // Hot module replacement (HMR) support
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
