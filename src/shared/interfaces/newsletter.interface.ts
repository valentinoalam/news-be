import { CreateNewsletterSubscriptionDto } from '../../features/newsletter/dto/create-newsletter.dto';
import { NewsletterSubscription } from '../../features/newsletter/entities/newsletter.entity';

export interface INewsletterService {
  subscribe(
    data: CreateNewsletterSubscriptionDto,
  ): Promise<NewsletterSubscription>;
  unsubscribe(email: string): Promise<NewsletterSubscription>;
  checkStatus(email: string): Promise<string>;
  getAllSubscribers(): Promise<any[]>;
  sendNewsletter(subject: string, body: string): Promise<void>;
  updateEmail(oldEmail: string, newEmail: string): Promise<void>;
  deleteSubscriber(email: string): Promise<void>;
}
