import { IsEmail, IsNotEmpty } from 'class-validator';

export class SubscribeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UnsubscribeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UpdateEmailDto {
  @IsEmail()
  @IsNotEmpty()
  oldEmail: string;

  @IsEmail()
  @IsNotEmpty()
  newEmail: string;
}

export class DeleteSubscriberDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
