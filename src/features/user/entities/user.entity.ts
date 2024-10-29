import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Article } from '@/features/articles/entities/article.entity';
import { Comment } from '@/features/comment/entities/comment.entity';
import { Profile } from './profile.entity';
import { NewsletterSubscription } from '@/features/newsletter/entities/newsletter.entity';
import { AnalyticsEvent } from '@/features/analytics/entities/analytics.entity';

export class User {
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
  })
  name: string;
  @ApiProperty({
    type: 'string',
  })
  password: string;
  @ApiProperty({
    enum: Role,
  })
  role: Role;
  @ApiProperty({
    type: () => Article,
    isArray: true,
    required: false,
  })
  articles?: Article[];
  @ApiProperty({
    type: () => Comment,
    isArray: true,
    required: false,
  })
  comments?: Comment[];
  @ApiProperty({
    type: () => Profile,
    required: false,
    nullable: true,
  })
  profile?: Profile | null;
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
    type: () => NewsletterSubscription,
    isArray: true,
    required: false,
  })
  subscriptions?: NewsletterSubscription[];
  @ApiProperty({
    type: () => AnalyticsEvent,
    isArray: true,
    required: false,
  })
  analyticsEvents?: AnalyticsEvent[];
}
