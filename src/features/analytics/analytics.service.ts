import { Injectable } from '@nestjs/common';
import { CreateAnalyticsEventDto } from './dto/create-analytics.dto';
import { DatabaseService } from 'src/core/database/database.service';
import { PaginationParams } from 'src/shared/utils/pagination';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: DatabaseService) {}

  async trackEvent(data: CreateAnalyticsEventDto) {
    return this.prisma.analyticsEvent.create({
      data,
    });
  }

  async getArticleAnalytics(articleId: string, params: PaginationParams) {
    console.log(params);
    return this.prisma.analyticsEvent.findMany({
      where: {
        articleId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUserAnalytics(userId: string, params: PaginationParams) {
    console.log(params);
    return this.prisma.analyticsEvent.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
