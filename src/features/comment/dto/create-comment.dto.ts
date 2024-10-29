import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Content of the comment',
    example: 'This is a great article!',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'ID of the article associated with this comment',
    example: 'article123',
  })
  @IsNotEmpty()
  @IsString()
  articleId: string;

  @ApiProperty({
    description: 'ID of the author making the comment',
    example: 'user123',
  })
  @IsNotEmpty()
  @IsString()
  authorId: string;

  @ApiProperty({
    description: 'ID of the parent comment, if this is a reply',
    example: 'comment456',
    required: false,
  })
  @IsOptional()
  @IsString()
  parentId?: string;
}
