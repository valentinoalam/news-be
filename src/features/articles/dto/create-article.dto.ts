import { CreateMediaItemDto } from '@/features/media/dto/create-media.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { JsonValue } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
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
  // @ApiProperty({
  //   type: Object,
  //   description: 'JSON content',
  //   example: { key: 'value' }, // Provide an example if desired
  // })
  // @IsNotEmpty()
  // content: JsonValue;
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
  @IsBoolean()
  @IsOptional()
  published?: boolean = false;
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
  @IsUUID('4')
  categoryId: string;
  @ApiProperty({
    type: [String],
    isArray: true,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tags: string[];
  @IsString()
  @IsOptional()
  featuredImage?: string;
  @ApiPropertyOptional({
    type: [String],
    description: 'Array of media file UUIDs',
  })
  @IsArray()
  @IsOptional()
  imageIds?: string[];
  @IsOptional()
  @ApiPropertyOptional({ type: () => CreateMediaItemDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMediaItemDto)
  mediaFiles?: CreateMediaItemDto[];
}
