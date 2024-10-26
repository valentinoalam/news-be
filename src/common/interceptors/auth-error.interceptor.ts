import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class AuthErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      catchError((error) => {
        // Customize the response based on the error
        if (error) {
          response.status(401).json({
            statusCode: 401,
            message: error.message,
            timestamp: new Date().toISOString(),
          });
        } else {
          response.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            timestamp: new Date().toISOString(),
          });
        }

        return throwError(error);
      }),
    );
  }
}
