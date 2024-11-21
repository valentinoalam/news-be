import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  provider: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  providerAccId: string | null;
  @ApiProperty({
    type: 'string',
  })
  email: string;
  @ApiProperty({
    type: 'string',
  })
  name: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  password: string | null;
  @ApiProperty({
    enum: Role,
  })
  role: Role;
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
