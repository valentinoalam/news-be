import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNewsletterSubscriptionDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  email: string;
  @ApiProperty({
    type: [String],
    isArray: true,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  categoryIds?: number[];
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  userId?: string;
}
