import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case 'P2002': // Unique constraint violation
        status = HttpStatus.CONFLICT;
        message = 'Resource already exists';
        break;
      case 'P2025': // Not found
        status = HttpStatus.NOT_FOUND;
        message = 'Resource not found';
        break;
      case 'P2003': // Foreign key constraint failed
        status = HttpStatus.BAD_REQUEST;
        message = 'Related resource not found';
        break;
      case 'P2000': // Value too long for the column
        status = HttpStatus.BAD_REQUEST;
        message = 'Input value is too long';
        break;
      case 'P2004': // Constraint failed on a model field
        status = HttpStatus.BAD_REQUEST;
        message = 'Constraint failed on a model field';
        break;
      case 'P2011': // Null constraint violation
        status = HttpStatus.BAD_REQUEST;
        message = 'A required field cannot be null';
        break;
      case 'P2012': // Missing required value
        status = HttpStatus.BAD_REQUEST;
        message = 'A required value is missing';
        break;
      case 'P2014': // Mismatched related records
        status = HttpStatus.CONFLICT;
        message = 'Mismatched related records';
        break;
      case 'P2015': // Record not found for update
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found for update';
        break;
      case 'P2016': // Query interpretation error
        status = HttpStatus.BAD_REQUEST;
        message = 'Query interpretation error';
        break;
      case 'P2023': // Inconsistent query
        status = HttpStatus.BAD_REQUEST;
        message = 'Inconsistent query';
        break;
      default: // Fallback for other error codes
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = exception.message || 'An unknown error occurred';
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
