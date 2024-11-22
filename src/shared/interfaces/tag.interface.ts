import { ResponseSuccess, ResponseError } from '@/common/response/response';
import { CreateTagDto } from '@/features/tags/dto/create-tag.dto';
import { UpdateTagDto } from '@/features/tags/dto/update-tag.dto';
import { Tag } from '@prisma/client';

export interface ITagService {
  createTag(data: CreateTagDto): Promise<Tag>;
  findTagById(id: string): Promise<Tag | null>;
  findAllTags(): Promise<Tag[]>;
  updateTag(id: string, data: UpdateTagDto): Promise<Tag>;
  deleteTag(id: string): Promise<Tag>;
}

export interface ITagController {
  create(
    data: CreateTagDto,
  ): Promise<ResponseSuccess<Tag> | ResponseError<any>>;
  findOne(id: string): Promise<ResponseSuccess<Tag> | ResponseError<any>>;
  findAll(): Promise<ResponseSuccess<Tag[]> | ResponseError<any>>;
  update(
    id: string,
    data: UpdateTagDto,
  ): Promise<ResponseSuccess<Tag> | ResponseError<any>>;
  remove(id: string): Promise<ResponseSuccess<Tag> | ResponseError<any>>;
}
