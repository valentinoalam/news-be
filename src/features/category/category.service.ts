import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from '@/core/database/database.service';
import { Category } from './entities/category.entity';
import { ICategoryService } from '@/shared/interfaces/category.interface';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(private prisma: DatabaseService) {}

  // Create a new category, with optional parent ID for nested category
  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: dto,
    });
  }

  // Find a category by its ID
  async findCategoryById(id: string) {
    return await this.prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });
  }

  // Find all categories with nested children
  async findAllCategories(): Promise<Category[]> {
    return await this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
          },
        },
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });
  }

  // Update a category
  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const { parentId, ...rest } = dto;
    const parent = parentId
      ? parentId === ' '
        ? { disconnect: true }
        : { connect: { id: parentId } }
      : undefined;

    return await this.prisma.category.update({
      where: { id },
      data: {
        ...rest,
        parent,
      },
      include: {
        parent: true,
        children: true,
      },
    });
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
