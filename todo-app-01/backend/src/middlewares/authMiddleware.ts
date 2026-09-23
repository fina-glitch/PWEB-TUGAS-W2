import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';
import { AuthResponse } from '../types';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    sendError(res, 401, 'Akses ditolak. Token tidak ditemukan!');
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthResponse;
    
    // Diubah dari res.locals.userId menjadi req.user sesuai modul
    req.user = decoded; 
    
    next();
  } catch (error) {
    sendError(res, 403, 'Sesi tidak valid atau kedaluwarsa!');
  }
};