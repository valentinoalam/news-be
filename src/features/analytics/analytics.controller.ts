import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
  Delete,
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

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(RoleGuard)
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('articles/:articleId')
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Get analytics for an article' })
  getArticleAnalytics(
    @Param('articleId') articleId: string,
    @Query() params: PaginationParams,
  ) {
    return this.analyticsService.getArticleAnalytics(articleId, params);
  }

  @Get('users/:userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get analytics for a user' })
  getUserAnalytics(
    @Param('userId') userId: string,
    @Query() params: PaginationParams,
  ) {
    return this.analyticsService.getUserAnalytics(userId, params);
  }

  // User Engagement endpoints
  @Get('users/visits')
  async getUserVisits(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getUserVisits(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('users/locations')
  async getUserLocations() {
    return this.analyticsService.getUserLocations();
  }

  @Get('users/session-duration')
  async getSessionDuration() {
    return this.analyticsService.getSessionDuration();
  }

  @Get('users/device-info')
  async getDeviceInfo() {
    return this.analyticsService.getDeviceInfo();
  }

  // Content Performance endpoints
  @Get('posts/popular')
  async getPopularPosts() {
    return this.analyticsService.getPopularPosts();
  }

  @Get('posts/engagement/:postId')
  async getPostEngagement(@Param('postId') postId: string) {
    return this.analyticsService.getPostEngagement(postId);
  }

  @Get('posts/CTR/:postId')
  async getPostCTR(@Param('postId') postId: string) {
    return this.analyticsService.getPostCTR(postId);
  }

  // Traffic Sources endpoints
  @Get('traffic/sources')
  async getTrafficSources() {
    return this.analyticsService.getTrafficSources();
  }

  @Get('traffic/referrals')
  async getReferrals() {
    return this.analyticsService.getReferrals();
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
