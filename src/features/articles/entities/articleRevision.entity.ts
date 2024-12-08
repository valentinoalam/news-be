import { ApiProperty } from '@nestjs/swagger';
import { Article } from './article.entity';
export class ArticleRevision {
  @ApiProperty({
    type: 'number',
  })
  articleId: number;
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
    type: 'string',
  })
  content: string;
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
