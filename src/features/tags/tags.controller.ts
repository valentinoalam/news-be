import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { ITagController } from '@/shared/interfaces/tag.interface';
import { ResponseError, ResponseSuccess } from '@/common/response/response';

@ApiTags('Tags')
@Controller('tags')
export class TagController implements ITagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBody({ description: 'Tag data', type: CreateTagDto })
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() data: CreateTagDto) {
    try {
      const tag = await this.tagService.createTag(data);

      return new ResponseSuccess(
        HttpStatus.CREATED,
        'Tag retrieved successfully',
        tag,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.BAD_REQUEST,
        'Failed to create tags',
        [{ message: error.message }],
      );
    }
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
  async findOne(@Param('id') id: string) {
    try {
      const tag = await this.tagService.findTagById(id);
      if (!tag) {
        return new ResponseError(
          HttpStatus.NOT_FOUND,
          `Tag with ID ${id} not found`,
          [{ message: `No tag found with ID ${id}` }],
        );
      }
      return new ResponseSuccess(
        HttpStatus.OK,
        'Tag retrieved successfully',
        tag,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve tag',
        [{ message: error.message }],
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({
    status: 200,
    description: 'Tags retrieved successfully',
    type: [Tag],
  })
  async findAll() {
    try {
      const tags = await this.tagService.findAllTags();
      return new ResponseSuccess(
        HttpStatus.OK,
        'Tags retrieved successfully',
        tags,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve tags',
        [{ message: error.message }],
      );
    }
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
  async update(@Param('id') id: string, @Body() data: UpdateTagDto) {
    try {
      const updatedTag = await this.tagService.updateTag(id, data);
      if (!updatedTag) {
        return new ResponseError(
          HttpStatus.NOT_FOUND,
          `Tag with ID ${id} not found`,
          [{ message: `No tag found with ID ${id}` }],
        );
      }
      return new ResponseSuccess(
        HttpStatus.OK,
        'Tag updated successfully',
        updatedTag,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update tag',
        [{ message: error.message }],
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag by ID' })
  @ApiParam({ name: 'id', description: 'ID of the tag to delete' })
  @ApiResponse({
    status: 204,
    description: 'The tag has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.tagService.deleteTag(id);
      if (!result) {
        return new ResponseError(
          HttpStatus.NOT_FOUND,
          `Tag with ID ${id} not found`,
          [{ message: `No tag found with ID ${id}` }],
        );
      }
      return new ResponseSuccess(
        HttpStatus.NO_CONTENT,
        'Tag deleted successfully',
        null,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to delete tag',
        [{ message: error.message }],
      );
    }
  }
}
