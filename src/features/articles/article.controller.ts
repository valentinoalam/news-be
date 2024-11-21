import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { RoleGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationParams } from '@/shared/utils/pagination.util';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateMediaItemDto } from '../media/dto/create-media.dto';
import { ResponseError, ResponseSuccess } from '@/common/response/response';
import { Article } from './entities/article.entity';
// import { Request } from 'express';

@ApiTags('articles')
@Controller('articles')
@UseGuards(RoleGuard)
@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // CRUD Operations
  @Post()
  // @Roles(Role.EDITOR, Role.AUTHOR)
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('featuredImage', 20))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        featuredImage: { type: 'string', format: 'binary' },
        mediaItems: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        title: { type: 'string' },
        content: { type: 'string' },
        categoryId: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        // Add other fields as needed
      },
    },
  })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFiles() mediaFiles: CreateMediaItemDto[],
    @Request() req,
  ) {
    try {
      const { user } = req;
      const authorId = user.id;
      createArticleDto.mediaFiles = mediaFiles;
      const article = await this.articleService.create(
        createArticleDto,
        authorId,
      );
      // Success response handling
      return new ResponseSuccess<Article>(
        HttpStatus.CREATED,
        'Article created successfully',
        article,
      );
    } catch (error) {
      // Error response handling
      return new ResponseError(
        HttpStatus.BAD_REQUEST,
        'Failed to create article',
        [{ message: error.message }],
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query() params: PaginationParams,
    @Query('status') status?: string,
    @Query('authorId') authorId?: string,
  ) {
    try {
      const articleQuery = { ...params, status, authorId };
      const { data, meta } = await this.articleService.findAll(articleQuery);

      // Return success response with paginated articles
      return new ResponseSuccess<Article[]>(
        HttpStatus.OK,
        'Articles fetched successfully',
        data,
        meta,
      );
    } catch (error) {
      // Handle errors (e.g., if the query parameters are invalid or the fetch fails)
      return new ResponseError(
        HttpStatus.BAD_REQUEST,
        'Failed to fetch articles',
        [{ message: error.message }],
      );
    }
  }

  @Get('headlines')
  @ApiOperation({ summary: 'Get all articles' })
  async getHeadlines() {
    try {
      const articles = await this.articleService.getTopArticles();
      return new ResponseSuccess(
        HttpStatus.OK,
        'Top articles fetched successfully',
        articles,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to fetch top articles',
        [{ message: error.message }],
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an article by id' })
  async findOne(@Param('id') id: string) {
    try {
      const article = await this.articleService.findOne(id);
      if (!article) {
        return new ResponseError(
          HttpStatus.NOT_FOUND,
          `Article with ID ${id} not found`,
          [{ message: `No article found with ID ${id}` }],
        );
      }
      return new ResponseSuccess(
        HttpStatus.OK,
        `Article with ID ${id} fetched successfully`,
        article,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to fetch article',
        [{ message: error.message }],
      );
    }
  }

  @Put(':id')
  @Roles(Role.EDITOR, Role.AUTHOR)
  @ApiOperation({ summary: 'Update an article' })
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() req,
  ) {
    try {
      const updatedArticle = await this.articleService.updateArticle(
        id,
        updateArticleDto,
        req.user.id,
      );
      return new ResponseSuccess(
        HttpStatus.OK,
        'Article updated successfully',
        updatedArticle,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update article',
        [{ message: error.message }],
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an article' })
  async remove(@Param('id') id: string) {
    try {
      const deletedArticle = await this.articleService.remove(id);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Article deleted successfully',
        deletedArticle,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to delete article',
        [{ message: error.message }],
      );
    }
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish an article' })
  async publish(@Param('id') id: string) {
    try {
      const publishedArticle = await this.articleService.publish(id);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Article published successfully',
        publishedArticle,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to publish article',
        [{ message: error.message }],
      );
    }
  }

  @Post(':id/save-draft')
  @ApiOperation({ summary: 'Save an article as draft' })
  async saveDraft(@Param('id') id: string, @Body() data: any) {
    try {
      const draft = await this.articleService.saveDraft(id, data);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Article saved as draft successfully',
        draft,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to save article as draft',
        [{ message: error.message }],
      );
    }
  }

  @Put(':id/tags')
  async updateTags(@Param('id') id: string, @Body() data: { tags: string[] }) {
    return this.articleService.updateTags(id, data.tags);
  }

  // Media and Attachments
  @Post(':id/media')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(@Param('id') id: string, @UploadedFile() file: any) {
    return this.articleService.addMedia(id, {
      filename: file.filename,
      mimeType: file.mimetype,
      url: file.path, // Assuming you're saving the file and have the URL
    });
  }

  @Get(':id/media')
  async getMedia(@Param('id') id: string) {
    return this.articleService.getMedia(id);
  }

  // Comments and Interactions
  @Get(':id/comments')
  async getComments(@Param('id') id: string) {
    return this.articleService.getComments(id);
  }

  @Post(':id/comments')
  async addComment(@Param('id') id: string, @Body() data: any) {
    return this.articleService.addComment(id, data);
  }

  @Post(':id/like')
  async addLike(@Param('id') id: string, @Body() data: { userId: string }) {
    return this.articleService.addLike(id, data.userId);
  }

  @Get(':id/likes')
  async getLikesCount(@Param('id') id: string) {
    return this.articleService.getLikesCount(id);
  }

  // SEO and Metadata
  @Get(':id/metadata')
  async getMetadata(@Param('id') id: string) {
    return this.articleService.getMetadata(id);
  }

  @Put(':id/metadata')
  async updateMetadata(@Param('id') id: string, @Body() data: any) {
    return this.articleService.updateMetadata(id, data);
  }

  // Analytics
  @Get(':id/views')
  async getViews(@Param('id') id: string) {
    return this.articleService.getViews(id);
  }

  @Post(':id/views')
  async trackView(@Param('id') id: string, @Body() data?: { userId?: string }) {
    return this.articleService.trackView(id, data?.userId);
  }

  @Get(':id/engagement')
  async getEngagementMetrics(@Param('id') id: string) {
    return this.articleService.getEngagementMetrics(id);
  }

  // Bulk Operations
  @Post('bulk-fetch')
  async bulkFetch(@Body() data: { ids: string[] }) {
    return this.articleService.bulkFetch(data.ids);
  }

  @Put('bulk-update')
  async bulkUpdate(@Body() updates: { id: string; data: any }[]) {
    return this.articleService.bulkUpdate(updates);
  }

  @Delete('bulk-delete')
  async bulkDelete(@Body() data: { ids: string[] }) {
    return this.articleService.bulkDelete(data.ids);
  }
}
