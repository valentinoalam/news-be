import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { UsersService } from '@/features/users/services/users.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class UserActivityInterceptor implements NestInterceptor {
  private lastActiveMap = new Map<number, Date>(); // Stores the last active timestamp for each user
  private readonly updateInterval = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor(private readonly usersService: UsersService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.id) {
      const lastActive = this.lastActiveMap.get(user.id);
      const now = new Date();

      if (!lastActive || now.getTime() - lastActive.getTime() > this.updateInterval) {
        // If last activity was not updated recently, update it now
        this.usersService.updateLastActive(user.id).then(() => {
          // Update the last active timestamp in memory
          this.lastActiveMap.set(user.id, now);
        });
      }
    }

    return next.handle();
  }
}