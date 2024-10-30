import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from '@/core/database/database.service';
import { Category } from './entities/category.entity';
import { ResponseError, ResponseSuccess } from '@/common/response/response';

@Injectable()
export class CategoryService {
  constructor(private prisma: DatabaseService) {}

  // Create a new category, with optional parent ID for nested category
  async createCategory(
    data: CreateCategoryDto,
  ): Promise<ResponseSuccess<Category[]> | ResponseError<any>> {
    try {
      const category = this.prisma.category.create({
        data,
      });
      return new ResponseSuccess('Data retrieved successfully', category);
    } catch (error) {
      return new ResponseError('Failed to retrieve data', null, error);
    }
  }

  // Find a category by its ID
  async findCategoryById(
    id: string,
  ): Promise<ResponseSuccess<Category[]> | ResponseError<any>> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: { children: true },
      });
      if (!category)
        throw new NotFoundException(`Category with ID ${id} not found`);
      return new ResponseSuccess('Data retrieved successfully', category);
    } catch (error) {
      return new ResponseError('Failed to retrieve data', null, error);
    }
  }

  // Find all categories with nested children
  async findAllCategories(): Promise<
    ResponseSuccess<Category[]> | ResponseError<any>
  > {
    try {
      const data = await this.prisma.category.findMany({
        where: { parentId: null },
        include: { children: true },
      });
      if (!data) {
        return new ResponseError('No data found', null, {
          message: 'Data is empty',
        });
      }
      return new ResponseSuccess('Data retrieved successfully', data);
    } catch (error) {
      return new ResponseError('Failed to retrieve data', null, error);
    }
  }

  // Update a category
  async updateCategory(
    id: string,
    data: UpdateCategoryDto,
  ): Promise<ResponseError<any> | ResponseSuccess<Category>> {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data,
      });
      if (!category)
        throw new NotFoundException(`Category with ID ${id} not found`);
      return new ResponseSuccess('Data retrieved successfully', category);
    } catch (error) {
      return new ResponseError('Failed to retrieve data', null, error);
    }
  }

  // Delete a category and optionally its children
  async deleteCategory(
    id: string,
  ): Promise<ResponseError<any> | ResponseSuccess<Category>> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });
      if (!category)
        throw new NotFoundException(`Category with ID ${id} not found`);

      const data = this.prisma.category.delete({
        where: { id },
      });

      return new ResponseSuccess('Data retrieved successfully', data);
    } catch (error) {
      return new ResponseError('Failed to retrieve data', null, error);
    }
  }
}
