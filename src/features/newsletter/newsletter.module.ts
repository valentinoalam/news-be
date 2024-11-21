import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { DatabaseModule } from '@/core/database/database.module';
import { MailerService } from '../../shared/utils/mailer/mailer.service';

@Module({
  imports: [DatabaseModule],
  controllers: [NewsletterController],
  providers: [NewsletterService, MailerService],
  exports: [NewsletterService],
})
export class NewsletterModule {}
