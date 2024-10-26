export interface DataResponse<T> {
  records: T[];
  totalRecords: number;
  page: number;
}
