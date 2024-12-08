import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  // ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsEventDto } from './dto/create-analytics.dto';
import { RoleGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationParams } from '@/shared/utils/pagination.util';
import { ResponseError, ResponseSuccess } from '@/common/response/response';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(RoleGuard)
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-performing-articles')
  async getTopPerformingArticles(@Query('limit') limit?: number) {
    try {
      // Default limit to 10 if not provided
      const effectiveLimit = limit || 10;

      // Call the service method
      const topArticles =
        await this.analyticsService.getTopPerformingArticles(effectiveLimit);

      // Return success response
      return new ResponseSuccess(
        HttpStatus.OK,
        'Top performing articles retrieved successfully',
        topArticles,
        {
          totalRecords: topArticles.length,
          limit: effectiveLimit,
        },
      );
    } catch (error) {
      // Handle any errors
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve top performing articles',
        [
          {
            code: 'ANALYTICS_RETRIEVAL_ERROR',
            message: error.message || 'An unexpected error occurred',
          },
        ],
      );
    }
  }

  @Get('articles/:articleId')
  // @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Get analytics for an article' })
  async getArticleAnalytics(
    @Param('articleId') articleId: number,
    @Query() params: PaginationParams,
  ) {
    try {
      const articleAnalytics = await this.analyticsService.getArticleAnalytics(
        articleId,
        params,
      );

      return new ResponseSuccess(
        HttpStatus.OK,
        'Article analytics retrieved successfully',
        articleAnalytics.data,
        {
          totalRecords: articleAnalytics.meta.total,
          page: articleAnalytics.meta.page,
          limit: articleAnalytics.meta.limit,
          totalPages: articleAnalytics.meta.totalPages,
        },
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve article analytics',
        [{ code: 'ARTICLE_ANALYTICS_ERROR', message: error.message }],
      );
    }
  }
  @Get('weekly-article-views/:articleId')
  async getWeeklyArticleViews(@Param('articleId') articleId: number) {
    try {
      const weeklyViews =
        await this.analyticsService.getWeeklyArticleViews(articleId);

      return new ResponseSuccess(
        HttpStatus.OK,
        'Weekly article views retrieved successfully',
        weeklyViews,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve weekly article views',
        [{ code: 'WEEKLY_VIEWS_ERROR', message: error.message }],
      );
    }
  }

  @Get('daily-active-users')
  async getDailyActiveUsers() {
    try {
      const activeUsers = await this.analyticsService.getDailyActiveUsers();

      return new ResponseSuccess(
        HttpStatus.OK,
        'Daily active users retrieved successfully',
        activeUsers,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve daily active users',
        [{ code: 'DAILY_ACTIVE_USERS_ERROR', message: error.message }],
      );
    }
  }

  @Get('users/:userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get analytics for a user' })
  async getUserAnalytics(
    @Param('userId') userId: string,
    @Query() params: PaginationParams,
  ) {
    try {
      const userAnalytics = await this.analyticsService.getUserAnalytics(
        userId,
        params,
      );

      return new ResponseSuccess(
        HttpStatus.OK,
        'User analytics retrieved successfully',
        userAnalytics.data,
        {
          totalRecords: userAnalytics.meta.total,
          page: userAnalytics.meta.page,
          limit: userAnalytics.meta.limit,
          totalPages: userAnalytics.meta.totalPages,
        },
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve user analytics',
        [{ code: 'USER_ANALYTICS_ERROR', message: error.message }],
      );
    }
  }
  // User Engagement endpoints
  @Get('user-visits')
  async getUserVisits(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      const userVisits = await this.analyticsService.getUserVisits(
        new Date(startDate),
        new Date(endDate),
      );

      return new ResponseSuccess(
        HttpStatus.OK,
        'User visits retrieved successfully',
        userVisits,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.BAD_REQUEST,
        'Failed to retrieve user visits',
        [{ code: 'USER_VISITS_ERROR', message: error.message }],
      );
    }
  }

  @Get('user-demographics')
  async getUserDemographics() {
    try {
      const demographics = await this.analyticsService.getUserDemographics();

      return new ResponseSuccess(
        HttpStatus.OK,
        'User demographics retrieved successfully',
        demographics,
        {
          totalRecords: demographics.length,
        },
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve user demographics',
        [{ code: 'USER_DEMOGRAPHICS_ERROR', message: error.message }],
      );
    }
  }

  @Get('users/locations')
  async getUserLocations() {
    try {
      const locations = await this.analyticsService.getUserLocations();

      return new ResponseSuccess(
        HttpStatus.OK,
        'User locations retrieved successfully',
        locations,
        {
          totalRecords: locations.length,
        },
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve user locations',
        [{ code: 'USER_LOCATIONS_ERROR', message: error.message }],
      );
    }
  }

  @Get('users/session-duration')
  async getSessionDuration() {
    try {
      const sessionDuration = await this.analyticsService.getSessionDuration();

      return new ResponseSuccess(
        HttpStatus.OK,
        'Average session duration retrieved successfully',
        sessionDuration,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve session duration',
        [{ code: 'SESSION_DURATION_ERROR', message: error.message }],
      );
    }
  }

  @Get('users/device-info')
  async getDeviceInfo() {
    try {
      const deviceInfo = await this.analyticsService.getDeviceInfo();

      return new ResponseSuccess(
        HttpStatus.OK,
        'Device information retrieved successfully',
        deviceInfo,
        {
          totalRecords: deviceInfo.length,
        },
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve device information',
        [{ code: 'DEVICE_INFO_ERROR', message: error.message }],
      );
    }
  }
  // Traffic Sources endpoints
  @Get('traffic-sources')
  async getTrafficSources() {
    try {
      const trafficSources = await this.analyticsService.getTrafficSources();

      return new ResponseSuccess(
        HttpStatus.OK,
        'Traffic sources retrieved successfully',
        trafficSources,
        {
          totalRecords: trafficSources.length,
        },
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve traffic sources',
        [{ code: 'TRAFFIC_SOURCES_ERROR', message: error.message }],
      );
    }
  }

  @Get('referrals')
  async getReferrals() {
    try {
      const referrals = await this.analyticsService.getReferrals();

      return new ResponseSuccess(
        HttpStatus.OK,
        'Referrals retrieved successfully',
        referrals,
        {
          totalRecords: referrals.length,
        },
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve referrals',
        [{ code: 'REFERRALS_ERROR', message: error.message }],
      );
    }
  }

  @Get('article-engagement/:articleId')
  async getArticlesEngagement(@Param('articleId') articleId: number) {
    try {
      const engagement =
        await this.analyticsService.getArticlesEngagement(articleId);

      return new ResponseSuccess(
        HttpStatus.OK,
        'Article engagement retrieved successfully',
        engagement,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.NOT_FOUND,
        'Failed to retrieve article engagement',
        [
          {
            code: 'ARTICLE_ENGAGEMENT_ERROR',
            message: error.message || `Article with ID ${articleId} not found`,
          },
        ],
      );
    }
  }

  @Get('ctr/:articleId')
  async getArticlesCTR(@Param('articleId') articleId: number) {
    try {
      const ctrData = await this.analyticsService.getArticlesCTR(articleId);

      return new ResponseSuccess(
        HttpStatus.OK,
        'Article CTR retrieved successfully',
        ctrData,
      );
    } catch (error) {
      return new ResponseError(
        HttpStatus.NOT_FOUND,
        'Failed to retrieve article CTR',
        [
          {
            code: 'ARTICLE_CTR_ERROR',
            message: error.message || `Article with ID ${articleId} not found`,
          },
        ],
      );
    }
  }

  // Session tracking endpoints
  @Post('session/start')
  async startSession(@Body() data: { userId: string; deviceInfo: any }) {
    return this.analyticsService.startSession(data.userId, data.deviceInfo);
  }

  @Post('session/end')
  async endSession(@Body() data: { sessionId: string }) {
    return this.analyticsService.endSession(data.sessionId);
  }

  // Real-time Analytics endpoints
  @Get('real-time/active-users')
  async getActiveUsers() {
    return this.analyticsService.getActiveUsers();
  }

  // Admin Utilities endpoints
  @Post('events/log')
  async logEvent(@Body() eventData: CreateAnalyticsEventDto) {
    return this.analyticsService.logEvent(eventData);
  }

  @Delete('data')
  async clearAnalyticsData(@Body() data: { userId: string }) {
    return this.analyticsService.clearAnalyticsData(data.userId);
  }
}
