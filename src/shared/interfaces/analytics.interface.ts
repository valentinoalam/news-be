import { AnalyticsEvent } from '@/features/analytics/entities/analytics.entity';

import { CreateAnalyticsEventDto } from '@/features/analytics/dto/create-analytics.dto';
import { Session } from '@prisma/client';
import { PaginatedResponse, PaginationParams } from '../utils/pagination.util';
export interface IAnalyticsService {
  getArticleAnalytics(
    articleId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<AnalyticsEvent>>;
  getUserAnalytics(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<AnalyticsEvent>>;
  getUserVisits(startDate: Date, endDate: Date): object;
  getUserLocations(): object;
  getSessionDuration(): object;
  getDeviceInfo(): object;
  getPopularPosts(): object;
  getPostEngagement(articleId: string): object;
  getPostCTR(articleId: string): object;
  getTrafficSources(): object;
  getReferrals(): object;
  startSession(userId: string, deviceInfo: any): Promise<Session>;
  endSession(sessionId: string): Promise<Session>;
  getActiveUsers(): Promise<number>;
  logEvent(data: CreateAnalyticsEventDto): Promise<AnalyticsEvent>;
  clearAnalyticsData(userId: string): object;
}
