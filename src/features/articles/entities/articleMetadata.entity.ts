import { ApiProperty } from '@nestjs/swagger';
import { Article } from './article.entity';
import { Tag } from '@/features/tags/entities/tag.entity';

export class ArticleMetadata {
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
    nullable: true,
  })
  seoTitle: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  abstract?: string;
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  keywords?: Tag[];
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    nullable: true,
  })
  readingTime: number | null;
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
