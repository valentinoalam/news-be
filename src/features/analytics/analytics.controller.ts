import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  // ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsEventDto } from './dto/create-analytics.dto';
import { RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationParams } from 'src/shared/utils/pagination';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}
  @Post('events')
  @ApiOperation({ summary: 'Track an analytics event' })
  trackEvent(@Body() createAnalyticsEventDto: CreateAnalyticsEventDto) {
    return this.analyticsService.trackEvent(createAnalyticsEventDto);
  }

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
}
