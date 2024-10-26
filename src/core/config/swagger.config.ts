import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default class SwaggerDocumentation {
  private app: INestApplication;

  constructor(app: INestApplication) {
    this.app = app;
  }

  public serve(): void {
    // Configure swagger
    const configItem = this.app.get(ConfigService);
    const config = new DocumentBuilder()
      .setTitle(configItem.get('app.name'))
      .setDescription(configItem.get('app.swaggerDescription'))
      .setVersion('0.1')
      .addBearerAuth(
        {
          type: 'http',
          // scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'access-token',
      )
      .addTag('DNS')
      .addSecurityRequirements('access-token')
      .build();

    const document = SwaggerModule.createDocument(this.app, config);
    SwaggerModule.setup(configItem.get('app.swaggerPath'), this.app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
      // customCssUrl: '../swagger/swagger.css',
      // customfavIcon: '../swagger/favicon.png',
      customSiteTitle: 'Masjid Management System',
    });
  }
}
