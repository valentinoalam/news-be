import { Injectable } from '@nestjs/common';
import { CreateMediaItemDto } from './dto/create-media.dto';
// import { UpdateMediaDto } from './dto/update-media.dto';
import { DatabaseService } from 'src/core/database/database.service';
import { StorageService } from './storage/storage.service';

@Injectable()
export class MediaService {
  constructor(
    private prisma: DatabaseService,
    private storageService: StorageService,
  ) {}

  async createMany(articleId, data: CreateMediaItemDto[]) {
    return this.prisma.mediaItem.createMany({
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

  async uploadTemp(file: Express.Multer.File, sessionId: string) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const tempPath = `temp/${sessionId}/${fileName}`;

    // Upload to storage
    const url = await this.storageService.upload(file.buffer, tempPath);

    // Create temp image record
    const image = await this.prisma.mediaItem.create({
      data: {
        url,
        sessionId,
        tempId: sessionId,
      },
    });

    return image;
  }

  async makePermanent(sessionId: string, articleId: string) {
    // Find all temp images for this session
    const tempImages = await this.prisma.mediaItem.findMany({
      where: {
        sessionId,
        articleId: null,
      },
    });

    // Move each image to permanent storage and update records
    const updates = tempImages.map(async (image) => {
      const newPath = `articles/${articleId}/images/${image.path.split('/').pop()}`;

      // Move file in storage
      const newUrl = await this.storageService.move(image.path, newPath);

      // Update image record
      return this.prisma.mediaItem.update({
        where: { id: image.id },
        data: {
          url: newUrl,
          path: newPath,
          articleId,
          sessionId: null,
          tempId: null,
        },
      });
    });

    await Promise.all(updates);
  }

  async makePermanent3(sessionId: string, articleId: string) {
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
          tempId: null,
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
  async makePermanent1(sessionId: string, articleId: string) {
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
      return this.prisma.mediaItem.update({
        where: { id: image.id },
        data: {
          url: newUrl,
          path: newPath,
          articleId,
          sessionId: null,
          tempId: null,
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
        await this.storageService.deleteImage(image.path);
        await this.prisma.mediaItem.delete({
          where: { id: image.id },
        });
      }),
    );
  }
}
