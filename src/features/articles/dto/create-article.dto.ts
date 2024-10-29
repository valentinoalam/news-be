import { ApiProperty } from '@nestjs/swagger';
import { JsonValue } from '@prisma/client/runtime/library';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    type: 'string',
    example: 'My Article Title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  slug: string;
  @ApiProperty({
    type: Object,
    description: 'JSON content',
    example: { key: 'value' }, // Provide an example if desired
  })
  @IsNotEmpty()
  content: JsonValue;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  excerpt?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  featuredImage?: string | null;
  @IsBoolean()
  published?: boolean;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  publishedAt?: string | null;
  @ApiProperty({
    type: 'string',
    isArray: false,
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  categoryId: string;
  @ApiProperty({
    type: [String],
    isArray: true,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  tags: string[];
}
