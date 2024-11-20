import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { slugify } from '@/shared/utils/slugify.util';
import { DatabaseService } from 'src/core/database/database.service';
import {
  getPaginatedData,
  getPaginationParams,
  PaginationParams,
} from '@/shared/utils/pagination.util';
import { MediaService } from '../media/media.service';
import { CreateMediaItemDto } from '../media/dto/create-media.dto';
import { Prisma } from '@prisma/client';

interface ArticleQueryParams extends PaginationParams {
  status: string;
  authorId: string;
}

@Injectable()
export class ArticleService {
  constructor(
    private media: MediaService,
    private db: DatabaseService,
  ) {}

  // Create new article with optional media upload handling
  async create(data: CreateArticleDto, authorId: string) {
    const { categoryId, mediaFiles, imageIds, ...rest } = data;
    const dataOut = {
      status: false,
      message: '',
      data: null,
      logs: {},
    };
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
          slug: slugify(rest.title),
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
      if (mediaFiles.length) {
        const mediaItems: CreateMediaItemDto[] = mediaFiles.map((item) => ({
          file: item.file,
          isFeatured: data.featuredImage === item.file.filename,
          alt: item.alt || '',
          caption: item.caption || '',
          index: item.index || 0,
        }));
        dataOut.data.mediaItems = await this.media.createMany(
          article.id,
          mediaItems,
        );
      }
      dataOut.status = true;
      dataOut.message = 'Article created successfully';
      dataOut.data.article = article;
      dataOut.logs = {
        timestamp: new Date().toISOString(),
        action: 'createArticle',
        authorId,
      };
      return dataOut;
    } catch (error) {
      dataOut.message = 'Failed to create article';
      dataOut.logs = {
        error: error.message,
        timestamp: new Date().toISOString(),
        action: 'createArticle',
        authorId,
      };
      return dataOut;
    }
  }

  // Add method to update content with new image URLs
  async updateContent(id: string, content: any) {
    return this.db.article.update({
      where: { id },
      data: { content },
      include: { mediaItems: true },
    });
  }

  // Update article details
  async update(id: string, data: UpdateArticleDto, userId: string) {
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
          slug: data.title ? slugify(data.title) : undefined,
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
    articleId: string,
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

  async createRevision(articleId: string, originalArticle: any) {
    const article = await this.db.article.findUnique({
      where: { id: articleId },
      include: { revisions: true },
    });

    const newVersion = (article.revisions.length || 0) + 1;

    return this.db.articleRevision.create({
      data: {
        articleId,
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

  // Fetch articles by category
  async fetchArticlesByCategory(categoryId: string) {
    return this.db.article.findMany({
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
    const paginatedArticles = await getPaginatedData(
      this.db,
      'article',
      query,
      params.page,
      limit,
      skip,
    );
    return paginatedArticles;
  }

  async findOne(id: string) {
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

  async remove(id: string) {
    return this.db.article.delete({
      where: { id },
    });
  }

  // Content Management
  async publish(id: string) {
    return this.db.article.update({
      where: { id },
      data: {
        status: 'Published',
        publishedAt: new Date(),
      },
    });
  }

  async saveDraft(id: string, data: Prisma.ArticleUpdateInput) {
    return this.db.article.update({
      where: { id },
      data: {
        ...data,
        status: 'Draft',
      },
    });
  }

  async updateTags(id: string, tags: string[]) {
    return this.db.articleMetadata.update({
      where: { id },
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
  async addMedia(id: string, fileData: any) {
    return this.db.mediaItem.create({
      data: {
        ...fileData,
        article: {
          connect: { id },
        },
      },
    });
  }

  async getMedia(id: string) {
    return this.db.mediaItem.findMany({
      where: {
        articleId: id,
      },
    });
  }

  // Comments and Interactions
  async getComments(id: string) {
    return this.db.comment.findMany({
      where: {
        articleId: id,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async addComment(id: string, data: Prisma.CommentCreateInput) {
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

  async addLike(id: string, userId: string) {
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

  async getLikesCount(id: string) {
    return this.db.like.count({
      where: {
        articleId: id,
      },
    });
  }

  // SEO and Metadata
  async getMetadata(id: string) {
    return this.db.articleMetadata.findUnique({
      where: {
        articleId: id,
      },
    });
  }

  async updateMetadata(id: string, data: Prisma.ArticleMetadataUpdateInput) {
    return this.db.articleMetadata.update({
      where: {
        articleId: id,
      },
      data,
    });
  }

  // Analytics
  async getViews(id: string) {
    return this.db.view.count({
      where: {
        articleId: id,
      },
    });
  }

  async trackView(id: string, userId?: string) {
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

  async getEngagementMetrics(id: string) {
    const [likes, comments, views, articleData] = await Promise.all([
      this.db.like.count({ where: { articleId: id } }),
      this.db.comment.count({ where: { articleId: id } }),
      this.db.view.count({ where: { articleId: id } }),
      this.db.article.findUnique({
        where: { id },
        select: { clickTimes: true },
      }),
    ]);
    const { clickTimes = 0 } = articleData || {};
    return { likes, comments, views, clicks: clickTimes };
  }

  // Bulk Operations
  async bulkFetch(ids: string[]) {
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

  async bulkUpdate(updates: { id: string; data: Prisma.ArticleUpdateInput }[]) {
    const transactions = updates.map(({ id, data }) =>
      this.db.article.update({
        where: { id },
        data,
      }),
    );

    return this.db.$transaction(transactions);
  }

  async bulkDelete(ids: string[]) {
    return this.db.article.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
