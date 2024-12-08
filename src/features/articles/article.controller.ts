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
import { IArticleController } from '@/shared/interfaces/article.interface';
// import { Request } from 'express';

@ApiTags('articles')
@Controller('articles')
@UseGuards(RoleGuard)
@ApiBearerAuth()
@Controller('article')
export class ArticleController implements IArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // CRUD Operations
  @Post()
  // @Roles(Role.EDITOR, Role.AUTHOR)
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('featuredImage', 20))
  async create(
    @Body() dto: CreateArticleDto,
    @UploadedFiles() mediaFiles: CreateMediaItemDto[],
    @Request() req,
  ) {
    try {
      const { user } = req;
      const authorId = user.id;
      dto.mediaFiles = mediaFiles;
      const article = await this.articleService.create(dto, authorId);
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

  @Get('headlines')
  @ApiOperation({ summary: 'Get all articles' })
  async getHotArticles() {
    try {
      const popularArticles = await this.articleService.getPopularArticles();

      return new ResponseSuccess(
        HttpStatus.OK,
        'Popular articles retrieved successfully',
        popularArticles,
        {
          totalRecords: popularArticles.length,
        },
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve popular articles',
        [{ code: 'POPULAR_ARTICLES_ERROR', message: error.message }],
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an article by id' })
  async findOne(@Param('id') id: number) {
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
    @Param('id') id: number,
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
  async remove(@Param('id') id: number) {
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
  async publish(@Param('id') id: number) {
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
  async saveDraft(@Param('id') id: number, @Body() data: any) {
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
  async updateTags(@Param('id') id: number, @Body() tags: string[]) {
    // return this.articleService.updateTags(id, data.tags);
    try {
      const result = await this.articleService.updateTags(id, tags);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Tags updated successfully',
        result,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update tags',
        [{ message: error.message }],
      );
    }
  }

  // Media and Attachments
  @Post(':id/media')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(@Param('id') id: number, @UploadedFile() file: any) {
    try {
      const result = await this.articleService.addMedia(id, {
        filename: file.filename,
        mimeType: file.mimetype,
        url: file.path,
      });
      return new ResponseSuccess(
        HttpStatus.OK,
        'Media uploaded successfully',
        result,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to upload media',
        [{ message: error.message }],
      );
    }
  }

  @Get(':id/media')
  async getMedia(@Param('id') id: number) {
    try {
      const result = await this.articleService.getMedia(id);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Media fetched successfully',
        result,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to fetch media',
        [{ message: error.message }],
      );
    }
  }

  // Comments and Interactions
  @Get(':id/comments')
  async getComments(@Param('id') id: number) {
    try {
      const result = await this.articleService.getComments(id);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Comments fetched successfully',
        result,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to fetch comments',
        [{ message: error.message }],
      );
    }
  }

  @Post(':id/comments')
  async addComment(@Param('id') id: number, @Body() data: any) {
    try {
      const result = await this.articleService.addComment(id, data);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Comment added successfully',
        result,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to add comment',
        [{ message: error.message }],
      );
    }
  }

  @Post(':id/like')
  async addLike(@Param('id') id: number, @Body() userId: string) {
    try {
      const result = await this.articleService.addLike(id, userId);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Like added successfully',
        result,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to add like',
        [{ message: error.message }],
      );
    }
  }

  @Get(':id/likes')
  async getLikesCount(@Param('id') id: number) {
    try {
      const result = await this.articleService.getLikesCount(id);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Likes count fetched successfully',
        result,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to fetch likes count',
        [{ message: error.message }],
      );
    }
  }

  // SEO and Metadata
  @Get(':id/metadata')
  async getMetadata(@Param('id') id: number) {
    try {
      const result = await this.articleService.getMetadata(id);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Metadata fetched successfully',
        result,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to fetch metadata',
        [{ message: error.message }],
      );
    }
  }

  @Put(':id/metadata')
  async updateMetadata(@Param('id') id: number, @Body() data: any) {
    try {
      const result = await this.articleService.updateMetadata(id, data);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Metadata updated successfully',
        result,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update metadata',
        [{ message: error.message }],
      );
    }
  }

  // Analytics
  @Get(':id/views')
  async getViews(@Param('id') id: number) {
    try {
      const result = await this.articleService.getViews(id);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Views count fetched successfully',
        result,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to fetch views count',
        [{ message: error.message }],
      );
    }
  }

  @Post(':id/views')
  async trackView(@Param('id') id: number, @Body() userId?: string) {
    try {
      const result = await this.articleService.trackView(id, userId);
      return new ResponseSuccess(
        HttpStatus.OK,
        'View tracked successfully',
        result,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to track view',
        [{ message: error.message }],
      );
    }
  }

  @Get(':id/engagement')
  async getEngagementMetrics(@Param('id') id: number) {
    try {
      const result = await this.articleService.getEngagementMetrics(id);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Engagement metrics fetched successfully',
        result,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to fetch engagement metrics',
        [{ message: error.message }],
      );
    }
  }

  // Bulk Operations
  @Post('bulk-fetch')
  async bulkFetch(@Body() ids: number[]) {
    try {
      const result = await this.articleService.bulkFetch(ids);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Bulk fetch completed successfully',
        result,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to perform bulk fetch',
        [{ message: error.message }],
      );
    }
  }

  @Put('bulk-update')
  async bulkUpdate(@Body() updates: { id: number; data: any }[]) {
    try {
      const result = await this.articleService.bulkUpdate(updates);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Bulk update completed successfully',
        result,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to perform bulk update',
        [{ message: error.message }],
      );
    }
  }

  @Delete('bulk-delete')
  async bulkDelete(@Body() ids: number[]) {
    try {
      const result = await this.articleService.bulkDelete(ids);
      return new ResponseSuccess(
        HttpStatus.OK,
        'Bulk update completed successfully',
        result,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to perform bulk update',
        [{ message: error.message }],
      );
    }
  }
}
