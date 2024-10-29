import { ApiProperty } from '@nestjs/swagger';
import { Article } from '@/features/articles/entities/article.entity';
import { NewsletterSubscription } from '@/features/newsletter/entities/newsletter.entity';

export class Category {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  name: string;
  @ApiProperty({
    type: 'string',
  })
  slug: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  description: string | null;
  @ApiProperty({
    type: () => Article,
    isArray: true,
    required: false,
  })
  articles?: Article[];
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  parentId: string | null;
  @ApiProperty({
    type: () => Category,
    required: false,
    nullable: true,
  })
  parent?: Category | null;
  @ApiProperty({
    type: () => Category,
    isArray: true,
    required: false,
  })
  children?: Category[];
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
  newsletterSubscription?: NewsletterSubscription[];
}
