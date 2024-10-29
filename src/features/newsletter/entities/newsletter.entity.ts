import { SubscriptionStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';

export class NewsletterSubscription {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  email: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  userId: string | null;
  @ApiProperty({
    type: () => User,
    required: false,
    nullable: true,
  })
  user?: User | null;
  @ApiProperty({
    enum: SubscriptionStatus,
  })
  status: SubscriptionStatus;
  @ApiProperty({
    type: () => Category,
    isArray: true,
    required: false,
  })
  categories?: Category[];
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
