import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleRevisionDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  title: string;
  @ApiProperty({
    type: () => Object,
  })
  content: Prisma.JsonValue;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  excerpt: string | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  version: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  createdBy: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  changeLog: string | null;
}
