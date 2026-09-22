import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/user';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body || {};

  if (!email || !password || !name) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Los campos email, password y name son obligatorios' },
    });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, name });
    
    res.status(201).json({
      success: true,
      data: { userId: newUser._id, email: newUser.email, name: newUser.name },
      error: null,
    });
  } catch (err: unknown) {
    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
      res.status(409).json({
        success: false,
        data: null,
        error: { message: 'Ese email ya está en uso' },
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      data: null,
      error: { message: 'Error interno del servidor' },
    });
  }
};