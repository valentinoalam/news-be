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
import { TagService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Tag } from './entities/tag.entity';
import { ResponseInterface } from '@/common/response/response.interface';

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBody({ description: 'Tag data', type: CreateTagDto })
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() data: CreateTagDto): Promise<Tag> {
    return this.tagService.createTag(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tag by ID' })
  @ApiParam({ name: 'id', description: 'ID of the tag to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Tag retrieved successfully',
    type: Tag,
  })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async findOne(@Param('id') id: string): Promise<ResponseInterface<Tag>> {
    return this.tagService.findTagById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({
    status: 200,
    description: 'Tags retrieved successfully',
    type: [Tag],
  })
  async findAll(): Promise<ResponseInterface<Tag[]>> {
    return this.tagService.findAllTags();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tag by ID' })
  @ApiParam({ name: 'id', description: 'ID of the tag to update' })
  @ApiBody({ description: 'Updated tag data', type: UpdateTagDto })
  @ApiResponse({
    status: 200,
    description: 'The tag has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagService.updateTag(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a tag by ID' })
  @ApiParam({ name: 'id', description: 'ID of the tag to delete' })
  @ApiResponse({
    status: 204,
    description: 'The tag has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.tagService.deleteTag(id);
  }
}
