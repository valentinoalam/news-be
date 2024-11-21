import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../../article/entities/article.entity';

export class MediaItem {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  sessionId: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  articleId: string | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    nullable: true,
  })
  index: number | null;
  @ApiProperty({
    type: 'string',
  })
  fileName: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  fileSize: number;
  @ApiProperty({
    type: 'string',
  })
  mimeType: string;
  @ApiProperty({
    type: 'string',
  })
  url: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  alt: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  caption: string | null;
  @ApiProperty({
    type: () => Article,
    required: false,
    nullable: true,
  })
  articles?: Article | null;
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
}
