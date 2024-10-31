import { Injectable } from '@nestjs/common';
import { CreateMediaItemDto } from './dto/create-media.dto';
// import { UpdateMediaDto } from './dto/update-media.dto';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class MediaService {
  constructor(private prisma: DatabaseService) {}

  async createMany(articleId, data: CreateMediaItemDto[]) {
    return this.prisma.mediaItem.createMany({
      data: data.map((item) => ({
        articleId: articleId,
        isFeatured: item.isFeatured,
        fileName: item.file.filename,
        fileSize: item.file.size,
        mimeType: item.file.mimetype,
        url: item.file.path,
        alt: item.alt || '',
        caption: item.caption || '',
      })),
    });
  }

  async findAll() {
    return this.prisma.mediaItem.findMany();
  }

  async attachToArticle(mediaId: string, articleId: string) {
    return this.prisma.article.update({
      where: { id: articleId },
      data: {
        mediaItems: {
          connect: { id: mediaId },
        },
      },
    });
  }
}
