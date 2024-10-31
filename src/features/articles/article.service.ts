import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { slugify } from '@/shared/utils/slugify.utils';
import { DatabaseService } from 'src/core/database/database.service';
import {
  getPaginatedData,
  getPaginationParams,
  PaginationParams,
} from '@/shared/utils/pagination.utils';
import { MediaService } from '../media/media.service';
import { CreateMediaItemDto } from '../media/dto/create-media.dto';

@Injectable()
export class ArticleService {
  constructor(
    private media: MediaService,
    private db: DatabaseService,
  ) {}

  // Create new article with optional media upload handling
  async create(data: CreateArticleDto, authorId: string) {
    const { categoryId, mediaFiles, ...rest } = data;
    const dataOut = {
      status: false,
      message: '',
      data: null,
      logs: {},
    };
    try {
      // Create the article in the database
      const article = await this.db.article.create({
        data: {
          ...rest,
          slug: slugify(rest.title),
          author: { connect: { id: authorId } },
          category: { connect: { id: categoryId } },
          tags: rest.tags
            ? {
                connect: rest.tags.map((id) => ({ id })),
              }
            : undefined,
        },
      });
      if (mediaFiles.length) {
        const mediaItems: CreateMediaItemDto[] = mediaFiles.map((item) => ({
          file: item.file,
          isFeatured: data.featuredImage === item.file.filename,
          alt: item.alt || '',
          caption: item.caption || '',
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
          tags: data.tags
            ? {
                set: data.tags.map((id) => ({ id })),
              }
            : undefined,
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
        tags: true,
        category: true,
        mediaItems: true,
      },
    });
  }

  async findAll(params: PaginationParams) {
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
    return this.db.article.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        tags: true,
        metadata: true,
        revisions: true,
      },
    });
  }

  async getTopArticles() {
    // Query untuk memilih satu artikel dengan view terbanyak sebagai headline
    const headlineArticle = await this.db.article.findFirst({
      orderBy: {
        viewCount: 'desc',
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
          orderBy: [{ viewCount: 'desc' }, { createdAt: 'desc' }],
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

  remove(id: string) {
    console.log(id);
    throw new Error('Method not implemented.');
  }
}
