import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { MediaService } from '../media/media.service';
import { StorageService } from '../media/storage/storage.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, MediaService, StorageService],
})
export class ArticleModule {}
