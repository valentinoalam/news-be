import { ApiProperty } from '@nestjs/swagger';

export class PageView {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  userId: string;
  @ApiProperty({
    type: 'string',
  })
  url: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  source: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  referrer: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
}
