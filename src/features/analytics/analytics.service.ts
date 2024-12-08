import { Injectable } from '@nestjs/common';
import { CreateAnalyticsEventDto } from './dto/create-analytics.dto';
import { DatabaseService } from 'src/core/database/database.service';
import {
  getPaginatedData,
  getPaginationParams,
  PaginationParams,
} from '@/shared/utils/pagination.util';
import { IAnalyticsService } from '@/shared/interfaces/analytics.interface';
import { AnalyticsEvent } from './entities/analytics.entity';
@Injectable()
export class AnalyticsService implements IAnalyticsService {
  constructor(private db: DatabaseService) {}

  // Content Performance
  async getTopPerformingArticles(limit: number = 10) {
    const topArticles = await this.db.analyticsEvent.groupBy({
      by: ['articleId'],
      _count: {
        articleId: true,
      },
      orderBy: {
        _count: {
          articleId: 'desc',
        },
      },
      take: limit,
    });

    return topArticles.map((article) => ({
      articleId: article.articleId,
      views: article._count.articleId,
    }));
  }

  async getArticlesEngagement(articleId: number) {
    const article = await this.db.article.findUnique({
      where: { id: articleId },
      include: {
        _count: {
          select: {
            likes: true,
            shares: true,
            comments: true,
            views: true,
          },
        },
      },
    });
    const { views, comments, likes, shares } = article._count;
    return {
      views,
      likes,
      shares,
      comments,
    };
  }

  async getArticlesCTR(articleId: number) {
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
      clickCount: article.clickTimes,
      impressionCount: article._count.views,
      ctr: parseFloat(ctr.toFixed(2)), // Format CTR to 2 decimal places
    };
  }

  async getArticleAnalytics(articleId: number, params: PaginationParams) {
    const { skip, limit, orderBy = 'createdAt' } = getPaginationParams(params);
    const query = {
      where: {
        articleId,
      },
      orderBy,
    };
    const paginatedArticles = await getPaginatedData<AnalyticsEvent>(
      this.db,
      'analyticsEvent',
      query,
      params.page,
      limit,
      skip,
    );
    return paginatedArticles;
  }

  async getWeeklyArticleViews(articleId: number) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Start of the week

    const views = await this.db.analyticsEvent.count({
      where: {
        articleId,
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    });

    return {
      articleId,
      views,
    };
  }

  async getDailyActiveUsers() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day

    const activeUsers = await this.db.analyticsEvent.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: today,
        },
      },
      _count: {
        userId: true,
      },
    });

    return {
      date: today,
      activeUsers: activeUsers.length,
    };
  }

  async getUserAnalytics(userId: string, params: PaginationParams) {
    const { skip, limit, orderBy = 'createdAt' } = getPaginationParams(params);
    const query = {
      where: {
        userId,
      },
      orderBy,
    };
    const paginatedArticles = await getPaginatedData<AnalyticsEvent>(
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
    const visits = await this.db.pageView.groupBy({
      by: ['createdAt'],
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

    const totalVisits = visits.reduce((sum, visit) => sum + visit._count.id, 0);
    const visitsPerDay = visits.reduce(
      (acc, visit) => {
        const date = visit.createdAt.toISOString().split('T')[0];
        acc[date] = visit._count.id;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalVisits,
      visitsPerDay,
    };
  }

  async getUserDemographics() {
    const demographics = await this.db.analyticsEvent.groupBy({
      by: ['ipAddress', 'userAgent'],
      _count: {
        userId: true,
      },
    });

    return demographics;
  }

  async getUserLocations() {
    const locations = await this.db.session.groupBy({
      by: ['location'],
      _count: {
        id: true,
      },
    });

    return locations.map((location) => ({
      location: location.location,
      count: location._count.id,
    }));
  }

  async getSessionDuration() {
    const durations = await this.db.session.findMany({
      select: { duration: true },
    });

    const durationValues = durations.map((d) => d.duration || 0);
    const averageDuration =
      durationValues.length > 0
        ? durationValues.reduce((sum, dur) => sum + dur, 0) /
          durationValues.length
        : 0;

    return {
      averageDuration,
      durations: durationValues,
    };
  }

  async getDeviceInfo() {
    const devices = await this.db.session.groupBy({
      by: ['deviceType'],
      _count: {
        id: true,
      },
    });

    return devices.map((device) => ({
      deviceType: device.deviceType,
      count: device._count.id,
    }));
  }

  // Traffic Sources
  async getTrafficSources() {
    const sources = await this.db.pageView.groupBy({
      by: ['source'],
      _count: {
        id: true,
      },
    });

    return sources.map((source) => ({
      source: source.source,
      count: source._count.id,
    }));
  }

  async getReferrals() {
    const referrals = await this.db.pageView.groupBy({
      by: ['referrer'],
      _count: {
        id: true,
      },
    });

    return referrals.map((referral) => ({
      referrer: referral.referrer,
      count: referral._count.id,
    }));
  }

  // Session Tracking
  async startSession(userId: string, deviceInfo: any) {
    return await this.db.session.create({
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

    return await this.db.session.update({
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

    return await this.db.session.count({
      where: {
        OR: [{ endTime: null }, { endTime: { gte: fiveMinutesAgo } }],
      },
    });
  }

  // Admin Utilities
  async logEvent(data: CreateAnalyticsEventDto) {
    return await this.db.analyticsEvent.create({
      data,
    });
  }

  async clearAnalyticsData(userId: string) {
    try {
      // Start a transaction to ensure data consistency
      const [pageViews, sessions, analyticsEvents] = await this.db.$transaction(
        [
          this.db.pageView.deleteMany({
            where: { userId },
          }),
          this.db.session.deleteMany({
            where: { userId },
          }),
          this.db.analyticsEvent.deleteMany({
            where: { userId },
          }),
        ],
      );

      // Calculate total cleared records
      const clearedRecords =
        pageViews.count + sessions.count + analyticsEvents.count;

      // Return success response
      return {
        success: true,
        clearedRecords,
      };
    } catch (error) {
      // Log the error for debugging purposes
      console.error(
        `Failed to clear analytics data for user ${userId}:`,
        error,
      );

      // Return failure response
      return {
        success: false,
        clearedRecords: 0,
      };
    }
  }
}
