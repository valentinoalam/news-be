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
  NotFoundException,
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
import { ICategoryController } from '@/shared/interfaces/category.interface';
import { ResponseError, ResponseSuccess } from '@/common/response/response';

@ApiTags('Categories')
@Controller('category')
export class CategoryController implements ICategoryController {
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
    try {
      const category = await this.categoryService.createCategory(data);

      return new ResponseSuccess<Category>(
        HttpStatus.CREATED,
        'Category created successfully',
        category,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.BAD_REQUEST,
        'Failed to create category',
        [{ message: error.message }],
      );
    }
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
  async findOne(@Param('id') id: number) {
    try {
      const category = await this.categoryService.findCategoryById(id);

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return new ResponseSuccess<Category>(
        HttpStatus.OK,
        'Category fetched successfully',
        category,
      );
    } catch (error) {
      const errorMessage =
        error instanceof NotFoundException
          ? error.message
          : 'An error occurred while fetching the category';
      return new ResponseError(HttpStatus.NOT_FOUND, errorMessage, [
        { message: errorMessage },
      ]);
    }
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
    try {
      const categories = await this.categoryService.findAllCategories();
      if (categories.length === 0) {
        throw new NotFoundException('No categories found');
      }
      // Return a consistent success response
      return new ResponseSuccess<Category[]>(
        HttpStatus.OK,
        'Categories fetched successfully',
        categories,
        {
          totalRecords: categories.length,
        },
      );
    } catch (error) {
      // Return a consistent error response
      return new ResponseError(
        HttpStatus.NOT_FOUND,
        'Failed to fetch categories',
        [{ message: error.message }],
      );
    }
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
  async update(@Param('id') id: number, @Body() data: UpdateCategoryDto) {
    try {
      const category = await this.categoryService.updateCategory(id, data);

      return new ResponseSuccess<Category>(
        HttpStatus.CREATED,
        'Category updated successfully',
        category,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.BAD_REQUEST,
        'Failed to create category',
        [{ message: error.message }],
      );
    }
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
  async remove(@Param('id') id: number) {
    try {
      const deletedCategory = await this.categoryService.deleteCategory(id);

      if (!deletedCategory) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return new ResponseSuccess<Category>(
        HttpStatus.OK,
        'Category deleted successfully',
        deletedCategory,
      );
    } catch (error) {
      const errorMessage =
        error instanceof NotFoundException
          ? error.message
          : 'Failed to delete category';
      return new ResponseError(HttpStatus.NOT_FOUND, errorMessage, [
        { message: errorMessage },
      ]);
    }
  }
}
