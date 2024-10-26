import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AuthExceptionsFilter<T> implements ExceptionFilter {
  private readonly exceptionMessages = new Map<any, string>([
    [UnauthorizedException, 'Unauthorized access - Please login first!'],
    [ForbiddenException, 'Forbidden access - Access Declined!'],
    [BadRequestException, 'Bad request - Fill all required correctly'],
    [NotFoundException, 'Not found - Invalid credential'],
    [InternalServerErrorException, 'Internal server error - Try Again Later'],
  ]);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    let exceptionMessage = exception.message;
    for (const [ExceptionType, message] of this.exceptionMessages) {
      if (exception instanceof ExceptionType) {
        exceptionMessage = message;
        break;
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exceptionMessage,
    });
  }
}
