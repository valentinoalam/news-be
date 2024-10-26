import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggedMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { ip, method, originalUrl, headers } = req;
    const { statusCode: code } = res;
    const userAgent = req.get('user-agent') || '';

    this.logger.log(`Request: ${method} ${originalUrl}`);

    res.on('finish', () => {
      const { statusCode, statusMessage } = res;
      const contentLength = res.get('content-length');
      const responseTime = Date.now() - start;
      const logFormat = `Response: ${method} ${originalUrl} ${statusCode} ${responseTime}ms Message:${statusMessage} Length: ${contentLength} — ${userAgent} ${ip}`;
      if (statusCode >= 500) {
        return this.logger.error(logFormat);
      }

      if (statusCode >= 400) {
        return this.logger.warn(logFormat);
      }
      this.logger.log(logFormat);

      if (method !== 'GET') {
        this.logger.debug(
          `Request body — ${JSON.stringify(req.body, null, 2)}`,
        );
      }
    });

    res.on('close', () => {
      const contentLength = res.get('content-length');
      const logFormat = `Request: ${method} ${JSON.stringify(headers['host'])}${originalUrl} ${ip} ${code} Length: ${contentLength}`;
      this.logger.log(logFormat);
    });

    next();
  }
}
