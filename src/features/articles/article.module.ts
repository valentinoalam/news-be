import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { MediaService } from '../media/media.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, MediaService],
})
export class ArticleModule {}
