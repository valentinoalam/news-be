import { ApiProperty } from '@nestjs/swagger';
import { ArticleMetadata } from '../../articleMetadata/entities/articleMetadata.entity';

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
    type: () => ArticleMetadata,
    isArray: true,
    required: false,
  })
  articles?: ArticleMetadata[];
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
}
