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
  /**
   * @apiMethod Post
   * @endpoint ''
   */
  create(
    data: CreateArticleDto,
    mediaFiles: CreateMediaItemDto[],
    req: Request,
  ): Promise<ResponseSuccess<Article> | ResponseError<any>>;
  /**
   * @apiMethod Put
   * @endpoint ':id'
   */
  update(
    articleId: number,
    data: UpdateArticleDto,
    userId: string,
  ): Promise<ResponseSuccess<Article> | ResponseError<any>>;
  /**
   * @apiMethod Get
   * @endpoint ''
   */
  findAll(
    params: ArticleQueryParams,
    status?: string,
    authorId?: string,
  ): Promise<ResponseSuccess<PaginatedResponse<Article>> | ResponseError<any>>;
  /**
   * @endpoint ':id'
   */
  findOne(
    articleId: number,
  ): Promise<ResponseSuccess<Article> | ResponseError<any>>;
  /**
   * @apiMethod Get
   * @endpoint 'headlines'
   */
  getHeadlines(): Promise<
    | ResponseSuccess<{
        headline: Article;
        topArticlesByCategory: { category: string; articles: Article[] }[];
      }>
    | ResponseError<any>
  >;
  /**
   * @apiMethod Get
   * @endpoint 'top-articles'
   */
  getHotArticles(): Promise<ResponseSuccess<Article[]> | ResponseError<any>>;
  /**
   * @apiMethod Delete
   * @endpoint ':id'
   */
  remove(articleId: number): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Post
   * @endpoint ':id/publish'
   */
  publish(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Post
   * @endpoint ':id/save-draft'
   */
  saveDraft(
    articleId: number,
    data: Prisma.ArticleUpdateInput,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Put
   * @endpoint ':id/tags'
   */
  updateTags(
    articleId: number,
    tags: string[],
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Post
   * @endpoint ':id/media'
   */
  uploadMedia(
    articleId: number,
    fileData: any,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Get
   * @endpoint ':id/media'
   */
  getMedia(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Get
   * @endpoint ':id/comments'
   */
  getComments(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Post
   * @endpoint ':id/comments'
   */
  addComment(
    articleId: number,
    data: Prisma.CommentCreateInput,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Post
   * @endpoint ':id/like'
   */
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
  /**
   * @apiMethod Get
   * @endpoint ':id/likes'
   */
  getLikesCount(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Get
   * @endpoint ':id/metadata'
   */
  getMetadata(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Put
   * @endpoint ':id/metadata'
   */
  updateMetadata(
    articleId: number,
    data: Prisma.ArticleMetadataUpdateInput,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Get
   * @endpoint ':id/views'
   */
  getViews(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Post
   * @endpoint ':id/views'
   */
  trackView(
    articleId: number,
    userId?: string,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Get
   * @endpoint ':id/engagement'
   */
  getEngagementMetrics(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Post
   * @endpoint 'bulk-fetch'
   */
  bulkFetch(ids: number[]): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Put
   * @endpoint 'bulk-update'
   */
  bulkUpdate(
    updates: { id: number; data: Prisma.ArticleUpdateInput }[],
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @apiMethod Delete
   * @endpoint 'bulk-delete'
   */
  bulkDelete(ids: number[]): Promise<ResponseSuccess<any> | ResponseError<any>>;
}
