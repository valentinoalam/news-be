import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export const cookieExtractor = (req: Request, configService: ConfigService) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[configService.get<string>('app.cookieName')];
  }
  return token;
};
