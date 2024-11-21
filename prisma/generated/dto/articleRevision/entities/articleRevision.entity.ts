import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../../article/entities/article.entity';

export class ArticleRevision {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  articleId: string;
  @ApiProperty({
    type: () => Article,
    required: false,
  })
  article?: Article;
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
