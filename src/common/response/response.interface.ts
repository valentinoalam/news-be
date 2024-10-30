// success: true => message, data
// success: false => errorMessage, error

export interface ResponseInterface<T> {
  success: boolean;
  message: string;
  error_message: string;
  totalRecords: number;
  data: T | T[];
  error: any;
}
