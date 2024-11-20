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
import { ResponseInterface } from '@/common/response/response.interface';

@ApiTags('Comments')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  // Create a new comment or reply
  @Post()
  @ApiOperation({ summary: 'Create a new comment or reply' })
  @ApiBody({ description: 'Comment data', type: CreateCommentDto })
  @ApiResponse({
    status: 201,
    description: 'Comment has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() data: CreateCommentDto): Promise<Comment> {
    return this.commentService.createComment(data);
  }

  // Get a specific comment by ID, with nested replies
  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID with nested replies' })
  @ApiParam({ name: 'id', description: 'ID of the comment to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Comment retrieved successfully',
    type: Comment,
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findOne(@Param('id') id: string): Promise<Comment> {
    return await this.commentService.findCommentById(id);
  }

  // Get all top-level comments for a specific article, including nested replies
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
  async findByArticle(
    @Param('articleId') articleId: string,
  ): Promise<ResponseInterface<Comment[]>> {
    return await this.commentService.findCommentsByArticle(articleId);
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
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCommentDto,
  ): Promise<Comment> {
    return await this.commentService.updateComment(id, data);
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
  async remove(@Param('id') id: string): Promise<void> {
    await await this.commentService.deleteComment(id);
  }
}
