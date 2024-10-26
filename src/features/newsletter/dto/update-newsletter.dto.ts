import { PartialType } from '@nestjs/swagger';
import { CreateNewsletterSubscriptionDto } from './create-newsletter.dto';

export class UpdateNewsletterDto extends PartialType(
  CreateNewsletterSubscriptionDto,
) {}
