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
import { PaginationParams } from '@/shared/utils/pagination.utils';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateMediaItemDto } from '../media/dto/create-media.dto';
// import { Request } from 'express';

@ApiTags('articles')
@Controller('articles')
@UseGuards(RoleGuard)
@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

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
  findAll(@Query() params: PaginationParams) {
    return this.articleService.findAll(params);
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
}
