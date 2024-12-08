import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Article } from 'src/features/articles/entities/article.entity';
export class AnalyticsEvent {
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
  userId: string | null;
  @ApiProperty({
    type: () => User,
    required: false,
    nullable: true,
  })
  user?: User | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  articleId: number | null;
  @ApiProperty({
    type: () => Article,
    required: false,
    nullable: true,
  })
  article?: Article | null;
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
