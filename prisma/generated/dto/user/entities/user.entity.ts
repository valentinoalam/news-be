import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../../article/entities/article.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { NewsletterSubscription } from '../../newsletterSubscription/entities/newsletterSubscription.entity';
import { AnalyticsEvent } from '../../analyticsEvent/entities/analyticsEvent.entity';

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
