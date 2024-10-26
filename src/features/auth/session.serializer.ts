import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/entities';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(
    user: Omit<User, 'password'>,
    done: (err: Error, user: Omit<User, 'password'>) => void,
  ): void {
    done(null, user);
  }

  // Deserialize the user from the session
  async deserializeUser(
    payload: any, // This is usually the user ID or user object
    done: (err: Error, user: Omit<User, 'password'> | null) => void,
  ): Promise<void> {
    try {
      const user = await this.usersService.getById(payload.id); // Retrieve the user based on the payload (usually the user ID)
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}
