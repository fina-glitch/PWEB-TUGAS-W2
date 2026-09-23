import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes/index';
import { randomUUID } from 'crypto';
import { sendSuccess, sendError } from './utils/response';

const app = express();

app.use(cors({ exposedHeaders: ['X-Request-Id'] }));
app.use(express.json());

// requestId per-request dikirim lewat header
app.use((req, res, next) => {
  const requestId = randomUUID();
  res.locals.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
});

app.use((req, res, next) => {
  console.log(`[${res.locals.requestId}] ${req.method} ${req.originalUrl}`);
  next();
});

// Route utama – cek apakah server berjalan
app.get('/', (req, res) => {
  sendSuccess(res, 200, 'Backend Todo Praktikum Berjalan Mulus!');
});

// Daftarkan semua route dengan prefix /api
app.use('/api', routes);

// 404 Handler – dipanggil jika tidak ada route yang cocok
app.use((req: Request, res: Response) => {
  sendError(res, 404, `Route ${req.method} ${req.url} tidak ditemukan!`);
});

// Global Error Handler – menangkap error yang tidak tertangani
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Terjadi error:', err.message);
  sendError(res, 500, 'Terjadi kesalahan pada server.');
});

export default app;