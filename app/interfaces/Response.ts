export interface IResponse<T> {
  data?: T;
  statusCode: number;
  message?: string;
  error?: string;
}
