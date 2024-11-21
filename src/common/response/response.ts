import { IApiResponse } from './response.interface';
export class ResponseError<T> implements IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T | T[] | null;
  metadata?: {
    totalRecords?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  errors?: Array<{
    field?: string;
    code?: string;
    message: string;
  }>;

  constructor(
    statusCode: number,
    message: string,
    errorDetails?: Array<{ field?: string; code?: string; message: string }>,
    data: T | T[] | null = null,
    metadata?: {
      totalRecords?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    },
  ) {
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.metadata = metadata;
    this.errors = errorDetails;

    console.error(
      `${new Date().toISOString()} - [ResponseError]: Status: ${statusCode}, Message: ${message}, Errors: ${
        errorDetails ? JSON.stringify(errorDetails) : 'None'
      }`,
    );
  }
}

export class ResponseSuccess<T> implements IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T | T[];
  metadata?: {
    totalRecords?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  errors?: Array<{
    field?: string;
    code?: string;
    message: string;
  }>;

  constructor(
    statusCode: number,
    message: string,
    data: T | T[],
    metadata?: {
      totalRecords?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    },
    logData: boolean = true,
  ) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.metadata = metadata;

    if (logData) {
      try {
        const obfuscatedData = JSON.parse(JSON.stringify(data));
        if (Array.isArray(obfuscatedData)) {
          obfuscatedData.forEach((item) => {
            if (item.token) item.token = '*******';
          });
        } else if (obfuscatedData.token) {
          obfuscatedData.token = '*******';
        }
        console.log(
          `${new Date().toISOString()} - [ResponseSuccess]: Status: ${statusCode}, Message: ${message}, Data: ${JSON.stringify(
            obfuscatedData,
          )}`,
        );
      } catch (error) {
        console.error('Logging error:', error);
      }
    }
  }
}
