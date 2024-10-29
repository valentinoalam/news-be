import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IsUnique } from 'src/common/validators/is-unique.validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  @IsUnique('user', 'email', { message: 'Email already exists' })
  email: string | null;
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  name: string;
  @ApiProperty({
    type: 'string',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
