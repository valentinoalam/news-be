import { TagsModule } from './tags/tags.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { CommentModule } from './comment/comment.module';
import { CategoryModule } from './category/category.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ArticleModule } from './articles/article.module';
import { Module } from '@nestjs/common';
import { MediaModule } from './media/media.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AnalyticsModule,
    ArticleModule,
    CategoryModule,
    CommentModule,
    NewsletterModule,
    TagsModule,
    MediaModule,
  ],
  exports: [
    AuthModule,
    UserModule,
    AnalyticsModule,
    ArticleModule,
    CategoryModule,
    CommentModule,
    NewsletterModule,
    TagsModule,
    MediaModule,
  ],
  providers: [UserService],
})
export class FeaturesModule {}
