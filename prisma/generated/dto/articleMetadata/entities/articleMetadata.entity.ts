import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../../article/entities/article.entity';
import { Tag } from '../../tag/entities/tag.entity';

export class ArticleMetadata {
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
    isArray: true,
  })
  author: string[];
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  seoTitle: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  abstract: string | null;
  @ApiProperty({
    type: () => Tag,
    isArray: true,
    required: false,
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
