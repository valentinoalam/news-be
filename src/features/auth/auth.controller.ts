import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleAuth(@Body() googleUser: any) {
    googleUser.provider = 'google';
    return this.authService.handleAccountAuth(googleUser);
  }

  @Post('github')
  async githubAuth(@Body() githubUser: any) {
    githubUser.provider = 'github';
    return this.authService.handleAccountAuth(githubUser);
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    return this.authService.logout(req.user);
  }
}
