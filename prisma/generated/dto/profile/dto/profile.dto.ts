import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
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
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}
