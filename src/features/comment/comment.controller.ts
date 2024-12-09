import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';
import { ICommentController } from '@/shared/interfaces/comment.interface';
import { ResponseError, ResponseSuccess } from '@/common/response/response';
import {
  PaginatedResponse,
  PaginationParams,
} from '@/shared/utils/pagination.util';

@ApiTags('Comments')
@Controller('comment')
export class CommentController implements ICommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment or reply' })
  @ApiBody({ description: 'Comment data', type: CreateCommentDto })
  @ApiResponse({
    status: 201,
    description: 'Comment has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Req() req, @Body() data: CreateCommentDto) {
    try {
      const comment = await this.commentService.createComment(
        req.user.id,
        data,
      );
      return new ResponseSuccess<Comment>(
        HttpStatus.CREATED, // HTTP 201
        'Comment created successfully',
        comment,
      );
    } catch (error) {
      return new ResponseError<Comment>(
        HttpStatus.BAD_REQUEST, // HTTP 400
        'Failed to create comment',
        [{ message: error.message }], // Error details
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID with nested replies' })
  @ApiParam({ name: 'id', description: 'ID of the comment to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Comment retrieved successfully',
    type: Comment,
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findOne(@Param('id') id: string) {
    try {
      const comment = await this.commentService.findCommentById(id);
      if (!comment) {
        return new ResponseError<Comment>(
          HttpStatus.NOT_FOUND, // HTTP 404
          'Comment not found',
          [{ message: `Comment with id ${id} does not exist` }], // Error details
        );
      }
      return new ResponseSuccess<Comment>(
        HttpStatus.OK, // HTTP 200
        'Comment retrieved successfully',
        comment,
      );
    } catch (error) {
      return new ResponseError<Comment>(
        HttpStatus.INTERNAL_SERVER_ERROR, // HTTP 500
        'Failed to retrieve comment',
        [{ message: error.message }],
      );
    }
  }

  @Get('/article/:articleId')
  @ApiOperation({
    summary: 'Get all top-level comments for a specific article',
  })
  @ApiParam({ name: 'articleId', description: 'ID of the article' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
    type: [Comment],
  })
  async getCommentsByArticle(
    @Param('articleId') articleId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const params: PaginationParams = {
      page,
      limit,
      orderBy: 'createdAt',
      order: 'desc',
    };
    try {
      const comments = await this.commentService.getCommentsByArticle(
        articleId,
        params,
      );
      if (comments.data.length === 0) {
        return new ResponseError<any>(
          HttpStatus.NOT_FOUND, // HTTP 404
          'Comments not found',
          [{ message: `Theres no comments in this article` }],
        );
      }
      return new ResponseSuccess<PaginatedResponse<Comment>>(
        HttpStatus.OK, // HTTP 200
        'Comments retrieved successfully',
        comments,
      );
    } catch (error) {
      return new ResponseError<Comment[]>(
        HttpStatus.INTERNAL_SERVER_ERROR, // HTTP 500
        'Failed to retrieve comments',
        [{ message: error.message }],
      );
    }
  }

  // Update a comment
  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'id', description: 'ID of the comment to update' })
  @ApiBody({ description: 'Updated comment data', type: UpdateCommentDto })
  @ApiResponse({
    status: 200,
    description: 'Comment has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async updateComment(
    @Req() req,
    @Param('commentId') commentId: string,
    @Body() data: UpdateCommentDto,
  ) {
    try {
      const comment = await this.commentService.updateComment(
        req.user.id,
        commentId,
        data,
      );
      if (!comment) {
        return new ResponseError<Comment>(
          HttpStatus.NOT_FOUND, // HTTP 404
          'Comment not found',
          [{ message: `Comment with id ${commentId} does not exist` }],
        );
      }
      return new ResponseSuccess<Comment>(
        HttpStatus.OK, // HTTP 200
        'Comment updated successfully',
        comment,
      );
    } catch (error) {
      return new ResponseError<Comment>(
        HttpStatus.INTERNAL_SERVER_ERROR, // HTTP 500
        'Failed to update comment',
        [{ message: error.message }],
      );
    }
  }

  // Delete a comment by ID
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiParam({ name: 'id', description: 'ID of the comment to delete' })
  @ApiResponse({
    status: 204,
    description: 'Comment has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async deleteComment(@Req() req, @Param('commentId') commentId: string) {
    try {
      const deletedComment = await this.commentService.deleteComment(
        req.user.id,
        commentId,
      );
      if (!deletedComment) {
        return new ResponseError<Comment>(
          HttpStatus.NOT_FOUND, // HTTP 404
          'Comment not found',
          [{ message: `Comment with id ${commentId} does not exist` }],
        );
      }
      return new ResponseSuccess<Comment>(
        HttpStatus.OK, // HTTP 200
        'Comment deleted successfully',
        deletedComment,
      );
    } catch (error) {
      return new ResponseError<Comment>(
        HttpStatus.INTERNAL_SERVER_ERROR, // HTTP 500
        'Failed to delete comment',
        [{ message: error.message }],
      );
    }
  }

  @Post('reply')
  async createReply(@Req() req, @Body() dto: CreateCommentDto) {
    return this.commentService.createReply(req.user.id, dto);
  }

  @Get('/nested/:articleId')
  async getNestedComments(
    @Param('articleId') articleId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const params: PaginationParams = {
      page,
      limit,
      orderBy: 'createdAt',
      order: 'desc',
    };
    return this.commentService.getNestedComments(articleId, params);
  }

  @Get('/:commentId/replies')
  async getReplies(@Param('commentId') commentId: string) {
    return this.commentService.getRepliesForComment(commentId);
  }
}
