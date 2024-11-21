import { ArticleStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  title: string;
  @ApiProperty({
    type: 'string',
  })
  slug: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  coverImageId: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  excerpt: string | null;
  @ApiProperty({
    type: 'string',
  })
  content: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  html: string | null;
  @ApiProperty({
    enum: ArticleStatus,
  })
  status: ArticleStatus;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  clickTimes: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  updatedAt: Date | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  publishedAt: Date | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  updatedById: string | null;
}
