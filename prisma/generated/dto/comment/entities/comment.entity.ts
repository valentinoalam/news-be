import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../../article/entities/article.entity';
import { User } from '../../user/entities/user.entity';

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
    type: () => User,
    required: false,
  })
  author?: User;
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
