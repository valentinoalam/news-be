// success: true => message, data
// success: false => errorMessage, error

export interface IApiResponse<T> {
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
}
