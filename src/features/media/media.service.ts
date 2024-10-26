import { Injectable } from '@nestjs/common';
import { CreateMediaItemDto } from './dto/create-media.dto';
// import { UpdateMediaDto } from './dto/update-media.dto';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class MediaService {
  constructor(private prisma: DatabaseService) {}

  async create(data: CreateMediaItemDto) {
    return this.prisma.mediaItem.create({
      data,
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
