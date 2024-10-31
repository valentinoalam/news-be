import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateMediaItemDto {
  @IsOptional()
  @IsBoolean()
  isFeatured: boolean = false;
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  file: Express.Multer.File;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  alt?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  caption?: string | null;
}
