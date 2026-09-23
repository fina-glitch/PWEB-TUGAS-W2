export interface Meta {
  timestamp: string;
  page?: number;
  perPage?: number;
  totalData?: number;
  totalPages?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T | null;
  meta: Meta;
}