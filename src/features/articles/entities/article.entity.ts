import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';
import { Tag } from 'src/features/tags/entities/tag.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { ArticleMetadata } from 'src/features/articles/entities/articleMetadata.entity';
import { ArticleRevision } from 'src/features/articles/entities/articleRevision.entity';
import { MediaItem } from 'src/features/media/entities/media.entity';
import { AnalyticsEvent } from 'src/features/analytics/entities/analytics.entity';

export class Article {
  @ApiProperty({
    type: 'string',
  })
  id: string;
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
  })
  content: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  excerpt: string | null;
  @ApiProperty({
    type: 'boolean',
  })
  published: boolean;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  featuredImage: string | null;
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
    isArray: true,
    required: false,
  })
  categories?: Category[];
  @ApiProperty({
    type: () => Tag,
    isArray: true,
    required: false,
  })
  tags?: Tag[];
  @ApiProperty({
    type: () => Comment,
    isArray: true,
    required: false,
  })
  comments?: Comment[];
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  viewCount: number;
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
    type: 'string',
    nullable: true,
  })
  publishedById: string | null;
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
