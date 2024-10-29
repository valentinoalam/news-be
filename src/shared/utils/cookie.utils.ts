import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export const cookieExtractor = (req: Request, config: ConfigService) => {
  let token = null;
  const cookieName =
    process.env.NODE_ENV === 'production'
      ? `__Secure-${config.get<string>('app.cookieName')}`
      : config.get<string>('app.cookieName');
  if (req && req.cookies) {
    token = req.cookies[cookieName];
  }
  return token;
};
