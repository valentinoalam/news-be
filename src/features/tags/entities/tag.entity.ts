import { ApiProperty } from '@nestjs/swagger';
import { Article } from '@/features/articles/entities/article.entity';

export class Tag {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  name: string;
  @ApiProperty({
    type: () => Article,
    isArray: true,
    required: false,
  })
  articles?: Article[];
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt?: Date;
}
