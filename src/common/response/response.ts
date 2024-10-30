import { ResponseInterface } from './response.interface';

export class ResponseError<T> implements ResponseInterface<T> {
  message: string;
  data: T | T[];
  error_message: string | null;
  error: any;
  totalRecords: number;
  success: boolean;

  constructor(infoMessage: string, data?: T, error?: any) {
    this.success = false;
    this.message = infoMessage;
    this.data = data ?? null;
    this.error_message = error?.message || null;
    this.error = error;
    this.totalRecords = Array.isArray(data) ? data.length : 0;

    console.warn(
      `${new Date().toISOString()} - [ResponseError]: ${infoMessage}${
        data ? ' - ' + JSON.stringify(data) : ''
      }${error ? ' - ' + JSON.stringify(error) : ''}`,
    );
  }
}

export class ResponseSuccess<T> implements ResponseInterface<T> {
  message: string;
  data: T | T[];
  error_message: null;
  error: null;
  totalRecords: number;
  success: boolean;

  constructor(infoMessage: string, data: T, notLog = false) {
    this.success = true;
    this.message = infoMessage;
    this.data = data;
    this.error_message = null;
    this.error = null;
    this.totalRecords = Array.isArray(data) ? data.length : 1;

    if (!notLog) {
      try {
        const obfuscatedData = JSON.parse(JSON.stringify(data));
        if (obfuscatedData && obfuscatedData.token) {
          obfuscatedData.token = '*******';
        }
        console.log(
          `${new Date().toISOString()} - [ResponseSuccess]: ${infoMessage} - ${JSON.stringify(
            obfuscatedData,
          )}`,
        );
      } catch (error) {
        console.error('Logging error:', error);
      }
    }
  }
}
