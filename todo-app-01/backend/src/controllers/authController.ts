import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { RegisterDTO, LoginDTO, AuthResponse } from '../types/index.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password }: RegisterDTO = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create(username, email, hashedPassword);
    
    sendSuccess(res, 201, 'Registrasi berhasil!');
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      sendError(res, 409, 'Username atau Email sudah terdaftar!');
      return;
    }
    sendError(res, 500, 'Error server.');
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password }: LoginDTO = req.body;

  try {
    const user = await UserModel.findByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      sendError(res, 401, 'Username atau password salah!');
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '2h' });
    
    const responseData: AuthResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      token,
    };

    sendSuccess(res, 200, 'Login berhasil!', responseData);
  } catch (error) {
    sendError(res, 500, 'Error server.');
  }
};