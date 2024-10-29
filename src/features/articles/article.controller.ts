import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { RoleGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationParams } from '@/shared/utils/pagination.utils';

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
  create(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    const { user } = req;
    const authorId = user?.id ? user?.id : 'cm2u4rgrh00006034t7bjsa86';
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
