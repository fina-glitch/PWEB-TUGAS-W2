import { Response } from 'express';
import { ApiResponse } from '../types';

// Fungsi pembantu membuat jam saat ini
export const generateTimestamp = (): string => {
  return new Date().toISOString();
};

// Fungsi jika response sukses biasa
export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T | null
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data: data ?? null,
    meta: {
      timestamp: generateTimestamp(),
    },
  };
  res.status(statusCode).json(response);
};

// Fungsi jika response sukses berhalaman (pagination)
export const sendSuccessWithPagination = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
  pagination: { page: number; perPage: number; totalData: number; totalPages: number }
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta: {
      timestamp: generateTimestamp(),
      page: pagination.page,
      perPage: pagination.perPage,
      totalData: pagination.totalData,
      totalPages: pagination.totalPages,
    },
  };
  res.status(statusCode).json(response);
};

// Fungsi jika response error (gagal)
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    data: data ?? null,
    meta: {
      timestamp: generateTimestamp(),
    },
  };
  res.status(statusCode).json(response);
};