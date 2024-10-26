import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'argon2';
import { DatabaseService } from 'src/core/database/database.service';
import { PaginationParams } from 'src/shared/utils/pagination';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}
  async create(data: CreateUserDto) {
    const hashedPassword = await hash(data.password, { timeCost: 10 });
    return this.db.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findAll(params: PaginationParams) {
    return this.db.user.findMany({
      include: {
        profile: true,
      },
    });
  }

  async findOne(id: string) {
    return this.db.user.findUnique({
      where: { id },
      include: {
        profile: true,
        articles: true,
      },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    if (data.password) {
      data.password = await hash(data.password, { timeCost: 10 });
    }
    return this.db.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.db.user.delete({
      where: { id },
    });
  }
}
