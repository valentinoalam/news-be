import { CreateArticleDto } from '@/features/articles/dto/create-article.dto';
import { UpdateArticleDto } from '@/features/articles/dto/update-article.dto';
import { Prisma } from '@prisma/client';
import { PaginatedResponse, PaginationParams } from '../utils/pagination.util';
import { Article } from '@/features/articles/entities/article.entity';
import { ResponseSuccess, ResponseError } from '@/common/response/response';
import { CreateMediaItemDto } from '@/features/media/dto/create-media.dto';

export interface ArticleQueryParams extends PaginationParams {
  status: string;
  authorId: string;
}
export interface IArticleService {
  create(data: CreateArticleDto, authorId: string): Promise<Article>;
  updateContent(articleId: number, content: any): void;
  update(articleId: number, data: UpdateArticleDto, userId: string): void;
  updateArticle(
    articleId: number,
    updateData: UpdateArticleDto,
    userId: string,
  ): void;
  createRevision(articleId: number, originalArticle: any): void;
  fetchArticlesByCategory(categoryId: number): Promise<Article[]>;
  findAll(params: ArticleQueryParams): Promise<PaginatedResponse<Article>>;
  findOne(articleId: number): Promise<Article>;
  getTopArticles(): void;
  remove(articleId: number): void;
  publish(articleId: number): void;
  saveDraft(articleId: number, data: Prisma.ArticleUpdateInput): void;
  updateTags(articleId: number, tags: string[]): void;
  addMedia(articleId: number, fileData: any): void;
  getMedia(articleId: number): void;
  getComments(articleId: number): void;
  addComment(articleId: number, data: Prisma.CommentCreateInput): void;
  addLike(articleId: number, userId: string): void;
  getLikesCount(articleId: number): void;
  getMetadata(articleId: number): void;
  updateMetadata(
    articleId: number,
    data: Prisma.ArticleMetadataUpdateInput,
  ): void;
  getViews(articleId: number): void;
  trackView(articleId: number, userId?: string): void;
  getEngagementMetrics(articleId: number): void;
  bulkFetch(ids: number[]): void;
  bulkUpdate(updates: { id: number; data: Prisma.ArticleUpdateInput }[]): void;
  bulkDelete(ids: number[]): void;
}
export interface IArticleController {
  create(
    data: CreateArticleDto,
    mediaFiles: CreateMediaItemDto[],
    req: Request,
  ): Promise<ResponseSuccess<Article> | ResponseError<any>>;
  update(
    articleId: number,
    data: UpdateArticleDto,
    userId: string,
  ): Promise<ResponseSuccess<Article> | ResponseError<any>>;
  findAll(
    params: ArticleQueryParams,
    status?: string,
    authorId?: string,
  ): Promise<ResponseSuccess<PaginatedResponse<Article>> | ResponseError<any>>;
  findOne(
    articleId: number,
  ): Promise<ResponseSuccess<Article> | ResponseError<any>>;
  getHeadlines(): Promise<
    | ResponseSuccess<{
        headline: Article;
        topArticlesByCategory: { category: string; articles: Article[] }[];
      }>
    | ResponseError<any>
  >;
  getHotArticles(): Promise<ResponseSuccess<Article[]> | ResponseError<any>>;
  remove(articleId: number): Promise<ResponseSuccess<any> | ResponseError<any>>;
  publish(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  saveDraft(
    articleId: number,
    data: Prisma.ArticleUpdateInput,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  updateTags(
    articleId: number,
    tags: string[],
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  // addMedia(
  //   articleId: number,
  //   fileData: any,
  // ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  getMedia(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  getComments(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  addComment(
    articleId: number,
    data: Prisma.CommentCreateInput,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  addLike(
    articleId: number,
    userId: string,
  ): Promise<
    | ResponseSuccess<{
        userId: string;
        articleId: number;
        createdAt: Date;
      }>
    | ResponseError<any>
  >;
  getLikesCount(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  getMetadata(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  updateMetadata(
    articleId: number,
    data: Prisma.ArticleMetadataUpdateInput,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  getViews(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  trackView(
    articleId: number,
    userId?: string,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  getEngagementMetrics(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  bulkFetch(ids: number[]): Promise<ResponseSuccess<any> | ResponseError<any>>;
  bulkUpdate(
    updates: { id: number; data: Prisma.ArticleUpdateInput }[],
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  bulkDelete(ids: number[]): Promise<ResponseSuccess<any> | ResponseError<any>>;
}
