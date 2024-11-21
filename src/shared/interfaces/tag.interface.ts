import { ResponseSuccess, ResponseError } from '@/common/response/response';
import { CreateTagDto } from '@/features/tags/dto/create-tag.dto';
import { UpdateTagDto } from '@/features/tags/dto/update-tag.dto';
import { Tag } from '@prisma/client';

export interface ITagService {
  createTag(data: CreateTagDto): Promise<Tag>;
  findTagById(id: string): Promise<ResponseSuccess<Tag> | ResponseError<any>>;
  findAllTags(): Promise<ResponseSuccess<Tag[]> | ResponseError<any>>;
  updateTag(id: string, data: UpdateTagDto): Promise<Tag>;
  deleteTag(id: string): Promise<Tag>;
}
