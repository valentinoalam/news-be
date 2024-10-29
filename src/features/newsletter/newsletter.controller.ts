import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterSubscriptionDto } from './dto/create-newsletter.dto';
import { RoleGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
@ApiTags('newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  subscribe(@Body() createSubscriptionDto: CreateNewsletterSubscriptionDto) {
    return this.newsletterService.subscribe(createSubscriptionDto);
  }

  @Delete('unsubscribe/:email')
  @ApiOperation({ summary: 'Unsubscribe from newsletter' })
  unsubscribe(@Param('email') email: string) {
    return this.newsletterService.unsubscribe(email);
  }

  @Get('subscribers')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all subscribers' })
  getSubscribers() {
    return this.newsletterService.getSubscribers();
  }
}
