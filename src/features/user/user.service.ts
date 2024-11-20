import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'argon2';
import { DatabaseService } from 'src/core/database/database.service';
import { PaginationParams } from '@/shared/utils/pagination.util';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}
  async create(dto: CreateUserDto) {
    const data = { ...dto, provider: 'credential' };
    const hashedPassword = await hash(data.password, { timeCost: 10 });
    return this.db.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }
  async getIAM(id: string): Promise<any> {
    const user = await this.db.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Destructure to exclude sensitive fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return safeUser;
  }

  async getById(id: string): Promise<any> {
    // find the user by username
    const user = await this.db.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });

    return user;
  }

  async findAll(params: PaginationParams) {
    console.log(params);
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
