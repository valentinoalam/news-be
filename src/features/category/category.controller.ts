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
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBody({ description: 'Category data', type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() data: CreateCategoryDto) {
    return this.categoryService.createCategory(data);
  }

  // Get a category by ID, with nested children
  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', description: 'ID of the category to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Categoryretrieved successfully',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id') id: string) {
    return this.categoryService.findCategoryById(id);
  }

  // Get all root categories with nested children
  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [Category],
  })
  async findAll() {
    return this.categoryService.findAllCategories();
  }

  // Update a category
  @Patch(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiParam({ name: 'id', description: 'ID of the category to update' })
  @ApiBody({ description: 'Updated category data', type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Categorynot found' })
  async update(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.categoryService.updateCategory(id, data);
  }

  // Delete a category by ID
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({ name: 'id', description: 'ID of the category to delete' })
  @ApiResponse({
    status: 204,
    description: 'The category has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async remove(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
