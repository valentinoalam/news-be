import { AnalyticsEvent } from '@/features/analytics/entities/analytics.entity';

import { CreateAnalyticsEventDto } from '@/features/analytics/dto/create-analytics.dto';
import { Session } from '@prisma/client';
import { PaginatedResponse, PaginationParams } from '../utils/pagination.util';
import { ResponseError, ResponseSuccess } from '@/common/response/response';

type UserVisitsResponse = {
  totalVisits: number;
  visitsPerDay: Record<string, number>;
};
type UserLocationAnalytics = { location: string; count: number }[];
type SessionDurationAnalytics = {
  averageDuration: number;
  durations: number[];
};
type DeviceInfoAnalytics = { deviceType: string; count: number }[];
type ArticleEngagementAnalytics = {
  views: number;
  likes: number;
  shares: number;
  comments: number;
};
type ArticleCTRAnalytics = {
  clickCount: number;
  impressionCount: number;
  ctr: number;
};
type TrafficSourceAnalytics = { source: string; count: number }[];
type ReferralAnalytics = { referrer: string; count: number }[];
type ClearAnalyticsResponse = { success: boolean; clearedRecords: number };
type DeviceInfo = { os: string; browser: string; device: string };
export interface IAnalyticsService {
  /**
   * Get paginated analytics events for a specific article.
   * @param articleId - The ID of the article.
   * @param params - Pagination parameters.
   * @returns A paginated response of analytics events.
   */
  getArticleAnalytics(
    articleId: number,
    params: PaginationParams,
  ): Promise<PaginatedResponse<AnalyticsEvent>>;

  /**
   * Get paginated analytics events for a specific user.
   * @param userId - The ID of the user.
   * @param params - Pagination parameters.
   * @returns A paginated response of analytics events.
   */
  getUserAnalytics(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<AnalyticsEvent>>;

  /**
   * Get user visit counts within a date range.
   * @param startDate - The start date for the range.
   * @param endDate - The end date for the range.
   * @returns An object containing user visit data.
   */
  getUserVisits(startDate: Date, endDate: Date): Promise<UserVisitsResponse>;

  /**
   * Get user location distribution.
   * @returns An object containing location analytics.
   */
  getUserLocations(): Promise<UserLocationAnalytics>;

  /**
   * Get session duration statistics.
   * @returns An object containing session duration data.
   */
  getSessionDuration(): Promise<SessionDurationAnalytics>;

  /**
   * Get device usage statistics.
   * @returns An object containing device information.
   */
  getDeviceInfo(): Promise<DeviceInfoAnalytics>;

  /**
   * Get engagement metrics for a specific article.
   * @param articleId - The ID of the article.
   * @returns An object containing engagement data.
   */
  getArticlesEngagement(articleId: number): Promise<ArticleEngagementAnalytics>;

  /**
   * Get click-through rate (CTR) for a specific article.
   * @param articleId - The ID of the article.
   * @returns An object containing CTR data.
   */
  getArticlesCTR(articleId: number): Promise<ArticleCTRAnalytics>;

  /**
   * Get traffic source distribution.
   * @returns An object containing traffic source analytics.
   */
  getTrafficSources(): Promise<TrafficSourceAnalytics>;

  /**
   * Get referral traffic data.
   * @returns An object containing referral analytics.
   */
  getReferrals(): Promise<ReferralAnalytics>;

  /**
   * Start a new user session.
   * @param userId - The ID of the user.
   * @param deviceInfo - Information about the user's device.
   * @returns The created session object.
   */
  startSession(userId: string, deviceInfo: DeviceInfo): Promise<Session>;

  /**
   * End an existing user session.
   * @param sessionId - The ID of the session to end.
   * @returns The updated session object.
   */
  endSession(sessionId: string): Promise<Session>;

  /**
   * Get the number of active users.
   * @returns The count of currently active users.
   */
  getActiveUsers(): Promise<number>;

  /**
   * Log a new analytics event.
   * @param data - The event data to log.
   * @returns The created analytics event.
   */
  logEvent(data: CreateAnalyticsEventDto): Promise<AnalyticsEvent>;

  /**
   * Clear analytics data for a specific user.
   * @param userId - The ID of the user whose data should be cleared.
   * @returns An object indicating the result of the operation.
   */
  clearAnalyticsData(userId: string): Promise<ClearAnalyticsResponse>;
}

export interface IAnalyticsController {
  /**
   * @endpoint 'top-articles'
   */
  getTopPerformingArticles(): Promise<
    ResponseSuccess<AnalyticsEvent[]> | ResponseError<any>
  >;
  /**
   * @endpoint 'articles/:articleId'
   */
  getArticleAnalytics(
    articleId: number,
    params: PaginationParams,
  ): Promise<
    ResponseSuccess<PaginatedResponse<AnalyticsEvent>> | ResponseError<any>
  >;
  /**
   * @endpoint 'users/:userId'
   */
  getUserAnalytics(
    userId: string,
    params: PaginationParams,
  ): Promise<
    ResponseSuccess<PaginatedResponse<AnalyticsEvent>> | ResponseError<any>
  >;
  /**
   * @endpoint 'users/visits'
   */
  getUserVisits(
    startDate: string,
    endDate: string,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @endpoint 'users/demographics'
   */
  getUserDemographics(): Promise<ResponseSuccess<any> | ResponseError<any>>;

  /**
   * @endpoint 'users/locations'
   */
  getUserLocations(): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @endpoint 'users/session-duration'
   */
  getSessionDuration(): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @endpoint 'users/device-info'
   */
  getDeviceInfo(): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @endpoint 'article-engagement/:articleId'
   */
  getArticlesEngagement(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @endpoint 'ctr/:articleId'
   */
  getArticlesCTR(
    articleId: number,
  ): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @endpoint 'users/traffic-sources'
   */
  getTrafficSources(): Promise<ResponseSuccess<any> | ResponseError<any>>;
  /**
   * @endpoint 'users/referrals'
   */
  getReferrals(): object;
  /**
   * @endpoint 'session/start'
   */
  startSession(data: { userId: string; deviceInfo: any }): Promise<Session>;
  /**
   * @endpoint 'session/end'
   */
  endSession(sessionId: string): Promise<Session>;
  /**
   * @endpoint 'real-time/active-users'
   */
  getActiveUsers(): Promise<number>;
  /**
   * @endpoint 'events/log'
   */
  logEvent(data: CreateAnalyticsEventDto): Promise<AnalyticsEvent>;
  /**
   * @endpoint 'data'
   */
  clearAnalyticsData(userId: string): Promise<{
    success: boolean;
    clearedRecords: number;
  }>;
}
