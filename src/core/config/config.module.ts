import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfigService } from './service/config.service';
// import { ConfigValidator } from './config.validator';
// import configuration from './configuration';
// import { envSchema } from './config.schema';
// import path from 'path';

@Global()
@Module({
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class ConfigsModule {}
