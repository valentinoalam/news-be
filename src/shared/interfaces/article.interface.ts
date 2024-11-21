import { CreateArticleDto } from '@/features/articles/dto/create-article.dto';
import { UpdateArticleDto } from '@/features/articles/dto/update-article.dto';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../utils/pagination.util';
import { Article } from '@/features/articles/entities/article.entity';

export interface ArticleQueryParams extends PaginationParams {
  status: string;
  authorId: string;
}
export interface IArticleService {
  create(data: CreateArticleDto, authorId: string): Promise<Article>;
  updateContent(id: string, content: any): void;
  update(id: string, data: UpdateArticleDto, userId: string): void;
  updateArticle(
    articleId: string,
    updateData: UpdateArticleDto,
    userId: string,
  ): void;
  createRevision(articleId: string, originalArticle: any): void;
  fetchArticlesByCategory(categoryId: string): void;
  findAll(params: ArticleQueryParams): void;
  findOne(id: string): void;
  getTopArticles(): void;
  remove(id: string): void;
  publish(id: string): void;
  saveDraft(id: string, data: Prisma.ArticleUpdateInput): void;
  updateTags(id: string, tags: string[]): void;
  addMedia(id: string, fileData: any): void;
  getMedia(id: string): void;
  getComments(id: string): void;
  addComment(id: string, data: Prisma.CommentCreateInput): void;
  addLike(id: string, userId: string): void;
  getLikesCount(id: string): void;
  getMetadata(id: string): void;
  updateMetadata(id: string, data: Prisma.ArticleMetadataUpdateInput): void;
  getViews(id: string): void;
  trackView(id: string, userId?: string): void;
  getEngagementMetrics(id: string): void;
  bulkFetch(ids: string[]): void;
  bulkUpdate(updates: { id: string; data: Prisma.ArticleUpdateInput }[]): void;
  bulkDelete(ids: string[]): void;
}
