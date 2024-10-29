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
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'access-token',
      )
      // .addSecurityRequirements('access-token')
      .build();

    const document = SwaggerModule.createDocument(this.app, config);
    SwaggerModule.setup(configItem.get('app.swaggerPath'), this.app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }
}
