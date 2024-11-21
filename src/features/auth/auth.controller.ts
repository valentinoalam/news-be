import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseSuccess } from '@/common/response/response';
import { Session } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Fetches a session based on the provided session ID.
   * @param sessionId - The session ID.
   * @returns The session data.
   */
  @Get('session/:sessionId')
  async getSession(
    @Param('sessionId') sessionId: string,
  ): Promise<ResponseSuccess<Session>> {
    const session = await this.authService.getSession(sessionId);
    return new ResponseSuccess<Session>(
      200, // HTTP OK status code
      'Session fetched successfully',
      session,
    );
  }
  /**
   * Handles Google OAuth authentication.
   * @param googleUser - The user data from Google after successful authentication.
   * @returns A response indicating success or failure.
   */
  @Post('google')
  async googleAuth(@Body() googleUser: any) {
    googleUser.provider = 'google';
    return this.authService.handleAccountAuth(googleUser);
  }

  /**
   * Handles GitHub OAuth authentication.
   * @param githubUser - The user data from GitHub after successful authentication.
   * @returns A response indicating success or failure.
   */
  @Post('github')
  async githubAuth(@Body() githubUser: any) {
    githubUser.provider = 'github';
    return this.authService.handleAccountAuth(githubUser);
  }

  /**
   * Refreshes the authentication token.
   * @param refreshToken - The refresh token to obtain a new access token.
   * @returns A response containing the new access token.
   */
  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  /**
   * Logs out the user, invalidating the session.
   * @param sessionId - The session identifier to invalidate.
   * @returns A response indicating success or failure.
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    return this.authService.logout(req.user);
  }
}
