import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { slugify } from '@/shared/utils/slugify.utils';
import { DatabaseService } from 'src/core/database/database.service';
import { PaginationParams } from '@/shared/utils/pagination.utils';

@Injectable()
export class ArticleService {
  remove(id: string) {
    console.log(id);
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: DatabaseService) {}

  async create(data: CreateArticleDto, authorId: string) {
    return this.prisma.article.create({
      data: {
        ...data,
        slug: slugify(data.title),
        author: {
          connect: { id: authorId },
        },
        categories: {
          connect: data.categoryIds.map((id) => ({ id })),
        },
        tags: {
          connect: data.tagIds.map((id) => ({ id })),
        },
      },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    });
  }

  async createRevision(
    articleId: string,
    data: UpdateArticleDto,
    userId: string,
  ) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
      include: { revisions: true },
    });

    const newVersion = (article.revisions.length || 0) + 1;

    return this.prisma.articleRevision.create({
      data: {
        articleId,
        version: newVersion,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        createdBy: userId,
        changeLog: data.changeLog,
      },
    });
  }

  async findAll(params: PaginationParams) {
    console.log(params);
    return this.prisma.article.findMany({
      include: {
        author: true,
        categories: true,
        tags: true,
        metadata: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
        categories: true,
        tags: true,
        metadata: true,
        revisions: true,
      },
    });
  }

  async update(id: string, data: UpdateArticleDto, userId: any) {
    return this.prisma.article.update({
      where: { id },
      data: {
        ...data,
        updatedById: userId,
        slug: data.title ? slugify(data.title) : undefined,
        categories: data.categoryIds
          ? {
              set: data.categoryIds.map((id) => ({ id })),
            }
          : undefined,
        tags: data.tagIds
          ? {
              set: data.tagIds.map((id) => ({ id })),
            }
          : undefined,
      },
    });
  }
}
