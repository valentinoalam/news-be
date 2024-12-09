import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterSubscriptionDto } from './dto/create-newsletter.dto';
import { RoleGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { SendNewsletterDto } from './dto/send-newsletter.dto';
import { UpdateEmailDto, DeleteSubscriberDto } from './dto/subscriber.dto';
import { PaginationParams } from '@/shared/utils/pagination.util';
@ApiTags('newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  async subscribe(
    @Body() createSubscriptionDto: CreateNewsletterSubscriptionDto,
  ) {
    await this.newsletterService.subscribe(createSubscriptionDto);
    return { message: 'Successfully subscribed.' };
  }

  @Delete('unsubscribe/:email')
  @ApiOperation({ summary: 'Unsubscribe from newsletter' })
  async unsubscribe(@Param('email') email: string) {
    await this.newsletterService.unsubscribe(email);
    return { message: 'Successfully unsubscribed.' };
  }

  @Get('subscribers')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all subscribers' })
  getSubscribers(@Query() params: PaginationParams) {
    return this.newsletterService.getSubscribers(params);
  }

  @Get('status')
  async checkStatus(@Query('email') email: string) {
    const subscribed = await this.newsletterService.checkStatus(email);
    return { email, subscribed };
  }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendNewsletter(@Body() dto: SendNewsletterDto) {
    await this.newsletterService.sendNewsletter(dto.subject, dto.body);
    return { message: 'Newsletter sent to all subscribers.' };
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  async updateEmail(@Body() dto: UpdateEmailDto) {
    await this.newsletterService.updateEmail(dto.oldEmail, dto.newEmail);
    return { message: 'Email updated successfully.' };
  }

  @Delete('subscriber')
  @HttpCode(HttpStatus.OK)
  async deleteSubscriber(@Body() dto: DeleteSubscriberDto) {
    await this.newsletterService.deleteSubscriber(dto.email);
    return { message: 'Subscriber removed successfully.' };
  }
}
