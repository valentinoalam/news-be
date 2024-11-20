import { Injectable } from '@nestjs/common';
import { CreateAnalyticsEventDto } from './dto/create-analytics.dto';
import { DatabaseService } from 'src/core/database/database.service';
import {
  getPaginatedData,
  getPaginationParams,
  PaginationParams,
} from '@/shared/utils/pagination.util';
@Injectable()
export class AnalyticsService {
  constructor(private db: DatabaseService) {}

  async getArticleAnalytics(articleId: string, params: PaginationParams) {
    const { skip, limit, orderBy = 'createdAt' } = getPaginationParams(params);
    const query = {
      where: {
        articleId,
      },
      orderBy,
    };
    const paginatedArticles = await getPaginatedData(
      this.db,
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
      this.db,
      'analyticsEvent',
      query,
      params.page,
      limit,
      skip,
    );
    return paginatedArticles;
  }

  // User Engagement
  async getUserVisits(startDate: Date, endDate: Date) {
    return this.db.pageView.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        id: true,
      },
    });
  }

  async getUserLocations() {
    return this.db.session.groupBy({
      by: ['location'],
      _count: {
        id: true,
      },
    });
  }

  async getSessionDuration() {
    return this.db.session.aggregate({
      _avg: {
        duration: true,
      },
    });
  }

  async getDeviceInfo() {
    return this.db.session.groupBy({
      by: ['deviceType'],
      _count: {
        id: true,
      },
    });
  }

  // Content Performance
  async getPopularPosts() {
    return this.db.article.findMany({
      select: {
        id: true,
        title: true,
        clickTimes: true,
        _count: {
          select: {
            views: true,
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        views: {
          _count: 'desc',
        },
        likes: {
          _count: 'desc',
        },
      },
      take: 10,
    });
  }

  async getPostEngagement(articleId: string) {
    return this.db.article.findUnique({
      where: { id: articleId },
      include: {
        _count: {
          select: {
            likes: true,
            shares: true,
            comments: true,
          },
        },
      },
    });
  }

  async getPostCTR(articleId: string) {
    const article = await this.db.article.findUnique({
      where: { id: articleId },
      select: {
        clickTimes: true,
        title: true,
        publishedAt: true,
        metadata: {
          select: {
            abstract: true,
            seoTitle: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
    });

    if (!article) {
      throw new Error(`Post with ID ${articleId} not found.`);
    }

    const ctr =
      article._count.views && article._count.views > 0
        ? (article.clickTimes / article._count.views) * 100
        : 0;

    return {
      ...article,
      ctr: ctr.toFixed(2), // Format CTR to 2 decimal places
    };
  }

  // Traffic Sources
  async getTrafficSources() {
    return this.db.pageView.groupBy({
      by: ['source'],
      _count: {
        id: true,
      },
    });
  }

  async getReferrals() {
    return this.db.pageView.groupBy({
      by: ['referrer'],
      _count: {
        id: true,
      },
    });
  }

  // Session Tracking
  async startSession(userId: string, deviceInfo: any) {
    return this.db.session.create({
      data: {
        user: {
          connect: { id: userId }, // Use `connect` if `userId` is a relation
        },
        startTime: new Date(),
        deviceType: deviceInfo.deviceType || null, // Ensure optional fields are nullable
        location: deviceInfo.location || null,
      },
    });
  }

  async endSession(sessionId: string) {
    const session = await this.db.session.findUnique({
      where: { id: sessionId },
    });

    return this.db.session.update({
      where: { id: sessionId },
      data: {
        endTime: new Date(),
        duration: (new Date().getTime() - session.startTime.getTime()) / 1000, // duration in seconds
      },
    });
  }

  // Real-time Analytics
  async getActiveUsers() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    return this.db.session.count({
      where: {
        OR: [{ endTime: null }, { endTime: { gte: fiveMinutesAgo } }],
      },
    });
  }

  // Admin Utilities
  async logEvent(data: CreateAnalyticsEventDto) {
    return this.db.analyticsEvent.create({
      data,
    });
  }

  async clearAnalyticsData(userId: string) {
    // Start a transaction to ensure data consistency
    return this.db.$transaction([
      this.db.pageView.deleteMany({
        where: { userId },
      }),
      this.db.session.deleteMany({
        where: { userId },
      }),
      this.db.analyticsEvent.deleteMany({
        where: { userId },
      }),
    ]);
  }
}
