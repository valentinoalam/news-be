import { Injectable } from '@nestjs/common';
import { CreateMediaItemDto } from './dto/create-media.dto';
// import { UpdateMediaDto } from './dto/update-media.dto';
import { DatabaseService } from 'src/core/database/database.service';
import { StorageService } from './storage/storage.service';
import { IMediaService } from '@/shared/interfaces/media.interface';

@Injectable()
export class MediaService implements IMediaService {
  constructor(
    private prisma: DatabaseService,
    private storageService: StorageService,
  ) {}

  async createMany(articleId, data: CreateMediaItemDto[]) {
    return await this.prisma.mediaItem.createMany({
      data: data.map((item) => ({
        articleId: articleId,
        index: item.index,
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

  fromSession(sessionId: string) {
    return this.prisma.mediaItem.findMany({
      where: { sessionId },
    });
  }

  async attachToArticle(mediaId: string, articleId: string) {
    return this.prisma.article.update({
      where: { id: articleId },
      data: {
        mediaItems: {
          connect: { id: mediaId },
        },
      },
      include: {
        mediaItems: true,
      },
    });
  }

  // Create temp image record
  async uploadTemp(file: Express.Multer.File, sessionId: string) {
    const url = `https://news.assalamjs.online/img/temp/${sessionId}/${file.filename}`;
    return await this.prisma.mediaItem.create({
      data: {
        url,
        sessionId,
        fileName: file.filename,
        fileSize: file.size,
        mimeType: file.mimetype,
        alt: '',
        caption: '',
      },
    });
  }

  async makePermanent(sessionId: string, articleId: string) {
    // Find all temp images for this session
    const tempImages = await this.prisma.image.findMany({
      where: {
        sessionId,
        articleId: null,
      },
    });

    // Create a mapping of old URLs to new URLs
    const urlMapping = new Map<string, string>();

    // Move each image to permanent storage and update records
    const updates = tempImages.map(async (image) => {
      const newPath = `articles/${articleId}/images/${image.path.split('/').pop()}`;

      // Move file in storage
      const newUrl = await this.storageService.move(image.path, newPath);

      // Store the URL mapping
      urlMapping.set(image.url, newUrl);

      // Update image record
      return this.prisma.image.update({
        where: { id: image.id },
        data: {
          url: newUrl,
          path: newPath,
          articleId,
          sessionId: null,
        },
      });
    });

    await Promise.all(updates);

    // Update article content with new URLs
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (article && article.content) {
      const updatedContent = this.replaceImageUrls(article.content, urlMapping);

      await this.prisma.article.update({
        where: { id: articleId },
        data: {
          content: updatedContent,
        },
      });
    }
  }

  async cleanupTempFiles(sessionId: string) {
    const tempImages = await this.prisma.mediaItem.findMany({
      where: {
        sessionId,
        articleId: null,
      },
    });

    // Delete files from storage and database
    await Promise.all(
      tempImages.map(async (image) => {
        this.storageService.deleteImage(image.url);
        await this.prisma.mediaItem.delete({
          where: { id: image.id },
        });
      }),
    );
  }

  private replaceImageUrls(content: any, urlMapping: Map<string, string>): any {
    // If content is an array (Plate.js content is an array of nodes)
    if (Array.isArray(content)) {
      return content.map((node) => this.replaceImageUrls(node, urlMapping));
    }

    // If content is an object
    if (content && typeof content === 'object') {
      const newContent = { ...content };

      // Replace URL in image elements
      if (
        content.type === 'image' &&
        content.url &&
        urlMapping.has(content.url)
      ) {
        newContent.url = urlMapping.get(content.url);
      }

      // Recursively process all object properties
      for (const key in newContent) {
        if (Object.prototype.hasOwnProperty.call(newContent, key)) {
          newContent[key] = this.replaceImageUrls(newContent[key], urlMapping);
        }
      }

      return newContent;
    }

    // Return primitive values as is
    return content;
  }
}
