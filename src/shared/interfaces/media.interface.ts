import { Article } from '@/features/articles/entities/article.entity';
import { CreateMediaItemDto } from '@/features/media/dto/create-media.dto';
import { MediaItem } from '@/features/media/entities/media.entity';
import { Prisma } from '@prisma/client';

export interface IMediaService {
  createMany(
    articleId,
    data: CreateMediaItemDto[],
  ): Promise<Prisma.BatchPayload>;
  findAll(): Promise<MediaItem[]>;
  attachToArticle(mediaId: string, articleId: string): Promise<Article>;
  uploadTemp(file: Express.Multer.File, sessionId: string): Promise<MediaItem>;
  makePermanent(sessionId: string, articleId: string): void;
  cleanupTempFiles(sessionId: string): void;
}
