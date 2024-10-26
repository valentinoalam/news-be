import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
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
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
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
  publishedAt?: Date | null;
  @ApiProperty({
    type: [String],
    isArray: true,
    required: false,
    nullable: true,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds: string[];
  @ApiProperty({
    type: [String],
    isArray: true,
    required: false,
    nullable: true,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds: string[];
}
