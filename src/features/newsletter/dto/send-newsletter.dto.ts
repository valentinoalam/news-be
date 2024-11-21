import { IsString, IsNotEmpty } from 'class-validator';

export class SendNewsletterDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
