import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from '@/core/database/database.service';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private prisma: DatabaseService) {}

  // Create a new category, with optional parent ID for nested category
  async createCategory(data: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }

  // Find a category by its ID
  async findCategoryById(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });
    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);
    return category;
  }

  // Find all categories with nested children
  async findAllCategories(): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: { children: true },
    });
  }

  // Update a category
  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.prisma.category.update({
      where: { id },
      data,
    });
    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);
    return category;
  }

  // Delete a category and optionally its children
  async deleteCategory(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);

    // Delete the category
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
