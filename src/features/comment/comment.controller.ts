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
  async create(@Body() data: CreateCommentDto) {
    try {
      const comment = await this.commentService.createComment(data);
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
  async findByArticle(@Param('articleId') articleId: number) {
    try {
      const comments =
        await this.commentService.findCommentsByArticle(articleId);
      if (comments.length === 0) {
        return new ResponseError<Comment[]>(
          HttpStatus.NOT_FOUND, // HTTP 404
          'Comments not found',
          [{ message: `Theres no comments in this article` }],
        );
      }
      return new ResponseSuccess<Comment[]>(
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
  async update(@Param('id') id: string, @Body() data: UpdateCommentDto) {
    try {
      const comment = await this.commentService.updateComment(id, data);
      if (!comment) {
        return new ResponseError<Comment>(
          HttpStatus.NOT_FOUND, // HTTP 404
          'Comment not found',
          [{ message: `Comment with id ${id} does not exist` }],
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
  async remove(@Param('id') id: string) {
    try {
      const deletedComment = await this.commentService.deleteComment(id);
      if (!deletedComment) {
        return new ResponseError<Comment>(
          HttpStatus.NOT_FOUND, // HTTP 404
          'Comment not found',
          [{ message: `Comment with id ${id} does not exist` }],
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
}
