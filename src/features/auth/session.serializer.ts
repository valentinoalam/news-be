import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  /**
   * Serialize the user object into the session.
   * Only non-sensitive data should be serialized.
   */
  serializeUser(
    user: Omit<User, 'password'>,
    done: (err: Error | null, id?: { id: string }) => void,
  ): void {
    done(null, { id: user.id }); // Only store the user ID in the session
  }

  /**
   * Deserialize the user object from the session.
   * Fetch the full user object using the ID stored in the session.
   */
  async deserializeUser(
    payload: { id: string }, // The payload is the object returned from serializeUser
    done: (err: Error | null, user?: Omit<User, 'password'> | null) => void,
  ): Promise<void> {
    try {
      const user = await this.userService.getIAM(payload.id); // Fetch user from the database
      if (!user) {
        return done(null, null); // User not found
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user; // Exclude sensitive fields like password
      done(null, safeUser); // Return the sanitized user object
    } catch (err) {
      done(err, null); // Handle errors
    }
  }
}
