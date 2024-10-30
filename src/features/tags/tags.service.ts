import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { DatabaseService } from '@/core/database/database.service';
import { ResponseSuccess, ResponseError } from '@/common/response/response';

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
  async findTagById(
    id: string,
  ): Promise<ResponseSuccess<Tag> | ResponseError<any>> {
    try {
      // Simulate fetching data
      const data = await this.prisma.tag.findUnique({
        where: { id },
      });
      if (!data) {
        return new ResponseError(`Tag with ID ${id} not found`, null, {
          message: 'Data is empty',
        });
      }
      return new ResponseSuccess('Data retrieved successfully', data);
    } catch (error) {
      return new ResponseError('Failed to retrieve data', null, error);
    }
  }

  // Find all tags
  async findAllTags(): Promise<ResponseSuccess<Tag[]> | ResponseError<any>> {
    try {
      // Simulate fetching data
      const data = await this.prisma.tag.findMany();
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
