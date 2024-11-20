import { ApiProperty } from '@nestjs/swagger';
import { Article } from '@/features/articles/entities/article.entity';

type Author = {
  name: string;
  profile: {
    avatar: string;
  };
};
export class Comment {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  content: string;
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
  authorId: string;
  @ApiProperty({
    type: () => Object,
    required: false,
  })
  author?: Author;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  parentId: string | null;
  @ApiProperty({
    type: () => Comment,
    required: false,
    nullable: true,
  })
  parent?: Comment | null;
  @ApiProperty({
    type: () => Comment,
    isArray: true,
    required: false,
  })
  replies?: Comment[];
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
