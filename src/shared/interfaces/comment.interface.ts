import { ResponseSuccess, ResponseError } from '@/common/response/response';
import { CreateCommentDto } from '@/features/comment/dto/create-comment.dto';
import { UpdateCommentDto } from '@/features/comment/dto/update-comment.dto';
import { Comment } from '@/features/comment/entities/comment.entity';
export interface ICommentService {
  // Create a new comment or reply
  createComment(data: CreateCommentDto): Promise<Comment>;
  // Find a comment by ID, with nested replies
  findCommentById(id: string): Promise<Comment | null>;
  // Find all comments for a specific article, including nested replies
  findCommentsByArticle(articleId: number): Promise<Comment[]>;
  // Update a comment
  updateComment(id: string, data: UpdateCommentDto): Promise<Comment | null>;
  // Delete a comment by ID
  deleteComment(id: string): Promise<Comment>;
}

export interface ICommentController {
  // Create a new comment or reply
  create(
    data: CreateCommentDto,
  ): Promise<ResponseSuccess<Comment> | ResponseError<Comment>>;
  // Get a specific comment by ID, with nested replies
  findOne(
    id: string,
  ): Promise<ResponseSuccess<Comment> | ResponseError<Comment>>;
  // Get all top-level comments for a specific article, including nested replies
  findByArticle(
    articleId: number,
  ): Promise<ResponseSuccess<Comment[]> | ResponseError<Comment[]>>;
  // Update a comment
  update(
    id: string,
    data: UpdateCommentDto,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  // Delete a comment by ID
  remove(
    id: string,
  ): Promise<ResponseSuccess<Comment> | ResponseError<Comment>>;
}
