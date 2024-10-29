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

@Injectable()
export class ArticleService {
  remove(id: string) {
    console.log(id);
    throw new Error('Method not implemented.');
  }
  constructor(private db: DatabaseService) {}

  async create(data: CreateArticleDto, authorId: string) {
    const { categoryId, ...rest } = data;
    return this.db.article.create({
      data: {
        ...rest,
        slug: slugify(rest.title),
        author: {
          connect: { id: authorId },
        },
        category: {
          connect: { id: categoryId },
        },
        tags: {
          connect: rest.tags.map((id) => ({ id })),
        },
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });
  }
  async updateArticle(
    articleId: string,
    updateData: UpdateArticleDto,
    userId: string,
  ) {
    // Ambil artikel asli sebelum diperbarui
    const originalArticle = await this.db.article.findUnique({
      where: { id: articleId },
    });

    if (!originalArticle) throw new Error('Article not found');

    // Simpan revisi dari artikel asli
    await this.createRevision(articleId, originalArticle);

    // Update artikel dengan data baru
    return await this.update(articleId, updateData, userId);
  }

  async update(id: string, data: UpdateArticleDto, userId: any) {
    return this.db.article.update({
      where: { id },
      data: {
        ...data,
        updatedById: userId,
        slug: data.title ? slugify(data.title) : undefined,
        tags: data.tags
          ? {
              set: data.tags.map((id) => ({ id })),
            }
          : undefined,
      },
    });
  }

  async createRevision(articleId: string, data: any) {
    const article = await this.db.article.findUnique({
      where: { id: articleId },
      include: { revisions: true },
    });

    const newVersion = (article.revisions.length || 0) + 1;

    return this.db.articleRevision.create({
      data: {
        articleId,
        version: newVersion,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        createdBy: data.updatedById ? data.updatedById : data.authorId,
        changeLog: data.changeLog,
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
}
