import { ApiProperty } from '@nestjs/swagger';
import { Article } from './article.entity';
import { User } from '../../user/entities/user.entity';

export class View {
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
}
