import { ApiProperty } from '@nestjs/swagger';

export class ArticleMetadataDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  seoTitle: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  seoDesc: string | null;
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  keywords: string[];
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
