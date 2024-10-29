import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import * as fs from 'fs';
// import * as yaml from 'js-yaml';
// import { YAML_CONFIG_FILENAME } from '../configuration';
// import { join, resolve } from 'path';
// import { JsonArray } from '@prisma/client/runtime/library';

@Injectable()
export class AppConfigService {
  // private readonly envConfig: Record<string, string>;
  constructor(private configService: ConfigService) {}

  get environment(): string {
    return this.configService.get<string>('app.environment');
  }
  get name(): string {
    return this.configService.get<string>('app.name');
  }

  get url(): string {
    return this.configService.get<string>('app.url');
  }

  get port(): number {
    return Number(this.configService.get<number>('app.port'));
  }

  get corsEnabled(): boolean {
    return this.configService.get<boolean>('app.corsEnabled');
  }

  get nextAuthSecret(): string {
    return this.configService.get<string>('app.nextAuthSecret');
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('app.jwtExpiresIn');
  }

  get swaggerEnabled(): boolean {
    return this.configService.get<boolean>('app.swaggerEnabled');
  }

  get swaggerDescription(): string {
    return this.configService.get<string>('app.swaggerDescription');
  }

  get swaggerVersion(): string {
    return this.configService.get<string>('app.swaggerVersion');
  }

  get swaggerPath(): string {
    return this.configService.get<string>('app.swaggerPath');
  }
}
