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
    const { user } = req;
    const authorId = user.id ? user?.id : 'cm2u4rgrh00006034t7bjsa86';
    createArticleDto.mediaFiles = mediaFiles;
    return this.articleService.create(createArticleDto, authorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query() params: PaginationParams,
    @Query('status') status?: string,
    @Query('authorId') authorId?: string,
  ) {
    const articleQuery = { ...params, status, authorId };
    return this.articleService.findAll(articleQuery);
  }

  @Get('headlines')
  @ApiOperation({ summary: 'Get all articles' })
  getHeadlines() {
    return this.articleService.getTopArticles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an article by id' })
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.EDITOR, Role.AUTHOR)
  @ApiOperation({ summary: 'Update an article' })
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() req,
  ) {
    return this.articleService.updateArticle(id, updateArticleDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }

  // Content Management
  @Post(':id/publish')
  async publish(@Param('id') id: string) {
    return this.articleService.publish(id);
  }

  @Post(':id/save-draft')
  async saveDraft(@Param('id') id: string, @Body() data: any) {
    return this.articleService.saveDraft(id, data);
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
