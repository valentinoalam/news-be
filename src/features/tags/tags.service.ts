import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { DatabaseService } from '@/core/database/database.service';

@Injectable()
export class TagService {
  constructor(private prisma: DatabaseService) {}

  // Create a new tag
  async createTag(data: CreateTagDto): Promise<Tag> {
    return this.prisma.tag.create({
      data,
    });
  }

  // Find a tag by its ID
  async findTagById(id: string): Promise<Tag> {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });
    if (!tag) throw new NotFoundException(`Tag with ID ${id} not found`);
    return tag;
  }

  // Find all tags
  async findAllTags(): Promise<Tag[]> {
    return this.prisma.tag.findMany();
  }

  // Update a tag by ID
  async updateTag(id: string, data: UpdateTagDto): Promise<Tag> {
    const tag = await this.prisma.tag.update({
      where: { id },
      data,
    });
    if (!tag) throw new NotFoundException(`Tag with ID ${id} not found`);
    return tag;
  }

  // Delete a tag by ID
  async deleteTag(id: string): Promise<Tag> {
    const tag = await this.prisma.tag.delete({
      where: { id },
    });
    return tag;
  }
}
