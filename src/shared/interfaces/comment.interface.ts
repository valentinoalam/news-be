import {
  PaginatedResponse,
  PaginationParams,
} from './../utils/pagination.util';
import { ResponseSuccess, ResponseError } from '@/common/response/response';
import { CreateCommentDto } from '@/features/comment/dto/create-comment.dto';
import { UpdateCommentDto } from '@/features/comment/dto/update-comment.dto';
import { Comment } from '@/features/comment/entities/comment.entity';
export interface ICommentService {
  // Create a new comment or reply
  createComment(userId: string, data: CreateCommentDto): Promise<Comment>;
  // Find a comment by ID, with nested replies
  findCommentById(id: string): Promise<Comment | null>;
  // Find all comments for a specific article, including nested replies
  getCommentsByArticle(
    articleId: number,
    params: PaginationParams,
  ): Promise<PaginatedResponse<Comment>>;
  // Update a comment
  updateComment(
    userId: string,
    commentId: string,
    data: UpdateCommentDto,
  ): Promise<Comment | null>;
  // Delete a comment by ID
  deleteComment(userId: string, id: string): Promise<any>;
  createReply(userId: string, dto: CreateCommentDto): Promise<Comment>;
  getCommentDepth(commentId: string, currentDepth: number): Promise<number>;
  getNestedComments(articleId: number, params: PaginationParams);
  getRepliesForComment(commentId: string): Promise<Comment[]>;
}

export interface ICommentController {
  // Create a new comment or reply
  create(
    req: Request,
    data: CreateCommentDto,
  ): Promise<ResponseSuccess<Comment> | ResponseError<any>>;
  // Get a specific comment by ID, with nested replies
  findOne(id: string): Promise<ResponseSuccess<Comment> | ResponseError<any>>;
  // Get all top-level comments for a specific article, including nested replies
  getCommentsByArticle(
    articleId: number,
    page?: number,
    limit?: number,
  ): Promise<ResponseSuccess<PaginatedResponse<Comment>> | ResponseError<any>>;
  // Update a comment
  updateComment(
    req: Request,
    commentId: string,
    data: UpdateCommentDto,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  // Delete a comment by ID
  deleteComment(
    req: Request,
    commentId: string,
  ): Promise<ResponseSuccess<Comment> | ResponseError<any>>;
  getNestedComments(
    articleId: number,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<Comment>>;
  createReply(req: Request, dto: CreateCommentDto): Promise<Comment>;
  getReplies(commentId: string): Promise<Comment[]>;
}
