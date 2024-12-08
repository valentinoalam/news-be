import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { DatabaseService } from '@/core/database/database.service';
import { ITagService } from '@/shared/interfaces/tag.interface';

@Injectable()
export class TagService implements ITagService {
  constructor(private prisma: DatabaseService) {}

  // Create a new tag
  async createTag(data: CreateTagDto) {
    return await this.prisma.tag.create({
      data,
    });
  }

  // Find a tag by its ID
  async findTagById(id: number) {
    return await this.prisma.tag.findUnique({
      where: { id },
    });
  }

  // Find all tags
  async findAllTags() {
    return await this.prisma.tag.findMany();
  }

  // Update a tag by ID
  async updateTag(id: number, data: UpdateTagDto) {
    const tag = await this.prisma.tag.update({
      where: { id },
      data,
    });
    if (!tag) throw new NotFoundException(`Tag with ID ${id} not found`);
    return tag;
  }

  // Delete a tag by ID
  async deleteTag(id: number) {
    const tag = await this.prisma.tag.delete({
      where: { id },
    });
    return tag;
  }
}
