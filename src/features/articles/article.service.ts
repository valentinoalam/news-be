import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { DatabaseService } from 'src/core/database/database.service';
import {
  getPaginatedData,
  getPaginationParams,
  PaginatedResponse,
} from '@/shared/utils/pagination.util';
import { MediaService } from '../media/media.service';
import { CreateMediaItemDto } from '../media/dto/create-media.dto';
import { Prisma } from '@prisma/client';
import {
  ArticleQueryParams,
  IArticleService,
} from '@/shared/interfaces/article.interface';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService implements IArticleService {
  constructor(
    private media: MediaService,
    private db: DatabaseService,
  ) {}

  // Create new article with optional media upload handling
  async create(data: CreateArticleDto, authorId: string) {
    const { categoryId, mediaFiles, imageIds, ...rest } = data;

    // Validate that all referenced images exist
    if (imageIds?.length) {
      const images = await this.db.mediaItem.findMany({
        where: {
          id: {
            in: imageIds,
          },
        },
      });

      if (images.length !== imageIds.length) {
        throw new NotFoundException('Some referenced images were not found');
      }
    }

    try {
      // Create the article in the database
      const article = await this.db.article.create({
        data: {
          ...rest,
          author: { connect: { id: authorId } },
          category: { connect: { id: categoryId } },
          metadata: {
            create: {
              keywords: rest.tags
                ? {
                    connectOrCreate: rest.tags.map((tag) => ({
                      where: { name: tag }, // Check if the tag already exists
                      create: { name: tag }, // Create it if it does not exist
                    })),
                  }
                : undefined,
            },
          },
          mediaItems: {
            connect: imageIds?.map((id) => ({ id })) || [],
          },
        },
        include: {
          mediaItems: true,
        },
      });

      // Handle media files if any
      if (mediaFiles.length) {
        const mediaItems: CreateMediaItemDto[] = mediaFiles.map((item) => ({
          file: item.file,
          isFeatured: data.featuredImage === item.file.filename,
          alt: item.alt || '',
          caption: item.caption || '',
          index: item.index || 0,
        }));
        await this.media.createMany(article.id, mediaItems);
      }

      return article; // Return the created article for response handling in controller
    } catch (error) {
      throw new Error('Failed to create article: ' + error.message); // Throw error to be handled by controller
    }
  }

  // Add method to update content with new image URLs
  async updateContent(id: number, content: any) {
    return this.db.article.update({
      where: { id },
      data: { content },
      include: { mediaItems: true },
    });
  }

  // Update article details
  async update(id: number, data: UpdateArticleDto, userId: string) {
    const { mediaFiles, ...updateFields } = data;
    const dataOut = {
      status: false,
      message: '',
      data: null,
      logs: {},
    };
    try {
      const updatedArticle = await this.db.article.update({
        where: { id },
        data: {
          ...updateFields,
          updatedById: userId,
        },
      });

      // Update or associate media files if provided
      if (mediaFiles?.length) {
        dataOut.data.mediaItems = await this.media.createMany(id, mediaFiles);
      }
      dataOut.status = true;
      dataOut.message = 'Article updated successfully';
      dataOut.data.article = updatedArticle;
      dataOut.logs = {
        timestamp: new Date().toISOString(),
        action: 'updateArticle',
        updatedBy: userId,
      };
      return dataOut;
    } catch (error) {
      dataOut.message = 'Failed to update article';
      dataOut.logs = {
        error: error.message,
        timestamp: new Date().toISOString(),
        action: 'updateArticle',
        userId,
      };
      return dataOut;
    }
  }
  // Update article and create a revision before updating
  async updateArticle(
    articleId: number,
    updateData: UpdateArticleDto,
    userId: string,
  ) {
    const originalArticle = await this.db.article.findUnique({
      where: { id: articleId },
    });

    if (!originalArticle) throw new Error('Article not found');

    await this.createRevision(articleId, originalArticle);

    return await this.update(articleId, updateData, userId);
  }

  async createRevision(id: number, originalArticle: any) {
    const article = await this.db.article.findUnique({
      where: { id },
      include: { revisions: true },
    });

    const newVersion = (article.revisions.length || 0) + 1;

    return this.db.articleRevision.create({
      data: {
        articleId: id,
        version: newVersion,
        title: originalArticle.title,
        content: originalArticle.content,
        excerpt: originalArticle.excerpt,
        createdBy: originalArticle.updatedById
          ? originalArticle.updatedById
          : originalArticle.authorId,
        changeLog: originalArticle.changeLog,
      },
    });
  }

  async getPopularArticles() {
    return await this.db.article.findMany({
      select: {
        id: true,
        title: true,
        clickTimes: true,
        _count: {
          select: {
            views: true,
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        views: {
          _count: 'desc',
        },
        likes: {
          _count: 'desc',
        },
      },
      take: 10,
    });
  }

  async getTopArticles() {
    // Query untuk memilih satu artikel dengan view terbanyak sebagai headline
    const headlineArticle = await this.db.article.findFirst({
      orderBy: {
        views: {
          _count: 'desc',
        },
      },
      take: 1,
    });

    // Query untuk memilih dua artikel terbaru dengan view terbanyak dari tiap kategori
    const categories = await this.db.category.findMany(); // Mendapatkan semua kategori

    const articlesByCategory = await Promise.all(
      categories.map(async (category) => {
        const articles = await this.db.article.findMany({
          where: {
            categoryId: category.id,
          },
          orderBy: [
            {
              views: {
                _count: 'desc', // Order by the count of related views
              },
            },
            {
              createdAt: 'desc', // Then order by the most recent
            },
          ],
          take: 2,
        });

        return {
          category: category.name,
          articles,
        };
      }),
    );

    return {
      headline: headlineArticle,
      topArticlesByCategory: articlesByCategory,
    };
  }

  // Fetch articles by category
  async fetchArticlesByCategory(categoryId: number) {
    return await this.db.article.findMany({
      where: { categoryId },
      include: {
        author: true,
        category: true,
        mediaItems: true,
      },
    });
  }

  async findAll(params: ArticleQueryParams) {
    const { skip, limit, orderBy } = getPaginationParams(params);
    const query = {
      include: {
        author: true,
        category: true,
        tags: true,
        metadata: true,
      },
      orderBy,
    };
    const paginatedArticles: PaginatedResponse<Article> =
      await getPaginatedData(
        this.db,
        'article',
        query,
        params.page,
        limit,
        skip,
      );
    return paginatedArticles;
  }

  async findOne(id: number) {
    const article = await this.db.article.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        mediaItems: true,
        metadata: true,
        revisions: true,
      },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return article;
  }

  async remove(id: number) {
    return this.db.article.delete({
      where: { id },
    });
  }

  // Content Management
  async publish(id: number) {
    return this.db.article.update({
      where: { id },
      data: {
        status: 'Published',
        publishedAt: new Date(),
      },
    });
  }

  async saveDraft(id: number, data: Prisma.ArticleUpdateInput) {
    return this.db.article.update({
      where: { id },
      data: {
        ...data,
        status: 'Draft',
      },
    });
  }

  async updateTags(articleId: number, tags: string[]) {
    return this.db.articleMetadata.update({
      where: { articleId },
      data: {
        keywords: {
          deleteMany: {}, // Remove all existing keyword relations for the article
          connectOrCreate: tags.map((tag) => ({
            where: { name: tag }, // Check if the tag already exists
            create: { name: tag }, // Create it if it does not exist
          })),
        },
      },
      include: {
        keywords: true, // Include updated keywords in the response
      },
    });
  }

  // Media and Attachments
  async addMedia(id: number, fileData: any) {
    return this.db.mediaItem.create({
      data: {
        ...fileData,
        article: {
          connect: { id },
        },
      },
    });
  }

  async getMedia(articleId: number) {
    return this.db.mediaItem.findMany({
      where: {
        articleId,
      },
    });
  }

  // Comments and Interactions
  async getComments(articleId: number) {
    return this.db.comment.findMany({
      where: {
        articleId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async addComment(id: number, data: Prisma.CommentCreateInput) {
    return this.db.comment.create({
      data: {
        ...data,
        article: {
          connect: { id },
        },
      },
      include: {
        author: true,
      },
    });
  }

  async addLike(id: number, userId: string) {
    return this.db.like.create({
      data: {
        article: {
          connect: { id },
        },
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async getLikesCount(articleId: number) {
    return this.db.like.count({
      where: {
        articleId,
      },
    });
  }

  // SEO and Metadata
  async getMetadata(articleId: number) {
    return this.db.articleMetadata.findUnique({
      where: {
        articleId,
      },
    });
  }

  async updateMetadata(
    articleId: number,
    data: Prisma.ArticleMetadataUpdateInput,
  ) {
    return this.db.articleMetadata.update({
      where: {
        articleId,
      },
      data,
    });
  }

  // Analytics
  async getViews(articleId: number) {
    return this.db.view.count({
      where: {
        articleId,
      },
    });
  }

  async trackView(id: number, userId?: string) {
    return this.db.view.create({
      data: {
        article: {
          connect: { id },
        },
        ...(userId && {
          user: {
            connect: { id: userId },
          },
        }),
      },
    });
  }

  async getEngagementMetrics(articleId: number) {
    const [likes, comments, views, articleData] = await Promise.all([
      this.db.like.count({ where: { articleId } }),
      this.db.comment.count({ where: { articleId } }),
      this.db.view.count({ where: { articleId } }),
      this.db.article.findUnique({
        where: { id: articleId },
        select: { clickTimes: true },
      }),
    ]);
    const { clickTimes = 0 } = articleData || {};
    return { likes, comments, views, clicks: clickTimes };
  }

  // Bulk Operations
  async bulkFetch(ids: number[]) {
    return this.db.article.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        metadata: true,
      },
    });
  }

  async bulkUpdate(updates: { id: number; data: Prisma.ArticleUpdateInput }[]) {
    const transactions = updates.map(({ id, data }) =>
      this.db.article.update({
        where: { id },
        data,
      }),
    );

    return this.db.$transaction(transactions);
  }

  async bulkDelete(ids: number[]) {
    return this.db.article.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
