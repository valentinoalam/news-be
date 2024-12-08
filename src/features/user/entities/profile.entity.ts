import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

export class Profile {
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  bio: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  avatar: string | null;
  @ApiProperty({
    type: () => Object,
    nullable: true,
  })
  socialMedia: Prisma.JsonValue | null;
  @ApiProperty({
    type: 'string',
  })
  userId: string;
  @ApiProperty({
    type: () => User,
    required: false,
  })
  user?: User;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}
