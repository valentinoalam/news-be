import { ResponseSuccess, ResponseError } from '@/common/response/response';
import { CreateCategoryDto } from '@/features/category/dto/create-category.dto';
import { UpdateCategoryDto } from '@/features/category/dto/update-category.dto';
import { Category } from '@/features/category/entities/category.entity';

export interface ICategoryService {
  createCategory(data: CreateCategoryDto): Promise<Category>;
  findCategoryById(id: number): Promise<Category>;
  findAllCategories(): Promise<Category[]>;
  updateCategory(id: number, data: UpdateCategoryDto): Promise<Category>;
  deleteCategory(id: number): Promise<Category>;
}

export interface ICategoryController {
  create(
    data: CreateCategoryDto,
  ): Promise<ResponseSuccess<Category> | ResponseError<any>>;
  findOne(
    id: number,
  ): Promise<ResponseSuccess<Category[]> | ResponseError<any>>;
  findAll(): Promise<ResponseSuccess<Category[]> | ResponseError<any>>;
  update(
    id: number,
    data: UpdateCategoryDto,
  ): Promise<ResponseSuccess<Category> | ResponseError<any>>;
  remove(id: number): Promise<ResponseSuccess<Category> | ResponseError<any>>;
}
