import { ResponseSuccess, ResponseError } from '@/common/response/response';
import { CreateCommentDto } from '@/features/comment/dto/create-comment.dto';
import { UpdateCommentDto } from '@/features/comment/dto/update-comment.dto';
import { Comment } from '@/features/comment/entities/comment.entity';
export interface ICommentService {
  createComment(data: CreateCommentDto): Promise<Comment>;
  findCommentById(id: string): Promise<Comment | null>;
  findCommentsByArticle(articleId: string): Promise<Comment[]>;
  updateComment(id: string, data: UpdateCommentDto): Promise<Comment | null>;
  deleteComment(id: string): Promise<Comment>;
}

export interface ICommentController {
  create(
    data: CreateCommentDto,
  ): Promise<ResponseSuccess<Comment> | ResponseError<Comment>>;
  findOne(
    id: string,
  ): Promise<ResponseSuccess<Comment> | ResponseError<Comment>>;
  findByArticle(
    articleId: string,
  ): Promise<ResponseSuccess<Comment[]> | ResponseError<Comment[]>>;
  update(
    id: string,
    data: UpdateCommentDto,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  remove(
    id: string,
  ): Promise<ResponseSuccess<Comment> | ResponseError<Comment>>;
}
