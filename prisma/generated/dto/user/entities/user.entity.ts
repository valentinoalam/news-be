import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '../../profile/entities/profile.entity';
import { Article } from '../../article/entities/article.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { NewsletterSubscription } from '../../newsletterSubscription/entities/newsletterSubscription.entity';
import { AnalyticsEvent } from '../../analyticsEvent/entities/analyticsEvent.entity';
import { Session } from '../../session/entities/session.entity';
import { Like } from '../../like/entities/like.entity';
import { View } from '../../view/entities/view.entity';

export class User {
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
    type: () => Profile,
    required: false,
    nullable: true,
  })
  profile?: Profile | null;
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
  @ApiProperty({
    type: () => Session,
    isArray: true,
    required: false,
  })
  sessions?: Session[];
  @ApiProperty({
    type: () => Like,
    isArray: true,
    required: false,
  })
  likes?: Like[];
  @ApiProperty({
    type: () => View,
    isArray: true,
    required: false,
  })
  articleViews?: View[];
}
