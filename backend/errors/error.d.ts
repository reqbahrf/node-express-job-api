export interface CustomError {
  statusCode?: number;
  message: string;
  name: string;
  code?: number; // e.g. 11000 for duplicate key
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
  value?: unknown;
}
