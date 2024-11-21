import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ArticleRevisionArticleIdVersionUniqueInputDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  articleId: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  @IsNotEmpty()
  @IsInt()
  version: number;
}

@ApiExtraModels(ArticleRevisionArticleIdVersionUniqueInputDto)
export class ConnectArticleRevisionDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  id?: string;
  @ApiProperty({
    type: ArticleRevisionArticleIdVersionUniqueInputDto,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ArticleRevisionArticleIdVersionUniqueInputDto)
  articleId_version?: ArticleRevisionArticleIdVersionUniqueInputDto;
}
