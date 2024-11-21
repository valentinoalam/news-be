import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsEventDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  eventType: string;
  @ApiProperty({
    type: () => Object,
  })
  payload: Prisma.JsonValue;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  ipAddress: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  userAgent: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
}
