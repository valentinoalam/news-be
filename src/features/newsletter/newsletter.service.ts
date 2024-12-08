import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewsletterSubscriptionDto } from './dto/create-newsletter.dto';
// import { UpdateNewsletterSubscriptionDto } from './dto/update-newsletter.dto';
import { DatabaseService } from 'src/core/database/database.service';
import { Prisma } from '@prisma/client';
import { MailerService } from '../../shared/mailer/mailer.service';
import { INewsletterService } from '../../shared/interfaces/newsletter.interface';

@Injectable()
export class NewsletterService implements INewsletterService {
  constructor(
    private prisma: DatabaseService,
    private emailService: MailerService,
  ) {}

  async subscribe(data: CreateNewsletterSubscriptionDto) {
    const { email, categoryIds, userId } = data;
    try {
      return await this.prisma.newsletterSubscription.upsert({
        where: { email },
        update: {
          status: 'ACTIVE',
          categories: {
            connect: categoryIds.map((id) => ({ id })),
          },
          ...(userId && { userId }),
        },
        create: {
          email,
          status: 'ACTIVE',
          categories: {
            connect: categoryIds.map((id) => ({ id })),
          },
          ...(userId && { userId }),
        },
        include: {
          categories: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already subscribed');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('One or more categories not found');
        }
      }
      throw error;
    }
  }

  async unsubscribe(email: string) {
    return await this.prisma.newsletterSubscription.update({
      where: { email },
      data: {
        status: 'UNSUBSCRIBED',
        categories: {
          set: [], // Remove all category connections
        },
      },
    });
  }

  async updateCategories(email: string, categoryIds: number[]) {
    return this.prisma.newsletterSubscription.update({
      where: { email },
      data: {
        categories: {
          set: categoryIds.map((id) => ({ id })),
        },
      },
      include: {
        categories: true,
      },
    });
  }

  async getSubscribersByCategory(categoryId: number) {
    return this.prisma.newsletterSubscription.findMany({
      where: {
        status: 'ACTIVE',
        categories: {
          some: {
            id: categoryId,
          },
        },
      },
      include: {
        categories: true,
        user: {
          select: {
            id: true,
            // Add other user fields you need
          },
        },
      },
    });
  }

  async getSubscriptionStatus(email: string) {
    const subscription = await this.prisma.newsletterSubscription.findUnique({
      where: { email },
      include: {
        categories: true,
      },
    });

    if (!subscription) {
      return {
        subscribed: false,
        categories: [],
      };
    }

    return {
      subscribed: subscription.status === 'ACTIVE',
      status: subscription.status,
      categories: subscription.categories,
    };
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
  async checkStatus(email: string): Promise<string> {
    const subscriber = await this.prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    return subscriber?.status;
  }

  async getAllSubscribers(): Promise<any[]> {
    return this.prisma.newsletterSubscription.findMany({
      where: { status: 'ACTIVE' },
      select: {
        email: true,
        status: true,
      },
    });
  }

  async sendNewsletter(subject: string, body: string): Promise<void> {
    const subscribers = await this.prisma.newsletterSubscription.findMany({
      where: { status: 'ACTIVE' },
    });

    for (const subscriber of subscribers) {
      await this.emailService.sendEmail(subscriber.email, subject, body);
    }
  }

  async updateEmail(oldEmail: string, newEmail: string): Promise<void> {
    try {
      await this.prisma.newsletterSubscription.update({
        where: { email: oldEmail },
        data: { email: newEmail },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Subscriber not found');
        }
        if (error.code === 'P2002') {
          throw new ConflictException('New email is already registered');
        }
      }
      throw error;
    }
  }

  async deleteSubscriber(email: string): Promise<void> {
    try {
      await this.prisma.newsletterSubscription.delete({
        where: { email },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Subscriber not found');
        }
      }
      throw error;
    }
  }
}
