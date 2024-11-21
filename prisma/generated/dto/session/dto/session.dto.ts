import { ApiProperty } from '@nestjs/swagger';

export class SessionDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  sessionToken: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  expires: Date | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  startTime: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  endTime: Date | null;
  @ApiProperty({
    type: 'number',
    format: 'float',
    nullable: true,
  })
  duration: number | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  deviceType: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  location: string | null;
}
