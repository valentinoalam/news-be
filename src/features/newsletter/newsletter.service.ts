import { Injectable } from '@nestjs/common';
import { CreateNewsletterSubscriptionDto } from './dto/create-newsletter.dto';
// import { UpdateNewsletterSubscriptionDto } from './dto/update-newsletter.dto';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class NewsletterService {
  constructor(private prisma: DatabaseService) {}

  async subscribe(data: CreateNewsletterSubscriptionDto) {
    return this.prisma.newsletterSubscription.create({
      data: {
        ...data,
        // categories: {
        //   connect: data.categoryIds?.map((id) => ({ id })),
        // },
      },
    });
  }

  async unsubscribe(email: string) {
    return this.prisma.newsletterSubscription.update({
      where: { email },
      data: {
        status: 'UNSUBSCRIBED',
      },
    });
  }

  async getSubscribers() {
    return this.prisma.newsletterSubscription.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        categories: true,
      },
    });
  }
}
