import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from '@/core/config/multer.config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) =>
        multerOptions(configService),
      inject: [ConfigService],
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
