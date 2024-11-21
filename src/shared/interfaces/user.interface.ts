import { CreateUserDto } from '@/features/user/dto/create-user.dto';
import { User } from '@/features/user/entities/user.entity';
import { PaginationParams } from '../utils/pagination.util';
import { UpdateUserDto } from '@/features/user/dto/update-user.dto';

export interface IUserService {
  create(dto: CreateUserDto): Promise<User>;
  getIAM(id: string): Promise<User>;
  findOne(id: string): Promise<User>;
  findAll(params: PaginationParams): Promise<User[]>;
  update(id: string, data: UpdateUserDto): Promise<User>;
  remove(id: string): Promise<User>;
}
