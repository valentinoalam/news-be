import { ApiProperty } from '@nestjs/swagger';

export class MediaItemDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
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
