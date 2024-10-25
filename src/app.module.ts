import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArticleModule } from './features/article/article.module';
import { MediaModule } from './features/media/media.module';
import { AnalyticsModule } from './features/analytics/analytics.module';
import { NewsletterModule } from './features/newsletter/newsletter.module';

@Module({
  imports: [UserModule, ArticleModule, MediaModule, AnalyticsModule, NewsletterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
