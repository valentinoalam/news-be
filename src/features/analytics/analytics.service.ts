import { Injectable } from '@nestjs/common';
import { CreateAnalyticsEventDto } from './dto/create-analytics.dto';
import { DatabaseService } from 'src/core/database/database.service';
import {
  getPaginatedData,
  getPaginationParams,
  PaginationParams,
} from '@/shared/utils/pagination.utils';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private db: DatabaseService) {}
  private prisma = new PrismaClient();

  async trackEvent(data: CreateAnalyticsEventDto) {
    return this.db.analyticsEvent.create({
      data,
    });
  }

  async getArticleAnalytics(articleId: string, params: PaginationParams) {
    const { skip, limit, orderBy = 'createdAt' } = getPaginationParams(params);
    const query = {
      where: {
        articleId,
      },
      orderBy,
    };
    const paginatedArticles = await getPaginatedData(
      this.prisma,
      'analyticsEvent',
      query,
      params.page,
      limit,
      skip,
    );
    return paginatedArticles;
  }

  async getUserAnalytics(userId: string, params: PaginationParams) {
    const { skip, limit, orderBy = 'createdAt' } = getPaginationParams(params);
    const query = {
      where: {
        userId,
      },
      orderBy,
    };
    const paginatedArticles = await getPaginatedData(
      this.prisma,
      'analyticsEvent',
      query,
      params.page,
      limit,
      skip,
    );
    return paginatedArticles;
  }
}
