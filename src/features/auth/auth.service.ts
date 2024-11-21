import { DatabaseService } from '@core/database/database.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Session } from '@prisma/client';
import { hash } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private async getSessionHash(sessionToken: string): Promise<string> {
    // Combine the session token with the secret
    const combined = `${sessionToken}${this.config.get('app.nextAuthSecret')}`;

    // Hash the combined string using Argon2
    return await hash(combined);
  }

  /**
   * Verifies the user's session from NextAuth.
   * @param sessionId - The session identifier from the request.
   * @returns True if session is valid, false otherwise.
   */
  async validateSession(sessionToken: string) {
    if (!sessionToken) {
      throw new UnauthorizedException('No session token provided');
    }

    try {
      const sessionHash = await this.getSessionHash(sessionToken);

      const session = await this.db.session.findUnique({
        where: {
          sessionToken: sessionHash,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
            },
          },
        },
      });

      // Check if session exists and is not expired
      if (!session || new Date(session.expires) < new Date()) {
        throw new UnauthorizedException('Session expired or invalid');
      }

      return {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid session');
    }
  }

  /**
   * Fetches a session based on the session ID.
   * @param sessionId - The session ID to look up.
   * @returns The session data if found.
   * @throws NotFoundException if the session does not exist.
   */
  async getSession(sessionId: string): Promise<Session> {
    const session = await this.db.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    return session;
  }

  // Keep JWT validation for flexibility
  async validateToken(bearerToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(bearerToken, {
        secret: this.config.get('app.nextAuthSecret'),
      });

      if (!payload.sub || !payload.email) {
        throw new UnauthorizedException('Invalid token structure');
      }

      const user = await this.db.user.findFirst({
        where: {
          id: payload.sub,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid bearer token');
      }

      return {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Create user and session using social account.
   */
  async handleAccountAuth(accountUser: any) {
    // Find or create user in the User table
    const userData = await this.db.user.upsert({
      where: { email: accountUser.email },
      update: {
        name: accountUser.name,
        profile: {
          upsert: {
            create: { avatar: accountUser.picture },
            update: { avatar: accountUser.picture },
          },
        },
        providerAccId: accountUser.accountId,
      },
      create: {
        email: accountUser.email,
        name: accountUser.name,
        profile: {
          create: { avatar: accountUser.picture },
        },
        provider: accountUser.provider,
        providerAccId: accountUser.googleId,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, providerAccId, ...user } = userData;

    const tokens = await this.generateTokens(user);

    // Create session
    const session = await this.db.session.create({
      data: {
        sessionToken: tokens.refreshToken, // Using refreshToken as sessionToken for simplicity
        userId: user.id,
        startTime: new Date(), // Session start time is now
        endTime: null, // End time is initially null
        duration: null, // Duration will be calculated later
        deviceType: accountUser.deviceType || null, // Device type (from accountUser or default null)
        location: accountUser.location || null, // Location (from accountUser or default null)
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration for 7 days
      },
    });

    return {
      user,
      session,
      ...tokens,
    };
  }

  /**
   * Refreshes the authentication token.
   * @param refreshToken - The refresh token to obtain a new access token.
   * @returns A response containing the new access token.
   */
  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = await this.jwt.verify(refreshToken);

      // Find the session with this refresh token
      const session = await this.db.session.findFirst({
        where: {
          sessionToken: refreshToken,
          userId: payload.sub,
        },
      });

      if (!session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get the associated user
      const user = await this.db.user.findUnique({
        where: { id: session.userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Update session with new session token and expiration
      await this.db.session.update({
        where: { id: session.id },
        data: {
          sessionToken: tokens.refreshToken, // Refresh token as session token
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logs out the user, invalidating the session.
   * @param sessionId - The session identifier to invalidate.
   * @returns A response indicating success or failure.
   */
  async logout(user: any) {
    // Remove all sessions for the user
    await this.db.session.deleteMany({
      where: { userId: user.id },
    });

    return { message: 'Logged out successfully' };
  }

  private async generateTokens(user: any) {
    const payload = { email: user.email, sub: user.id };

    return {
      accessToken: this.jwt.sign(payload),
      refreshToken: this.jwt.sign(payload, { expiresIn: '7d' }),
      expiresIn: 3600, // 1 hour in seconds
    };
  }
}
