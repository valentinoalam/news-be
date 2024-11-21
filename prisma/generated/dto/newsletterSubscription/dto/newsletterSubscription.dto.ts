import { SubscriptionStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class NewsletterSubscriptionDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  email: string;
  @ApiProperty({
    enum: SubscriptionStatus,
  })
  status: SubscriptionStatus;
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
  @ApiProperty({
    type: 'boolean',
  })
  verified: boolean;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  verificationToken: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  verificationTokenExpiresAt: Date | null;
}
