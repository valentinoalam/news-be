import { ArticleStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';
import { View } from '../../view/entities/view.entity';
import { Share } from '../../share/entities/share.entity';
import { Like } from '../../like/entities/like.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { ArticleMetadata } from '../../articleMetadata/entities/articleMetadata.entity';
import { ArticleRevision } from '../../articleRevision/entities/articleRevision.entity';
import { MediaItem } from '../../mediaItem/entities/mediaItem.entity';
import { AnalyticsEvent } from '../../analyticsEvent/entities/analyticsEvent.entity';

export class Article {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  categoryId: string;
  @ApiProperty({
    type: 'string',
  })
  title: string;
  @ApiProperty({
    type: 'string',
  })
  slug: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  coverImageId: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  excerpt: string | null;
  @ApiProperty({
    type: 'string',
  })
  content: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  html: string | null;
  @ApiProperty({
    type: 'string',
  })
  authorId: string;
  @ApiProperty({
    type: () => User,
    required: false,
  })
  author?: User;
  @ApiProperty({
    type: () => Category,
    required: false,
  })
  category?: Category;
  @ApiProperty({
    enum: ArticleStatus,
  })
  status: ArticleStatus;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  clickTimes: number;
  @ApiProperty({
    type: () => View,
    isArray: true,
    required: false,
  })
  views?: View[];
  @ApiProperty({
    type: () => Share,
    isArray: true,
    required: false,
  })
  shares?: Share[];
  @ApiProperty({
    type: () => Like,
    isArray: true,
    required: false,
  })
  likes?: Like[];
  @ApiProperty({
    type: () => Comment,
    isArray: true,
    required: false,
  })
  comments?: Comment[];
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  updatedAt: Date | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  publishedAt: Date | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  updatedById: string | null;
  @ApiProperty({
    type: () => ArticleMetadata,
    required: false,
    nullable: true,
  })
  metadata?: ArticleMetadata | null;
  @ApiProperty({
    type: () => ArticleRevision,
    isArray: true,
    required: false,
  })
  revisions?: ArticleRevision[];
  @ApiProperty({
    type: () => MediaItem,
    isArray: true,
    required: false,
  })
  mediaItems?: MediaItem[];
  @ApiProperty({
    type: () => AnalyticsEvent,
    isArray: true,
    required: false,
  })
  analytics?: AnalyticsEvent[];
}